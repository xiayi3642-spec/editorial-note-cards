#!/usr/bin/env node
// 批量把本地 HTML 渲染成高清 PNG，并对每张卡做自动布局审计。
// 借鉴 lieflat-cards 的 render.py 思路：不靠人眼看图，用 DOM 实测抓溢出/裁剪/单行槽换行。
// 用法:
//   node html2png.mjs <a.html> [<b.html> ...] [--width W] [--height H] [--scale N] [--out DIR]
//   node html2png.mjs <a.html> ... --check     # 只审计不截图；有布局问题则退出码 1
// 审计项（对每张卡，边界取 .card 或 body）:
//   spills    有文本元素超出卡边缘（给 px/边/selector/文本）
//   clipped   元素被 overflow:hidden 截断（scrollHeight>clientHeight）
//   overfull  短值槽被塞成长句而换行（用 Range 实测真实换行）
// 发现任一问题 → 打印报告并最终退出码 1，禁止交付带布局问题的卡。
// 依赖: playwright + 系统 chromium（脚本自动探测）。
import { createRequire } from 'node:module';
import { resolve, join, basename, extname, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

// 定位 playwright：优先本地，其次常见全局安装位置
const require = createRequire(import.meta.url);
function loadPlaywright() {
  const candidates = [
    'playwright',
    '/opt/vm/preinstall/npm-global/lib/node_modules/playwright',
    '/home/user/.npm-global/lib/node_modules/playwright',
  ];
  for (const c of candidates) {
    try { return require(c); } catch (e) { /* try next */ }
  }
  throw new Error('找不到 playwright 模块，请确认已全局安装: npm i -g playwright');
}
const { chromium } = loadPlaywright();

// 探测可用的系统 Chromium（避免 playwright 自带浏览器版本不匹配）
function findChromium() {
  const candidates = [
    '/usr/local/bin/chromium', '/usr/local/bin/chromium-browser',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  try { return execSync('command -v chromium chromium-browser google-chrome 2>/dev/null | head -1', { encoding: 'utf8' }).trim(); } catch (e) { /* ignore */ }
  return undefined;
}

// 单行槽：本该一行短值的元素（序号、缩写、各级标题、kicker）。
// 把句子塞进这里而换行，是内容错误而非 CSS 错误，会撑破卡面。
// 注意排除 .foot（它是两栏 flex，整块测行数会误报）；flex/grid 结构容器也不测自身行数。
const SLOT_SELECTORS = [
  '.kicker', '.sec .lbl .no', '.sec .lbl .t', '.sec .lbl .an',
  '.f .t', '.cl .abbr', '.cl .t',
];

// 布局容器（flex/grid）：高度由内容撑起，报它自身溢出没意义，交给叶子文本。
const CONTAINER_DISPLAY = ['flex', 'inline-flex', 'grid', 'inline-grid'];

// 审计脚本：在页内执行，返回该卡（.card 或 body）的溢出/裁剪/单行槽换行报告
async function audit(page) {
  return await page.evaluate(() => {
    // 单行槽（本该一行的短值）与结构容器 display——内联，因 evaluate 只收一个参数
    const SLOTS = ['.kicker', '.sec .lbl .no', '.sec .lbl .t', '.sec .lbl .an', '.f .t', '.cl .abbr', '.cl .t'];
    const DISP = ['flex', 'inline-flex', 'grid', 'inline-grid'];
    const card = document.querySelector('.card') || document.body;
    const rect = card.getBoundingClientRect();
    const label = el => el.tagName.toLowerCase() +
      (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    const hasText = el => ((el.textContent || '').trim().length > 0);
    const spills = [], clipped = [], overfull = [];

    for (const el of card.querySelectorAll('*')) {
      if (el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'BR') continue;
      if (!hasText(el)) continue;
      const cs = getComputedStyle(el);
      // flex/grid 结构容器自身不算"文本溢出"，继续测其子元素
      if (DISP.includes(cs.display)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const edges = {
        bottom: r.bottom - rect.bottom,
        right: r.right - rect.right,
        top: rect.top - r.top,
        left: rect.left - r.left,
      };
      const worst = Object.entries(edges).filter(([, v]) => v > 1)
        .sort((a, b) => b[1] - a[1])[0];
      if (worst) spills.push({
        sel: label(el), edge: worst[0], px: Math.round(worst[1]),
        text: (el.textContent || '').trim().slice(0, 40),
      });
      const hidden = el.scrollHeight - el.clientHeight;
      if (hidden > 2 && cs.overflow !== 'visible') {
        clipped.push({ sel: label(el), px: hidden });
      }
    }

    for (const s of SLOTS) {
      for (const el of card.querySelectorAll(s)) {
        const t = (el.textContent || '').trim();
        if (!t) continue;
        // 用 Range 测真实文本行数（block 单行槽的 el.getClientRects 只返回元素盒，会漏检）
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = range.getClientRects().length;
        range.detach();
        if (lines > 1) overfull.push({ sel: s, lines, text: t.slice(0, 30) });
      }
    }

    return { spills: spills.slice(0, 6), clipped: clipped.slice(0, 6), overfull: overfull.slice(0, 6) };
  });
}

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const has = name => args.includes(name);
const width = Number(flag('--width') || '1280');
const height = Number(flag('--height') || '1600');
const scale = Number(flag('--scale') || '2');
const outDir = flag('--out');
const checkOnly = has('--check');
const FLAGS = new Set(['--width', '--height', '--scale', '--out']);
const files = [];
for (let i = 0; i < args.length; i++) {
  if (FLAGS.has(args[i])) { i++; continue; }
  if (args[i].startsWith('--')) continue;
  files.push(args[i]);
}

if (!files.length) {
  console.error('用法: node html2png.mjs <a.html> [<b.html> ...] [--width W] [--height H] [--scale N] [--out DIR] [--check]');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: findChromium() || undefined });
let problems = 0;
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  for (const f of files) {
    const src = resolve(f);
    await page.goto('file://' + src, { waitUntil: 'networkidle' });

    // 先审计
    const rep = await audit(page);
    const fileProblems = rep.spills.length + rep.clipped.length + rep.overfull.length;
    const label = basename(src);
    if (fileProblems === 0) {
      console.log(`${label}: 审计通过（无溢出/裁剪/单行槽换行）`);
    } else {
      problems += fileProblems;
      console.log(`${label}: 发现 ${fileProblems} 处布局问题 ↓`);
      for (const s of rep.spills) console.log(`  溢出 ${s.px}px 于${s.edge} — ${s.sel} “${s.text}”`);
      for (const c of rep.clipped) console.log(`  被裁剪 ${c.px}px — ${c.sel}（勿用 overflow:hidden 掩盖，减内容修复）`);
      for (const o of rep.overfull) console.log(`  短值槽换行 ${o.lines} 行 — ${o.sel} “${o.text}”（该槽只放短值，删短）`);
    }

    if (checkOnly) continue;
    const name = basename(src, extname(src)) + '.png';
    const target = outDir ? join(resolve(outDir), name) : join(dirname(src), name);
    await mkdir(dirname(target), { recursive: true });
    await page.screenshot({ path: target, fullPage: true });
    console.log(target);
  }
} finally { await browser.close(); }

if (problems) {
  console.log(`\n共 ${problems} 处布局问题 —— 修复后再交付（不可用 overflow:hidden 掩盖）。`);
  process.exit(1);
}
console.log('\n所有卡片审计通过，无溢出/裁剪/单行槽换行。');

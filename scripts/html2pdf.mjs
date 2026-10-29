#!/usr/bin/env node
// 把一组笔记卡 HTML 渲染并合并成一份 PDF（每张卡一页，竖版 1080×1440）。
// 用法:
//   node html2pdf.mjs <a.html> [<b.html> ...] --out 输出.pdf [--width W] [--height H] [--toc 目录页.html]
// 依赖: playwright + pdf-lib（全局安装）。
// --toc：插入一份目录页（排在封面之后、内容页之前），并读取目录项 data-target
//        （= 对应内容页在命令行 files 中的序号，1-based），为每项添加 PDF 内部
//        GoTo 链接，点击即可跳转到对应内容页。目录页走矢量打印（与内容页一致）。
import { createRequire } from 'node:module';
import { resolve, join, basename, extname, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
function loadModule(name, extra) {
  const candidates = [name, ...(extra || [])];
  for (const c of candidates) { try { return require(c); } catch (e) { /* next */ } }
  throw new Error(`找不到 ${name} 模块，请确认已全局安装: npm i -g ${name}`);
}
const { chromium } = loadModule('playwright', [
  '/opt/vm/preinstall/npm-global/lib/node_modules/playwright',
  '/home/user/.npm-global/lib/node_modules/playwright',
]);
const { PDFDocument, PDFName } = loadModule('pdf-lib', [
  '/opt/vm/preinstall/npm-global/lib/node_modules/pdf-lib',
]);

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

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const width = Number(flag('--width') || '1080');
const height = Number(flag('--height') || '1440');
const out = flag('--out');
const tocFile = flag('--toc');
const FLAGS = new Set(['--width', '--height', '--out', '--toc']);
const files = [];
for (let i = 0; i < args.length; i++) {
  if (FLAGS.has(args[i])) { i++; continue; }
  if (args[i].startsWith('--')) continue;
  files.push(args[i]);
}
if (!files.length || !out) {
  console.error('用法: node html2pdf.mjs <a.html> [<b.html> ...] --out 输出.pdf [--width W] [--height H] [--toc 目录页.html]'); process.exit(2);
}

// CSS px → PDF pt（96dpi: 1pt = 1.333px）
const ptW = width * 0.75;
const ptH = height * 0.75;
// 文件名包含 cover 的页走截图位图路径（避免 text-shadow 在 iPad PDF 阅读器里显示成矩形块）
const isCover = f => /cover/i.test(basename(f));

const browser = await chromium.launch({ executablePath: findChromium() || undefined });
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  const merged = await PDFDocument.create();

  // files 只含 封面 + 内容页。记录每个文件对应的 PDF 页 index（0-based），供目录跳转使用。
  const pageIndexOf = new Map();
  for (const f of files) {
    const src = resolve(f);
    await page.goto('file://' + src, { waitUntil: 'networkidle' });
    if (isCover(f)) {
      const png = await page.screenshot({ type: 'png' });
      const img = await merged.embedPng(png);
      const p = merged.addPage([ptW, ptH]);
      p.drawImage(img, { x: 0, y: 0, width: ptW, height: ptH });
    } else {
      const bytes = await page.pdf({
        width, height,
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      const srcDoc = await PDFDocument.load(bytes);
      const copied = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const p of copied) merged.addPage(p);
    }
    pageIndexOf.set(f, merged.getPageCount() - 1);
  }

  // 目录页：渲染并插入到封面之后（无封面则插入到最前）。目录页本身不在 files 中。
  if (tocFile) {
    const tocSrc = resolve(tocFile);
    await page.goto('file://' + tocSrc, { waitUntil: 'networkidle' });
    // 用 DOM 实测每个目录项的跳转目标（data-target = 内容页文件名）
    const tocItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.toc-item')).map(el => {
        const r = el.getBoundingClientRect();
        return {
          target: el.getAttribute('data-target'),
          rect: { x1: r.left, y1: r.top, x2: r.right, y2: r.bottom },
        };
      });
    });
    // 渲染目录页本体为矢量
    const tocBytes = await page.pdf({
      width, height,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const tocDoc = await PDFDocument.load(tocBytes);
    const tocCopied = await merged.copyPages(tocDoc, tocDoc.getPageIndices());
    // 插入位置：有封面（index0 是封面）则插到 1，否则插到 0
    const hasCover = files.some(isCover);
    const tocInsertAt = hasCover ? 1 : 0;
    const tocPage = merged.insertPage(tocInsertAt, tocCopied[0]);

    // 插入目录页后，原内容页的 index 全部 +1
    for (const f of files) pageIndexOf.set(f, pageIndexOf.get(f) + 1);

    // 为每个目录项添加 GoTo 内部链接注解（点击跳转到对应内容页）
    const ctx = tocPage.node.context;
    for (const item of tocItems) {
      const destFile = files.find(f => basename(f) === item.target || f === item.target);
      const targetIdx = destFile ? pageIndexOf.get(destFile) : undefined;
      if (targetIdx === undefined) {
        console.warn(`[目录] 跳过无法解析的跳转目标：${item.target}（应在 files 中）`);
        continue;
      }
      const destPage = merged.getPage(targetIdx);
      // CSS 坐标 → PDF 坐标（PDF 原点在左下，y 翻转）
      const scale = 0.75;
      const rect = [
        item.rect.x1 * scale,
        ptH - item.rect.y2 * scale,
        item.rect.x2 * scale,
        ptH - item.rect.y1 * scale,
      ];
      // 构造 /Link 注解：Subtype=Link，A/S=GoTo，D=[目标页ref, /Fit]
      const annot = ctx.obj({
        Type: PDFName.of('Annot'),
        Subtype: PDFName.of('Link'),
        Rect: ctx.obj(rect),
        Border: ctx.obj([0, 0, 0]),
        A: ctx.obj({
          S: PDFName.of('GoTo'),
          D: [destPage.ref, PDFName.of('Fit')],
        }),
      });
      const annotRef = ctx.register(annot);
      tocPage.node.addAnnot(annotRef);
      console.log(`[目录] ${item.target} → 第 ${targetIdx + 1} 页 (${destPage.ref.objectNumber})`);
    }
  }

  await mkdir(dirname(resolve(out)), { recursive: true });
  const finalBytes = await merged.save();
  const { writeFile } = await import('node:fs/promises');
  await writeFile(resolve(out), finalBytes);
  console.log(resolve(out));
} finally { await browser.close(); }

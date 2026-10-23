#!/usr/bin/env node
// 把一组笔记卡 HTML 渲染并合并成一份 PDF（每张卡一页，竖版 1080×1440）。
// 用法:
//   node html2pdf.mjs <a.html> [<b.html> ...] --out 输出.pdf [--width W] [--height H]
// 依赖: playwright + pdf-lib（全局安装）。
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
const { PDFDocument } = loadModule('pdf-lib', [
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
const FLAGS = new Set(['--width', '--height', '--out']);
const files = [];
for (let i = 0; i < args.length; i++) {
  if (FLAGS.has(args[i])) { i++; continue; }
  if (args[i].startsWith('--')) continue;
  files.push(args[i]);
}
if (!files.length || !out) {
  console.error('用法: node html2pdf.mjs <a.html> [<b.html> ...] --out 输出.pdf [--width W] [--height H]'); process.exit(2);
}

const browser = await chromium.launch({ executablePath: findChromium() || undefined });
try {
  const page = await browser.newPage({ viewport: { width, height } });
  const merged = await PDFDocument.create();
  for (const f of files) {
    const src = resolve(f);
    await page.goto('file://' + src, { waitUntil: 'networkidle' });
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
  await mkdir(dirname(resolve(out)), { recursive: true });
  const finalBytes = await merged.save();
  const { writeFile } = await import('node:fs/promises');
  await writeFile(resolve(out), finalBytes);
  console.log(resolve(out));
} finally { await browser.close(); }

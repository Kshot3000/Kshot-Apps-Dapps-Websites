// Sanity checks for the sellable templates:
//  1. every local href/src in each HTML page resolves to a real file,
//  2. every JS file parses, and config + app run without errors in a stub DOM,
//  3. no seller branding, wallet, or personal email/address leaks into products or zips.
// Usage: node products/check.mjs   (run build.mjs first so the zips exist)
import { readdir, readFile, access } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from './build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
let failures = 0;
const fail = (m) => { failures++; console.error('FAIL ' + m); };

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p)); else out.push(p);
  }
  return out;
}

const FORBIDDEN = [/FEqXq/i, /kcaidevelopment/i, /kshot/i, /paypal/i, /github\.io/i, /\/Users\/|\/home\//];
// Emails: anything like a@b.tld. Placeholders ({{EMAIL}}) are not emails, so they pass.
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/g;
function scan(label, text) {
  for (const re of FORBIDDEN) if (re.test(text)) fail(`${label}: contains ${re}`);
  for (const m of text.match(EMAIL) || []) fail(`${label}: contains email-like text "${m}"`);
}

function unzip(buf) {
  const files = []; let i = 0;
  while (buf.readUInt32LE(i) === 0x04034b50) {
    const method = buf.readUInt16LE(i + 8), csize = buf.readUInt32LE(i + 18), nlen = buf.readUInt16LE(i + 26), xlen = buf.readUInt16LE(i + 28);
    const name = buf.subarray(i + 30, i + 30 + nlen).toString(), start = i + 30 + nlen + xlen, raw = buf.subarray(start, start + csize);
    files.push({ name, data: method === 8 ? inflateRawSync(raw) : raw }); i = start + csize;
  }
  return files;
}

function stubDom() {
  const els = {};
  const mk = () => {
    const e = { style: {}, classList: { add() {}, remove() {} }, children: [], textContent: '', append(...c) { e.children.push(...c); }, setAttribute() {}, addEventListener() {}, remove() {} };
    return e;
  };
  const document = { getElementById: (id) => (els[id] ??= mk()), createElement: mk, createRange: () => ({ selectNodeContents() {} }), head: mk(), documentElement: { style: { setProperty() {} } }, title: '' };
  return { document, location: { href: 'https://example.com/', search: '' }, navigator: {}, URLSearchParams, URL, FormData: class {}, getSelection: () => ({ removeAllRanges() {}, addRange() {} }) };
}

for (const slug of PRODUCTS) {
  const root = path.join(here, slug), site = path.join(root, 'site');
  for (const req of ['README.md', 'LICENSE.txt', 'CHANGELOG.md', 'site/index.html', 'site/config.js']) {
    await access(path.join(root, req)).catch(() => fail(`${slug}: missing ${req}`));
  }
  const files = await walk(root);
  for (const f of files) {
    const rel = path.relative(here, f), text = await readFile(f, 'utf8');
    if (!rel.includes('vendor/')) scan(rel, text); // vendored MIT library keeps its own author header
    else for (const re of FORBIDDEN) if (re.test(text)) fail(`${rel}: contains ${re}`);
    if (f.endsWith('.js')) { try { new vm.Script(text, { filename: rel }); } catch (e) { fail(`${rel}: ${e.message}`); } }
    if (f.endsWith('.html')) {
      const ids = new Set([...text.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
      for (const m of text.matchAll(/\b(?:href|src|action)="([^"]+)"/g)) {
        const url = m[1];
        if (/^(?:https?:|mailto:|tel:|data:|solana:)/.test(url) || url.includes('{{')) continue;
        if (url.startsWith('#')) { if (url.length > 1 && !ids.has(url.slice(1))) fail(`${rel}: missing fragment ${url}`); continue; }
        const local = url.split(/[?#]/)[0];
        const target = path.resolve(path.dirname(f), local, local.endsWith('/') || local === '' ? 'index.html' : '');
        if (!target.startsWith(site)) fail(`${rel}: ${url} points outside site/`);
        await access(target).then(() => console.log(`ok  ${rel} -> ${url}`), () => fail(`${rel}: broken link ${url}`));
      }
    }
  }
  // Run config.js + app.js (and pay page) in a stub DOM to catch runtime errors with placeholders left in.
  const pages = [['config.js', 'app.js']];
  if (slug === 'solana-token-launch-site-kit') pages.push(['config.js', 'vendor/qrcode.js', 'pay/pay.js']);
  for (const scripts of pages) {
    const ctx = stubDom(); ctx.window = ctx; vm.createContext(ctx);
    try {
      for (const s of scripts) vm.runInContext(await readFile(path.join(site, s), 'utf8'), ctx, { filename: s });
      const setup = ctx.document.getElementById(scripts.at(-1) === 'pay/pay.js' ? 'warn' : 'setup').textContent;
      if (!setup.includes('Setup')) fail(`${slug}/${scripts.at(-1)}: setup warning not shown while placeholders remain`);
      else console.log(`ok  ${slug}/${scripts.at(-1)} runs; shows: ${setup.slice(0, 70)}...`);
    } catch (e) { fail(`${slug}/${scripts.join('+')}: runtime error ${e.message}`); }
  }
}

for (const z of (await readdir(path.join(here, 'dist')).catch(() => [])).filter(f => f.endsWith('.zip'))) {
  const entries = unzip(await readFile(path.join(here, 'dist', z)));
  for (const { name, data } of entries) {
    if (name.includes('..') || name.startsWith('/')) fail(`${z}: unsafe path ${name}`);
    const text = data.toString('utf8');
    if (name.includes('vendor/')) { for (const re of FORBIDDEN) if (re.test(text)) fail(`${z}:${name} contains ${re}`); }
    else scan(`${z}:${name}`, text);
  }
  console.log(`ok  dist/${z}: ${entries.length} files scanned`);
}

if (failures) { console.error(`\n${failures} problem(s) found`); process.exit(1); }
console.log('\nAll product checks passed.');

// Packages each product folder into products/dist/<slug>-v<version>.zip.
// No dependencies: writes a standard ZIP (deflate) with Node's zlib.
// Usage: node products/build.mjs
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { deflateRawSync, crc32 } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const VERSION = '1.0';
export const PRODUCTS = ['solana-token-launch-site-kit', 'local-business-website-template'];

async function walk(dir, base = dir) {
  const out = [];
  for (const e of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p, base)); else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

function zip(entries) {
  // Fixed DOS timestamp (2026-10-31 00:00) for reproducible archives.
  const time = 0, date = ((2026 - 1980) << 9) | (10 << 5) | 31;
  const locals = [], centrals = []; let offset = 0;
  for (const { name, data } of entries) {
    const n = Buffer.from(name), comp = deflateRawSync(data, { level: 9 }), crc = crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(time, 10); lh.writeUInt16LE(date, 12); lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(data.length, 22); lh.writeUInt16LE(n.length, 26); lh.writeUInt16LE(0, 28);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(0x0314, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(time, 12); ch.writeUInt16LE(date, 14); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(n.length, 28); ch.writeUInt32LE((0o100644 << 16) >>> 0, 38); ch.writeUInt32LE(offset, 42);
    locals.push(lh, n, comp); centrals.push(ch, n);
    offset += 30 + n.length + comp.length;
  }
  const cd = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await mkdir(path.join(here, 'dist'), { recursive: true });
  for (const slug of PRODUCTS) {
    const dir = path.join(here, slug), files = await walk(dir);
    const entries = await Promise.all(files.map(async f => ({ name: `${slug}/${f}`, data: await readFile(path.join(dir, f)) })));
    const out = path.join(here, 'dist', `${slug}-v${VERSION}.zip`);
    await writeFile(out, zip(entries));
    console.log(`${path.relative(here, out)}  ${files.length} files  ${(await stat(out)).size} bytes`);
  }
}

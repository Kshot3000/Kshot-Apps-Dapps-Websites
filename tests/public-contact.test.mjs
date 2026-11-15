import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const webRoot = path.join(root, 'apps/web');
const skipExt = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.pdf', '.zip',
  '.map',
]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walk(full));
      continue;
    }
    if (skipExt.has(path.extname(entry.name).toLowerCase())) continue;
    out.push(full);
  }
  return out;
}

test('public apps/web files contain no gmail, kcaidevelopment, or mailto links', async () => {
  const hits = [];
  for (const file of await walk(webRoot)) {
    const text = await readFile(file, 'utf8');
    const patterns = [
      [/gmail/i, 'gmail'],
      [/kcaidevelopment/i, 'kcaidevelopment'],
      [/mailto:/i, 'mailto:'],
    ];
    for (const [re, label] of patterns) {
      if (re.test(text)) hits.push(`${path.relative(root, file)}: ${label}`);
    }
  }
  assert.deepEqual(hits, []);
});

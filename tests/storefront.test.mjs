import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const source = await readFile(path.join(root, 'apps/web/index.html'), 'utf8');

test('every storefront asset, demo route, and fragment resolves in deployed layout', async () => {
  const ids = new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(?:https?:|mailto:|data:)/.test(url)) continue;
    if (url.startsWith('#')) { assert.ok(ids.has(url.slice(1)), `Missing fragment ${url}`); continue; }
    const local = url.split(/[?#]/)[0];
    await access(path.join(dist, local, local.endsWith('/') ? 'index.html' : ''));
  }
});

test('package buttons map to valid choices in the brief', () => {
  const choices = new Set([...source.matchAll(/<option>(.*?)<\/option>/g)].map(m => m[1]));
  for (const m of source.matchAll(/data-package="([^"]+)"/g)) assert.ok(choices.has(m[1]), m[1]);
});

test('storefront controller parses and preserves explicit no-submission contact flow', async () => {
  const js = await readFile(path.join(root, 'apps/web/app.js'), 'utf8');
  new vm.Script(js);
  assert.doesNotMatch(js, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\b/);
  assert.match(source, /Nothing is submitted or stored by this site/);
  assert.match(source, /role="status" aria-live="polite"/);
  assert.match(source, /<noscript>/);
});

test('homepage keeps one primary heading and absolute social metadata', () => {
  assert.equal([...source.matchAll(/<h1[ >]/g)].length, 1);
  assert.match(source, /property="og:image" content="https:\/\//);
  assert.match(source, /name="description" content="[^"]{40,}"/);
  assert.match(source, /class="skip" href="#main"/);
});

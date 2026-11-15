import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const agentDir = path.join(root, 'apps/web/agent');
const html = await readFile(path.join(agentDir, 'index.html'), 'utf8');
const js = await readFile(path.join(agentDir, 'app.js'), 'utf8');
const data = JSON.parse(await readFile(path.join(agentDir, 'agent.json'), 'utf8'));

test('agent page exists and is linked from the homepage and services page', async () => {
  await access(path.join(agentDir, 'index.html'));
  const home = await readFile(path.join(root, 'apps/web/index.html'), 'utf8');
  const services = await readFile(path.join(root, 'apps/web/services/index.html'), 'utf8');
  assert.match(home, /href="agent\/"/);
  assert.match(services, /href="\.\.\/agent\/"/);
  assert.match(services, /See Kshot's work/);
  assert.doesNotMatch(home, /muse\//i);
  assert.doesNotMatch(services, /muse\//i);
  assert.doesNotMatch(html, /Muse/);
  assert.doesNotMatch(home, /Muse/);
  assert.doesNotMatch(services, /Muse/);
});

test('every media file referenced on the agent page exists', async () => {
  const missing = [];
  const referenced = new Set();
  for (const item of data.items) {
    for (const field of ['src', 'poster']) {
      if (item[field]) referenced.add(item[field]);
    }
  }
  for (const m of `${html}\n${js}`.matchAll(/(?:src|poster|href)="(media\/[^"]+)"/g)) {
    referenced.add(m[1]);
  }
  assert.ok(referenced.size > 0, 'expected at least one media file');
  for (const rel of referenced) {
    try {
      await access(path.join(agentDir, rel));
    } catch {
      missing.push(rel);
    }
  }
  assert.deepEqual(missing, []);
});

test('every gallery item links to an x.com/kshot9000/status URL', () => {
  assert.ok(Array.isArray(data.items) && data.items.length > 0, 'agent.json needs at least one item');
  const pattern = /^https:\/\/x\.com\/kshot9000\/status\/\d+$/;
  const bad = data.items.filter((item) => !pattern.test(item.url || ''));
  assert.deepEqual(bad.map((item) => item.id || item.url), []);
  assert.match(js, /x\.com\/kshot9000\/status|item\.url/);
  assert.match(html, /https:\/\/x\.com\/kshot9000/);
});

test('agent page discloses that images and videos are AI-generated', () => {
  assert.match(html, /AI-generated/i);
  assert.match(html, /Kshot is Kshot's AI agent/);
  assert.match(html, /Kshots Agent/);
  assert.doesNotMatch(html, /@gmail/i);
  assert.doesNotMatch(html, /mailto:/i);
  assert.doesNotMatch(html, /\bDonate\b/);
  assert.doesNotMatch(html, /Muse/);
});

#!/usr/bin/env node
// Validate apps/web/agent/agent.json and the media files it references.
// This does not call X or download posts. After you add a new clip:
//
//   1. Find the post on https://x.com/kshot9000 (the Kshots Agent series).
//   2. Download the best MP4 variant under about 8 MB, and the poster image.
//   3. Save them as apps/web/agent/media/<post-id>.mp4 and .webp
//      (convert the poster with: ffmpeg -i poster.jpg -vf scale=720:-2 media/<id>.webp).
//   4. Add an item to apps/web/agent/agent.json. Required fields: id, type
//      ("video" or "image"), createdAt, title, src, url. Videos should also
//      set poster. Set "embed": true on a few recent posts to show them in
//      the On X section.
//   5. Run: node scripts/update-agent.mjs
//   6. Open /agent/ locally, then commit the json, media, and this check.
//
// The live page reads agent.json in the browser, so you do not need to edit
// the HTML when you add a post.

import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const agentDir = path.join(root, 'apps/web/agent');
const limit = 8 * 1024 * 1024;
const statusRe = /^https:\/\/x\.com\/kshot9000\/status\/\d+$/;

const data = JSON.parse(await readFile(path.join(agentDir, 'agent.json'), 'utf8'));
const items = Array.isArray(data.items) ? data.items : [];
if (!items.length) {
  console.error('agent.json has no items');
  process.exit(1);
}

let failed = 0;
const seen = new Set();
for (const item of items) {
  const label = item.id || item.url || '(missing id)';
  if (seen.has(item.id)) {
    console.error(`FAIL  duplicate id ${label}`);
    failed++;
  }
  seen.add(item.id);
  if (!statusRe.test(item.url || '')) {
    console.error(`FAIL  ${label}: url must be https://x.com/kshot9000/status/<id>`);
    failed++;
  }
  if (item.type !== 'video' && item.type !== 'image') {
    console.error(`FAIL  ${label}: type must be video or image`);
    failed++;
  }
  const files = [item.src, item.poster].filter(Boolean);
  if (!files.length) {
    console.error(`FAIL  ${label}: missing src/poster`);
    failed++;
  }
  for (const rel of files) {
    const full = path.join(agentDir, rel);
    try {
      const info = await stat(full);
      if (rel.endsWith('.mp4') && info.size > limit) {
        console.error(`FAIL  ${rel} is ${(info.size / 1024 / 1024).toFixed(2)} MB (limit 8 MB)`);
        failed++;
      } else {
        console.log(`OK    ${rel} (${(info.size / 1024).toFixed(1)} KB)`);
      }
    } catch {
      console.error(`FAIL  missing ${rel}`);
      failed++;
    }
  }
}

console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${items.length} agent items look good.`);
process.exit(failed ? 1 : 0);

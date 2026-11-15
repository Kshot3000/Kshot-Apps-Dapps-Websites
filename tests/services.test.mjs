import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const servicesDir = path.join(root, 'apps/web/services');

const ADA = 'addr1q8hnl6vl5a6k3rw3n5g3jtte696zcl76kfatzv7gpswa9r0dj7fma6klq55y4ffm7tf0em09udnyhuk4ah92pl5x9jpqjae44v';
const BTC = '3GnR7TWBXAB3pPztBWpNF4LMNEX5yX8vZK';
const SOL = 'FEqXqiJt2eQ9tRhukHgYxQMiN7xkTrR8PHrR4sh7u1zG';

const SKIP_NAMES = new Set(['qrcode.js']);

async function listServiceFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await listServiceFiles(full));
    else if (!SKIP_NAMES.has(entry.name)) out.push(full);
  }
  return out;
}

const files = await listServiceFiles(servicesDir);
const texts = {};
for (const file of files) texts[file] = await readFile(file, 'utf8');
const combined = Object.values(texts).join('\n');
const html = texts[path.join(servicesDir, 'index.html')];
const appJs = texts[path.join(servicesDir, 'app.js')];
const config = JSON.parse(texts[path.join(servicesDir, 'services.json')]);

test('payment addresses are exactly the confirmed ADA, BTC, and SOL wallets', () => {
  assert.equal(config.payments.ADA, ADA);
  assert.equal(config.payments.BTC, BTC);
  assert.equal(config.payments.SOL, SOL);
  assert.match(html, new RegExp(ADA));
  assert.match(html, new RegExp(BTC));
  assert.match(html, new RegExp(SOL));
  assert.equal((html.match(new RegExp(ADA, 'g')) || []).length, 1);
  assert.equal((html.match(new RegExp(BTC, 'g')) || []).length, 1);
  assert.equal((html.match(new RegExp(SOL, 'g')) || []).length, 1);
  assert.doesNotMatch(combined, /addr1qym9ftpd/i);
});

test('services page has no gmail addresses, donate wording, or email inputs', () => {
  assert.doesNotMatch(combined, /@gmail/i);
  assert.doesNotMatch(combined, /mailto:/i);
  assert.doesNotMatch(combined, /\bdonate\b/i);
  assert.doesNotMatch(html, /type=["']email["']/i);
  assert.doesNotMatch(html, /(?:name|id|autocomplete)=["']email["']/i);
});

test('copy never claims the work was checked by a person', () => {
  assert.doesNotMatch(combined, /checked by a person/i);
});

test('page shows only the four approved launch jobs and Joe’s three packages', () => {
  const jobs = config.jobs;
  assert.ok(Array.isArray(jobs) && jobs.length === 5);
  const ids = jobs.map((job) => job.id).sort();
  assert.deepEqual(ids, ['product-copy-1', 'product-copy-5', 'research-brief', 'spreadsheet-cleanup', 'transcript-60']);
  assert.ok(jobs.every((job) => job.orderable === true));
  const byId = Object.fromEntries(jobs.map((job) => [job.id, job]));
  assert.equal(byId['product-copy-5'].price, 29);
  assert.equal(byId['product-copy-1'].price, 15);
  assert.equal(byId['transcript-60'].price, 12);
  assert.equal(byId['research-brief'].price, 45);
  assert.equal(byId['spreadsheet-cleanup'].price, 15);
  assert.equal(byId['research-brief'].turnaround, '72 hours');
  assert.ok(jobs.filter((job) => job.id !== 'research-brief').every((job) => job.turnaround === '48 hours'));

  const items = config.packages.items;
  assert.equal(items.length, 3);
  const packs = Object.fromEntries(items.map((item) => [item.id, item]));
  assert.equal(packs.try_it.price_usd_from, 12);
  assert.equal(packs.try_it.price_usd_to, 15);
  assert.deepEqual(packs.try_it.pick_one_of, ['product-copy-1', 'transcript-60', 'spreadsheet-cleanup']);
  assert.equal(packs.shop_starter.price, 39);
  assert.deepEqual(packs.shop_starter.includes, ['product-copy-5', 'spreadsheet-cleanup']);
  assert.equal(packs.cardano_project.price, 64);
  assert.deepEqual(packs.cardano_project.includes, ['research-brief', 'transcript-60', 'spreadsheet-cleanup']);
  for (const pack of items) {
    const refs = pack.pick_one_of || pack.includes || [];
    for (const id of refs) assert.ok(byId[id], pack.id + ' references unknown job ' + id);
  }

  assert.match(html, /Try-It/);
  assert.match(html, /Shop Starter/);
  assert.match(html, /Cardano Project/);
  assert.match(html, /\$12–\$15/);
  assert.match(html, /\$39/);
  assert.match(html, /\$64/);
  assert.match(html, /option value="try_it"/);
  assert.match(html, /option value="shop_starter"/);
  assert.match(html, /option value="cardano_project"/);
  assert.doesNotMatch(html, /Code review/i);
  assert.doesNotMatch(html, /bug fix/i);
  assert.doesNotMatch(html, /QA pass/i);
  assert.doesNotMatch(JSON.stringify(config), /code review|bug fix|QA pass/i);
  assert.doesNotMatch(combined, /\bproposed\b/i);
});

test('comparison table uses Linda’s checked Nov 15 figures', () => {
  assert.match(html, /Median starting price \$40 \(\$45\.70 after buyer fees\)/);
  assert.match(html, /Rev AI transcription \(retail\)/);
  assert.match(html, /\$0\.25\/min, which is \$15/);
  assert.match(html, /About \$60 \(3 hours at about \$20\/hr\)/);
  assert.match(html, /Fiverr data entry/);
  assert.match(html, /Median starting price \$20/);
  assert.match(html, /Competitor prices were checked Nov 15, 2026, and may change/);
  assert.match(html, /Spreadsheet cleanup, up to 500 rows/);
});

test('disclosure, privacy, and no-access wording match the final copy', () => {
  assert.match(html, /Kshot Applications is independent and not affiliated with xAI\./);
  assert.match(html, /The work is AI-generated, made with tools including Grok, and reviewed before delivery/);
  assert.match(html, /Created with Grok/);
  assert.match(html, /We sell finished work, not access to an AI tool/);
  assert.match(html, /We never use your files to train models/);
  assert.match(html, /Jobs run through third-party AI services/);
  assert.match(html, /Cards coming later/);
  assert.match(html, /PayPal coming later/);
  assert.doesNotMatch(html, /stripe/i);
  assert.doesNotMatch(html, /never used to train anything/i);
  assert.match(html, /Nothing is sent or stored automatically/);
  assert.match(html, /https:\/\/x.com\/kshot9000/);
  assert.match(html, /Message us on X/);
  assert.match(appJs, /KS-/);
  assert.doesNotMatch(appJs, /\b(?:XMLHttpRequest|localStorage|sessionStorage)\b/);
});


test('payment step and quote text include the 24-hour confirmed-rate hold', () => {
  const line = "We reply with the exact coin amount at that day's rate. Pay after we confirm, and the amount holds for 24 hours.";
  assert.ok(html.includes(line), 'page is missing the 24-hour hold line');
  assert.ok(appJs.includes(line), 'generated quote text is missing the 24-hour hold line');
  const step = html.slice(html.indexOf('Pay, then we deliver.'), html.indexOf('The work is AI-generated, made with tools including Grok, and reviewed before delivery.'));
  const dmQuote = step.indexOf('DM your quote, including your reference code');
  const rate = step.indexOf(line);
  const afterPay = step.indexOf('After you pay, DM the transaction ID together with your reference code');
  assert.ok(dmQuote !== -1 && rate !== -1 && afterPay !== -1, 'step 04 is missing the DM / rate / pay-then-DM sequence');
  assert.ok(dmQuote < rate && rate < afterPay, 'step 04 is not in the DM-quote, rate, then tx-ID order');
  const quote = appJs.slice(appJs.indexOf('DM this quote, including this reference code'), appJs.indexOf('After you pay, DM the transaction ID together with this reference code'));
  assert.ok(quote.includes(line), 'generated quote text does not put the rate line after the initial DM instruction');
});

test('refund, file-deletion, and Rev comparison wording match the review fixes', () => {
  assert.match(html, /we refund the same amount of the same coin the client paid, minus the network fee/);
  assert.doesNotMatch(html, /refund you in the same coin, minus the network fee/);
  assert.match(html, /We delete our copies 30 days after delivery \(or sooner on request\)/);
  assert.doesNotMatch(html, /Files are deleted 30 days after delivery/);
  assert.match(html, /Jobs and packages under \$100 are paid upfront/);
  assert.equal((html.match(/paid upfront/g) || []).length, 1);
  assert.doesNotMatch(html, /All three packages are under \$100, so they are paid upfront/);
});


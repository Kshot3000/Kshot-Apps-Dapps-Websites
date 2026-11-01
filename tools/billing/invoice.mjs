#!/usr/bin/env node
// Kshot Applications billing helper. No dependencies (Node 18+).
// Needs STRIPE_SECRET_KEY in the environment. Never commit the key.
//
//   node invoice.mjs deposit   --email a@b.com --name "Client" --project "Token Launch Site" --total 299
//   node invoice.mjs final     --email a@b.com --name "Client" --project "Token Launch Site" --total 299
//   node invoice.mjs subscribe --email a@b.com --name "Client" --plan site_subscription|care_plan
//
// deposit/final bill 50% of --total (USD) on a Stripe-hosted invoice page and email it.
// subscribe starts a monthly plan; the client pays the first invoice by link and the
// saved card is charged automatically every month after that.

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY) { console.error("Set STRIPE_SECRET_KEY first."); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(3).reduce((a, v, i, arr) =>
  v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a, []));
const cmd = process.argv[2];

function form(obj, prefix = "", out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") form(v, key, out); else out.append(key, String(v));
  }
  return out;
}
async function stripe(method, path, body) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body ? form(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || res.statusText);
  return json;
}

async function findOrCreateCustomer(email, name) {
  const found = await stripe("GET", `customers?email=${encodeURIComponent(email)}&limit=1`);
  if (found.data.length) return found.data[0];
  return stripe("POST", "customers", { email, name });
}

async function halfInvoice(stage) {
  const { email, name, project, total } = args;
  if (!email || !project || !total) throw new Error("Need --email, --project and --total");
  const cents = Math.round(Number(total) * 100);
  const half = stage === "deposit" ? Math.ceil(cents / 2) : Math.floor(cents / 2);
  const customer = await findOrCreateCustomer(email, name);
  const desc = stage === "deposit"
    ? "50% deposit to start work. The remaining 50% is invoiced at launch."
    : "Final 50% due at launch. Thank you for building with Kshot Applications!";
  const inv = await stripe("POST", "invoices", {
    customer: customer.id, collection_method: "send_invoice", days_until_due: 7,
    auto_advance: false, description: desc, metadata: { project, stage, project_total_usd: total },
  });
  await stripe("POST", "invoiceitems", {
    customer: customer.id, invoice: inv.id, amount: half, currency: "usd",
    description: `${project}: ${stage === "deposit" ? "50% deposit" : "final 50%"}`,
  });
  await stripe("POST", `invoices/${inv.id}/finalize`, { auto_advance: false });
  const sent = await stripe("POST", `invoices/${inv.id}/send`);
  console.log(`Sent ${sent.number} for $${(half / 100).toFixed(2)} to ${email}`);
  console.log(sent.hosted_invoice_url);
}

async function subscribe() {
  const { email, name, plan } = args;
  if (!email || !plan) throw new Error("Need --email and --plan");
  const prods = await stripe("GET", `products/search?query=${encodeURIComponent(`metadata['key']:'${plan}'`)}`);
  const product = prods.data[0];
  if (!product?.default_price) throw new Error(`No product with key ${plan}`);
  const customer = await findOrCreateCustomer(email, name);
  const sub = await stripe("POST", "subscriptions", {
    customer: customer.id,
    items: { 0: { price: product.default_price } },
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    metadata: { minimum_term_months: plan === "site_subscription" ? 12 : 0 },
    expand: { 0: "latest_invoice" },
  });
  console.log(`Started ${product.name} for ${email} (${sub.id}). First payment link:`);
  console.log(sub.latest_invoice.hosted_invoice_url);
}

try {
  if (cmd === "deposit" || cmd === "final") await halfInvoice(cmd);
  else if (cmd === "subscribe") await subscribe();
  else console.log("Commands: deposit | final | subscribe (see top of file)");
} catch (e) { console.error("Stripe error:", e.message); process.exit(1); }

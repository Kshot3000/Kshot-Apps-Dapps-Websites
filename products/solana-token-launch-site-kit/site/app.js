(() => {
  const t = window.TOKEN;
  const $ = (id) => document.getElementById(id);
  const PH = /\{\{[A-Z0-9_]+\}\}/;
  const missing = new Set();
  // Fill {{CONTRACT_ADDRESS}}, {{TICKER}} and {{TOKEN_NAME}} inside other strings, and note anything still unfilled.
  const fill = (s) => {
    const out = String(s ?? "")
      .replaceAll("{{CONTRACT_ADDRESS}}", PH.test(t.contractAddress) ? "{{CONTRACT_ADDRESS}}" : t.contractAddress)
      .replaceAll("{{TICKER}}", PH.test(t.ticker) ? "{{TICKER}}" : t.ticker)
      .replaceAll("{{TOKEN_NAME}}", PH.test(t.name) ? "{{TOKEN_NAME}}" : t.name);
    (out.match(/\{\{[A-Z0-9_]+\}\}/g) || []).forEach((m) => missing.add(m));
    return out;
  };
  const ready = (s) => s && !PH.test(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const link = (label, url, cls) => { const a = el("a", cls, label); a.href = url; a.target = "_blank"; a.rel = "noopener"; return a; };

  const name = fill(t.name), ticker = fill(t.ticker), ca = fill(t.contractAddress);
  document.title = `${name} ($${ticker})`;
  document.documentElement.style.setProperty("--p", t.colors.primary);
  document.documentElement.style.setProperty("--a", t.colors.accent);
  $("logo").src = t.logo; $("logo").alt = name;
  $("name").textContent = name;
  $("ticker").textContent = "$" + ticker;
  $("tagline").textContent = fill(t.tagline);
  $("mint").textContent = ca;

  $("copy").onclick = async () => {
    try { await navigator.clipboard.writeText(ca); }
    catch { const r = document.createRange(); r.selectNodeContents($("mint")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand("copy"); }
    $("copy").textContent = "Copied!"; setTimeout(() => ($("copy").textContent = "Copy CA"), 1500);
  };

  t.buyLinks.forEach((l, i) => { const u = fill(l.url); if (ready(u)) $("buy").append(link(l.label, u, i ? "btn ghost" : "btn")); });
  t.tokenomics.forEach((x) => { const c = el("div", "card"); c.append(el("div", "v", fill(x.value)), el("div", "l", x.label)); $("tokenomics").append(c); });
  t.howToBuy.forEach((s) => $("howto").append(el("li", null, fill(s))));
  t.roadmap.forEach((r) => { const c = el("div", "card"); c.append(el("h3", null, r.phase)); const ul = el("ul"); r.items.forEach((i) => ul.append(el("li", null, fill(i)))); c.append(ul); $("roadmap").append(c); });
  t.socials.forEach((l) => { const u = fill(l.url); if (ready(u)) $("socials").append(link(l.label, u, "btn ghost small")); });
  $("disclaimer").textContent = fill(t.disclaimer);
  if (t.footerCredit) $("credit").textContent = t.footerCredit;
  if (t.payments && ready(fill(t.payments.walletAddress))) $("payLink").classList.remove("hidden");

  const f = t.features || {};
  if (f.chart && ready(ca)) {
    $("chart").src = `https://dexscreener.com/solana/${encodeURIComponent(ca)}?embed=1&theme=dark&trades=0&info=0`;
    $("chartSec").classList.remove("hidden");
  }
  if (f.swap && ready(ca)) {
    $("swapSec").classList.remove("hidden");
    const s = document.createElement("script");
    s.src = "https://plugin.jup.ag/plugin-v1.js";
    s.onload = () => window.Jupiter && window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "jupiter-plugin",
      branding: { name, logoUri: new URL(t.logo, location.href).href },
      formProps: { initialInputMint: "So11111111111111111111111111111111111111112", initialOutputMint: ca, fixedMint: ca },
    });
    document.head.append(s);
  }

  if (missing.size) {
    $("setup").textContent = "Setup: replace these placeholders in config.js: " + [...missing].join(", ") + ". (This bar disappears when everything is filled in.)";
    $("setup").classList.remove("hidden");
  }
})();

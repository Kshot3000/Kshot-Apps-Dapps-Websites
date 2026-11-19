(() => {
  const t = window.TOKEN;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const link = (l, cls) => { const a = el("a", cls, l.label); a.href = l.url; a.target = "_blank"; a.rel = "noopener"; return a; };

  document.title = `${t.name} ($${t.ticker})`;
  document.documentElement.style.setProperty("--p", t.colors.primary);
  document.documentElement.style.setProperty("--a", t.colors.accent);
  $("logo").src = t.logo; $("logo").alt = t.name;
  $("name").textContent = t.name;
  $("ticker").textContent = "$" + t.ticker;
  $("tagline").textContent = t.tagline;
  $("mint").textContent = t.mint;
  $("copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(t.mint);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = t.mint; document.body.append(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    $("copy").textContent = "Copied!"; setTimeout(() => ($("copy").textContent = "Copy CA"), 1500);
  };
  t.buyLinks.forEach((l, i) => $("buy").append(link(l, i ? "btn ghost" : "btn")));
  t.tokenomics.forEach((x) => { const c = el("div", "card"); c.append(el("div", "v", x.value), el("div", "l", x.label)); $("tokenomics").append(c); });
  t.howToBuy.forEach((s) => $("howto").append(el("li", null, s)));
  t.roadmap.forEach((r) => { const c = el("div", "card"); c.append(el("h3", null, r.phase)); const ul = el("ul"); r.items.forEach((i) => ul.append(el("li", null, i))); c.append(ul); $("roadmap").append(c); });
  t.socials.forEach((l) => $("socials").append(link(l, "btn ghost small")));
  $("disclaimer").textContent = t.disclaimer;
  if (t.demoNote) { $("demo").textContent = t.demoNote; $("demo").classList.remove("hidden"); }
  const f = t.features || {};
  if (f.chart) {
    $("chart").src = `https://dexscreener.com/solana/${t.mint}?embed=1&theme=dark&trades=0&info=0`;
    $("chartSec").classList.remove("hidden");
  }
  if (f.swap) {
    $("swapSec").classList.remove("hidden");
    window.addEventListener("load", () => {
      if (!window.Jupiter) return;
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-plugin",
        branding: { name: t.name, logoUri: new URL(t.logo, location.href).href },
        formProps: {
          initialInputMint: "So11111111111111111111111111111111111111112",
          initialOutputMint: t.mint,
          fixedMint: t.mint,
        },
      });
    });
  }
})();

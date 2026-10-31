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
    await navigator.clipboard.writeText(t.mint);
    $("copy").textContent = "Copied!"; setTimeout(() => ($("copy").textContent = "Copy CA"), 1500);
  };
  t.buyLinks.forEach((l, i) => $("buy").append(link(l, i ? "btn ghost" : "btn")));
  t.tokenomics.forEach((x) => { const c = el("div", "card"); c.append(el("div", "v", x.value), el("div", "l", x.label)); $("tokenomics").append(c); });
  t.howToBuy.forEach((s) => $("howto").append(el("li", null, s)));
  t.roadmap.forEach((r) => { const c = el("div", "card"); c.append(el("h3", null, r.phase)); const ul = el("ul"); r.items.forEach((i) => ul.append(el("li", null, i))); c.append(ul); $("roadmap").append(c); });
  t.socials.forEach((l) => $("socials").append(link(l, "btn ghost small")));
  $("disclaimer").textContent = t.disclaimer;
})();

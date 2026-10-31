(() => {
  const b = window.BIZ, $ = (id) => document.getElementById(id);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const tel = "tel:" + b.phone.replace(/[^\d+]/g, "");
  document.title = `${b.name} | ${b.type}`;
  document.documentElement.style.setProperty("--p", b.colors.primary);
  document.documentElement.style.setProperty("--d", b.colors.dark);
  if (b.demoNote) { $("demo").textContent = b.demoNote; $("demo").classList.remove("hidden"); }
  if (b.heroImage) $("hero").style.backgroundImage = `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url("${b.heroImage}")`;
  $("brand").textContent = b.name; $("fname").textContent = b.name; $("yr").textContent = new Date().getFullYear();
  $("type").textContent = b.type; $("name").textContent = b.name; $("tagline").textContent = b.tagline;
  $("navCall").textContent = "Call " + b.phone; $("navCall").href = tel;
  const book = el("a", "btn", b.bookingUrl ? "Book now" : "Call to book"); book.href = b.bookingUrl || tel;
  const dir = el("a", "btn ghost", "Get directions"); dir.href = "https://maps.google.com/?q=" + encodeURIComponent(b.address); dir.target = "_blank";
  $("cta").append(book, dir);
  b.services.forEach((s) => { const c = el("div", "card"), t = el("div", "top"); t.append(el("span", null, s.name), el("span", "price", s.price)); c.append(t, el("p", null, s.desc)); $("services").append(c); });
  b.reviews.forEach((r) => { const c = el("div", "card"); c.append(el("p", "quote", "“" + r.text + "”"), el("p", "small", "— " + r.by)); $("reviews").append(c); });
  b.hours.forEach(([d, h]) => { const tr = el("tr"); tr.append(el("td", null, d), el("td", null, h)); $("hours").append(tr); });
  const a1 = el("a", null, b.phone); a1.href = tel; const a2 = el("a", null, b.email); a2.href = "mailto:" + b.email;
  $("contact").append(b.address, el("br"), a1, el("br"), a2);
  $("map").src = "https://maps.google.com/maps?q=" + encodeURIComponent(b.address) + "&output=embed";
  b.socials.forEach((s) => { const a = el("a", "btn small", s.label); a.href = s.url; a.target = "_blank"; $("socials").append(a); });
})();

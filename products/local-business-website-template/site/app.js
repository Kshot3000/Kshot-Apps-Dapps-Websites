(() => {
  const b = window.BIZ, $ = (id) => document.getElementById(id);
  const PH = /\{\{[A-Z0-9_]+\}\}/, missing = new Set();
  const v = (s) => { s = String(s ?? ""); (s.match(/\{\{[A-Z0-9_]+\}\}/g) || []).forEach((m) => missing.add(m)); return s; };
  const ready = (s) => s && !PH.test(s);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

  const name = v(b.name), phone = v(b.phone), email = v(b.email), address = v(b.address);
  const tel = ready(phone) ? "tel:" + phone.replace(/[^\d+]/g, "") : "#";
  document.title = `${name} | ${v(b.type)}`;
  document.documentElement.style.setProperty("--p", b.colors.primary);
  document.documentElement.style.setProperty("--d", b.colors.dark);
  if (b.heroImage) $("hero").style.backgroundImage = `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url("${b.heroImage}")`;
  $("brand").textContent = name; $("fname").textContent = name; $("yr").textContent = new Date().getFullYear();
  $("type").textContent = b.type; $("name").textContent = name; $("tagline").textContent = v(b.tagline);
  $("credit").textContent = b.footerCredit || "";
  $("navCall").textContent = "Call " + phone; $("navCall").href = tel;

  const book = el("a", "btn", b.bookingUrl ? "Book now" : "Call to book"); book.href = b.bookingUrl || tel;
  if (b.bookingUrl) { book.target = "_blank"; book.rel = "noopener"; }
  const dir = el("a", "btn ghost", "Get directions"); dir.href = "https://maps.google.com/?q=" + encodeURIComponent(address); dir.target = "_blank"; dir.rel = "noopener";
  $("cta").append(book, dir);

  b.services.forEach((s) => { const c = el("div", "card"), t = el("div", "top"); t.append(el("span", null, v(s.name)), el("span", "price", v(s.price))); c.append(t, el("p", null, v(s.desc))); $("services").append(c); });
  if (!b.reviews.length) $("reviews-sec").remove();
  b.reviews.forEach((r) => { const c = el("div", "card"); c.append(el("p", "quote", "“" + v(r.text) + "”"), el("p", "small", "— " + v(r.by))); $("reviews").append(c); });
  b.hours.forEach(([d, h]) => { const tr = el("tr"); tr.append(el("td", null, d), el("td", null, h)); $("hours").append(tr); });

  const a1 = el("a", null, phone); a1.href = tel;
  const a2 = el("a", null, email); a2.href = ready(email) ? "mailto:" + email : "#";
  $("contact").append(address, el("br"), a1, el("br"), a2);
  $("map").src = "https://maps.google.com/maps?q=" + encodeURIComponent(ready(address) ? address : "") + "&output=embed";
  b.socials.forEach((s) => { if (!ready(s.url)) return v(s.url); const a = el("a", "btn small", s.label); a.href = s.url; a.target = "_blank"; a.rel = "noopener"; $("socials").append(a); });

  // Contact form: Formspree if an ID is set, otherwise open the visitor's email app.
  const form = $("form");
  if (ready(b.formspreeId)) {
    form.action = "https://formspree.io/f/" + encodeURIComponent(b.formspreeId);
    $("formNote").textContent = "We usually reply within one business day.";
  } else {
    if (b.formspreeId) v(b.formspreeId);
    $("formNote").textContent = "This opens your email app with your message ready to send.";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const body = `${d.get("message")}\n\n${d.get("name")}\n${d.get("email")}\n${d.get("phone") || ""}`;
      location.href = `mailto:${ready(email) ? email : ""}?subject=${encodeURIComponent("Website inquiry from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    });
  }

  // Structured data so search engines understand the business.
  if (ready(name) && ready(address)) {
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name, address, telephone: ready(phone) ? phone : undefined, email: ready(email) ? email : undefined, url: location.href.split("#")[0] });
    document.head.append(ld);
  }

  if (missing.size) {
    $("setup").textContent = "Setup: replace these placeholders in config.js: " + [...missing].join(", ") + ". (This bar disappears when everything is filled in.)";
    $("setup").classList.remove("hidden");
  }
})();

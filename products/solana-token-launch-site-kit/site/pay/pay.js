(() => {
  const t = window.TOKEN, p = t.payments || {}, $ = (id) => document.getElementById(id);
  const PH = /\{\{[A-Z0-9_]+\}\}/;
  const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint on Solana mainnet
  const A = String(p.walletAddress || "").trim();
  const label = PH.test(p.label || "") ? (PH.test(t.name) ? "" : t.name) : (p.label || "");
  const valid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(A); // base58 Solana address shape

  document.documentElement.style.setProperty("--p", t.colors.primary);
  document.documentElement.style.setProperty("--a", t.colors.accent);
  $("logo").src = "../" + t.logo;
  if (label) document.title = "Pay " + label + " with SOL or USDC";
  $("note").textContent = p.note || "";
  $("addr").textContent = A;

  if (!valid) {
    $("warn").textContent = "Setup: paste your own Solana wallet address into payments.walletAddress in config.js. Payments are disabled until then.";
    $("warn").classList.remove("hidden");
    ["copy", "pay", "tok", "amt", "ref"].forEach((id) => { $(id).setAttribute("disabled", ""); $(id).setAttribute("aria-disabled", "true"); });
    $("qr").classList.add("hidden");
    return;
  }

  $("copy").onclick = async (e) => {
    try { await navigator.clipboard.writeText(A); e.target.textContent = "Copied!"; } catch { e.target.textContent = "Select and copy above"; }
  };

  const q = new URLSearchParams(location.search);
  if (q.get("amount")) $("amt").value = q.get("amount");
  if ((q.get("token") || "").toUpperCase() === "USDC") $("tok").value = "USDC";
  if (q.get("ref")) $("ref").value = q.get("ref");

  // Solana Pay transfer request: https://docs.solanapay.com/spec
  const link = () => {
    const v = parseFloat($("amt").value), ref = $("ref").value.trim();
    const parts = [];
    if (v > 0) parts.push("amount=" + v);
    if ($("tok").value === "USDC") parts.push("spl-token=" + USDC);
    if (label) parts.push("label=" + encodeURIComponent(label));
    if (ref) parts.push("message=" + encodeURIComponent("Ref " + ref), "memo=" + encodeURIComponent("Ref " + ref));
    return "solana:" + A + (parts.length ? "?" + parts.join("&") : "");
  };
  const draw = () => {
    const qr = window.qrcode(0, "M"); qr.addData(link()); qr.make();
    $("qr").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  };
  ["tok", "amt", "ref"].forEach((id) => $(id).addEventListener("input", draw));
  draw();
  $("pay").onclick = (e) => { e.preventDefault(); location.href = link(); };
})();

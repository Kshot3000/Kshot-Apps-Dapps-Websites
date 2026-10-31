// Smoke checks for the Kshot Applications sites. No dependencies.
// Run from the repo root:  node tests/smoke.mjs
// Guards three things that have already broken or misled once:
//  1. the dependency-free base58 encoder in the Solana demo (signature display)
//  2. every relative link/asset in the three pages resolving in the DEPLOYED
//     layout (apps/web at root, demos as subfolders — see scripts/deploy-pages.sh)
//  3. the token-launch-kit demo config (valid mint, no dead placeholder links)
import { readFileSync, existsSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

// --- 1. base58 -------------------------------------------------------------
const demoSrc = readFileSync(join(root, "apps/solana-demo/app.js"), "utf8");
const b58Start = demoSrc.indexOf('const B58');
const b58End = demoSrc.indexOf("async function loadBalance");
if (b58Start < 0 || b58End < 0) {
  check("base58 extractable from solana-demo/app.js", false, "markers not found — update this test if app.js is restructured");
} else {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(demoSrc.slice(b58Start, b58End) + "\nthis.__b58 = base58;", sandbox);
  const base58 = sandbox.__b58;
  const ref = (bytes) => {
    const A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let n = 0n;
    for (const b of bytes) n = n * 256n + BigInt(b);
    let s = "";
    while (n > 0n) { s = A[Number(n % 58n)] + s; n /= 58n; }
    for (const b of bytes) { if (b === 0) s = "1" + s; else break; }
    return s;
  };
  const vectors = [[[], ""], [[0], "1"], [[0, 0], "11"], [[1], "2"], [[57], "z"], [[58], "21"], [[0, 0, 1], "112"],
    [Array.from(new TextEncoder().encode("Hello World!")), "2NEpo7TZRRrLZSi2U"]];
  let ok = vectors.every(([a, exp]) => base58(Uint8Array.from(a)) === exp);
  let seed = 42; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) % 256;
  for (let i = 0; i < 200 && ok; i++) {
    const b = Uint8Array.from({ length: 64 }, rnd);
    if (i % 13 === 0) { b[0] = 0; b[1] = 0; }
    if (base58(b) !== ref(b)) ok = false;
  }
  check("base58 vectors + 200 random 64-byte values vs reference", ok);
}

// --- 2. deployed-layout link check ------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), "kshot-layout-"));
try {
  cpSync(join(root, "apps/web"), tmp, { recursive: true });
  cpSync(join(root, "apps/solana-demo"), join(tmp, "solana-demo"), { recursive: true });
  cpSync(join(root, "apps/token-launch-kit"), join(tmp, "token-launch-kit"), { recursive: true });
  cpSync(join(root, "apps/local-business-template"), join(tmp, "local-business"), { recursive: true });
  rmSync(join(tmp, "solana-demo/README.md"), { force: true });
  rmSync(join(tmp, "token-launch-kit/README.md"), { force: true });
  rmSync(join(tmp, "local-business/README.md"), { force: true });
  const pages = ["index.html", "solana-demo/index.html", "token-launch-kit/index.html", "local-business/index.html", "pay-crypto/index.html"];
  let bad = [];
  for (const page of pages) {
    const html = readFileSync(join(tmp, page), "utf8");
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = m[1].split(/[?#]/)[0];
      if (!url || /^(https?:|data:|mailto:)/.test(url)) continue;
      const target = resolve(join(tmp, dirname(page)), decodeURIComponent(url));
      const okFile = existsSync(target);
      const okDirIndex = existsSync(join(target, "index.html"));
      if (!okFile && !okDirIndex) bad.push(`${page} -> ${m[1]}`);
    }
  }
  check("all relative links/assets resolve in deployed layout", bad.length === 0, bad.join("; "));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// --- 3. token kit config sanity ----------------------------------------------
const cfgSrc = readFileSync(join(root, "apps/token-launch-kit/config.js"), "utf8");
const cfgBox = { window: {} };
vm.createContext(cfgBox);
vm.runInContext(cfgSrc, cfgBox);
const T = cfgBox.window.TOKEN;
check("token config loads and names a token", !!T && !!T.name && !!T.ticker);
check("token mint is valid base58 (32-44 chars)", /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(T?.mint || ""), T?.mint || "missing");
const allLinks = [...(T?.buyLinks || []), ...(T?.socials || [])];
check("all config links are https and none is a bare placeholder root",
  allLinks.length > 0 && allLinks.every((l) => /^https:\/\/.+\..+/.test(l.url) && l.url !== "https://t.me/" && l.url !== "https://x.com/"),
  allLinks.map((l) => l.url).join(", "));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll smoke checks passed.");
process.exit(failures ? 1 : 0);

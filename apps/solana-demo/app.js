const RPC = {
  mainnet: "https://solana-rpc.publicnode.com",
  devnet: "https://api.devnet.solana.com",
};
const $ = (id) => document.getElementById(id);
const getProvider = () => {
  const p = window.phantom?.solana || window.solana;
  return p && p.isPhantom ? p : null;
};
let provider = getProvider();
let pubkey = null;

const status = (t) => ($("status").textContent = t || "");

// Base58 encoder for signatures (no dependencies)
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58(bytes) {
  let digits = [];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0; }
  }
  let out = "";
  for (const b of bytes) { if (b === 0) out += "1"; else break; }
  for (let i = digits.length - 1; i >= 0; i--) out += B58[digits[i]];
  return out;
}

async function loadBalance() {
  if (!pubkey) return;
  $("balance").textContent = "…";
  try {
    const res = await fetch(RPC[$("network").value], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [pubkey] }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    $("balance").textContent = (data.result.value / 1e9).toLocaleString(undefined, { maximumFractionDigits: 6 }) + " SOL";
  } catch (e) {
    $("balance").textContent = "unavailable";
    status("Couldn't load balance: " + e.message);
  }
}

function showConnected(key) {
  pubkey = key.toString();
  $("address").textContent = pubkey;
  $("wallet").classList.remove("hidden");
  $("connect").classList.add("hidden");
  status("Connected.");
  loadBalance();
}

function showDisconnected() {
  pubkey = null;
  $("wallet").classList.add("hidden");
  $("connect").classList.remove("hidden");
  $("signature").classList.add("hidden");
  status("Disconnected.");
}

$("connect").onclick = async () => {
  provider = getProvider();
  if (!provider) { $("nowallet").classList.remove("hidden"); return; }
  try {
    const resp = await provider.connect();
    showConnected(resp.publicKey);
  } catch (e) { status("Connection cancelled."); }
};

$("disconnect").onclick = async () => { try { await provider.disconnect(); } catch {} showDisconnected(); };
$("refresh").onclick = loadBalance;
$("network").onchange = loadBalance;

$("sign").onclick = async () => {
  try {
    const msg = new TextEncoder().encode($("message").value);
    const { signature } = await provider.signMessage(msg, "utf8");
    $("signature").textContent = "Signature:\n" + base58(signature);
    $("signature").classList.remove("hidden");
    status("Message signed.");
  } catch (e) { status("Signing cancelled."); }
};

window.addEventListener("load", async () => {
  provider = getProvider();
  if (!provider) return;
  provider.on?.("accountChanged", (k) => (k ? showConnected(k) : showDisconnected()));
  provider.on?.("disconnect", showDisconnected);
  try { const r = await provider.connect({ onlyIfTrusted: true }); showConnected(r.publicKey); } catch {}
});

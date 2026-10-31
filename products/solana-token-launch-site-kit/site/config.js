// ============================================================
//  SOLANA TOKEN LAUNCH SITE KIT: the only file you need to edit.
//  Replace every {{PLACEHOLDER}} below. Anything still wrapped in
//  {{ }} shows up in the yellow setup bar at the top of the page,
//  so you can see at a glance what is left to fill in.
// ============================================================
window.TOKEN = {
  name: "{{TOKEN_NAME}}",            // e.g. "Moon Cat"
  ticker: "{{TICKER}}",              // e.g. "MCAT" (no $ sign; it is added for you)
  tagline: "{{TAGLINE}}",            // one short sentence under the name
  logo: "logo.svg",                  // replace logo.svg, or point to logo.png (square, 512x512 works well)

  // The token's mint / contract address on Solana.
  contractAddress: "{{CONTRACT_ADDRESS}}",

  colors: { primary: "#9945ff", accent: "#14f195" }, // any CSS colors

  // Optional extras. Both need a real contract address to work.
  features: {
    chart: false, // true = embed a live DexScreener chart
    swap: false,  // true = embed the Jupiter swap widget so visitors can buy on-site
  },

  // Buy buttons. Leave as-is: {{CONTRACT_ADDRESS}} is swapped in automatically.
  buyLinks: [
    { label: "Buy on Jupiter", url: "https://jup.ag/swap/SOL-{{CONTRACT_ADDRESS}}" },
    { label: "Chart on DexScreener", url: "https://dexscreener.com/solana/{{CONTRACT_ADDRESS}}" },
  ],

  // Socials. Delete any line you do not use.
  socials: [
    { label: "X", url: "{{X_URL}}" },             // e.g. https://x.com/yourhandle
    { label: "Telegram", url: "{{TELEGRAM_URL}}" }, // e.g. https://t.me/yourgroup
    { label: "Discord", url: "{{DISCORD_URL}}" },   // e.g. https://discord.gg/invite
  ],

  tokenomics: [
    { label: "Total supply", value: "{{TOTAL_SUPPLY}}" }, // e.g. "1,000,000,000"
    { label: "Liquidity", value: "{{LIQUIDITY_PCT}}" },   // e.g. "80%"
    { label: "Community and marketing", value: "{{COMMUNITY_PCT}}" },
    { label: "Team", value: "{{TEAM_PCT}}" },
  ],

  howToBuy: [
    "Get a Solana wallet such as Phantom or Solflare.",
    "Buy SOL and send it to your wallet.",
    "Open Jupiter, paste the contract address above, and swap SOL for ${{TICKER}}.",
  ],

  roadmap: [
    { phase: "Phase 1", items: ["Launch", "Website and socials", "First 1,000 holders"] },
    { phase: "Phase 2", items: ["Community events", "Partnerships", "Listings"] },
    { phase: "Phase 3", items: ["Utility rollout", "Ecosystem growth"] },
  ],

  disclaimer: "${{TICKER}} is a community token. Nothing on this site is financial advice. Crypto is risky; only spend what you can afford to lose.",

  // Optional payment page at /pay/ (SOL or USDC via Solana Pay).
  // Paste YOUR OWN Solana wallet address. Leave the placeholder to hide the page link.
  payments: {
    walletAddress: "{{WALLET_ADDRESS}}",
    label: "{{TOKEN_NAME}}",      // shown in the payer's wallet
    note: "Send SOL or USDC on Solana only.",
  },

  footerCredit: "", // optional, e.g. "Site by Your Studio"
};

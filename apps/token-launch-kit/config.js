// Edit this file for each client. Everything on the page comes from here.
window.TOKEN = {
  name: "Example Token",
  ticker: "EXMPL",
  tagline: "The community token for builders on Solana.",
  logo: "logo.svg",
  // The token's mint address. This demo uses JUP so the chart and swap show live data.
  mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  demoNote: "Demo site: the chart and swap use the JUP token as sample data.", // set to "" for clients
  // Launch Package ($999) features
  features: {
    chart: true, // live DexScreener chart
    swap: true,  // Phantom wallet connect + buy on-site via Jupiter
  },
  colors: { primary: "#9945ff", accent: "#14f195" },
  buyLinks: [
    { label: "Buy on Jupiter", url: "https://jup.ag/swap/SOL-JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
    { label: "Chart on DexScreener", url: "https://dexscreener.com/solana/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  ],
  socials: [
    { label: "X", url: "https://x.com/kshot9000" },
    { label: "Telegram", url: "https://t.me/" },
  ],
  tokenomics: [
    { label: "Total supply", value: "1,000,000,000" },
    { label: "Liquidity", value: "80%" },
    { label: "Community and marketing", value: "15%" },
    { label: "Team", value: "5%" },
  ],
  howToBuy: [
    "Get a Phantom wallet at phantom.com.",
    "Buy SOL and send it to your wallet.",
    "Open Jupiter, paste the contract address, and swap SOL for the token.",
  ],
  roadmap: [
    { phase: "Phase 1", items: ["Launch", "Website and socials", "First 1,000 holders"] },
    { phase: "Phase 2", items: ["CEX listings", "Partnerships", "Community events"] },
    { phase: "Phase 3", items: ["Utility rollout", "Ecosystem grants"] },
  ],
  disclaimer: "This token is for entertainment and community purposes. Nothing here is financial advice.",
};

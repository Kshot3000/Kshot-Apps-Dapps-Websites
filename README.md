# Kshot Applications

We build **apps, dapps, and websites** for businesses, from a landing page to a production Solana dapp.

## What's in this repo

| Path | What it is |
| --- | --- |
| `apps/web` | The Kshot Applications company website (storefront and portfolio) |
| `apps/solana-demo` | Solana dapp demo with Phantom wallet connect |
| `apps/token-launch-kit` | Config-driven landing page kit for new Solana tokens |
| `apps/local-business-template` | Config-driven site template for the monthly local business subscription |
| `scripts/deploy-pages.sh` | Publishes the site and demos to GitHub Pages |
| `contracts/` | On-chain programs and smart contracts for our dapps |
| `docs/` | Briefs, service packages, and project notes |

## Services

- **Websites**: fast, mobile-first marketing sites and storefronts
- **Apps**: web and mobile applications
- **Dapps**: Solana and EVM dapps, wallet connect, token gating, and on-chain payments

## Running the website locally

The site is plain HTML and CSS with no build step:

```bash
cd apps/web
python3 -m http.server 8080
# open http://localhost:8080
```

## Checks

```bash
node tests/smoke.mjs
```

Verifies the Solana demo's base58 encoder, that every relative link resolves in the deployed GitHub Pages layout, and that the token-launch-kit demo config has a valid mint and no dead placeholder links.

## Contact

Live site: https://kshot.tech/

Email: kcaidevelopment@gmail.com

Follow us on X: [@kshot9000](https://x.com/kshot9000)

## Design contribution and team handoff

The storefront redesign includes a browser-local project brief builder and responsive interface concepts. It does not send emails or store inquiries; visitors explicitly open an email draft, copy, or download their brief.

- [Design system and reusable patterns](docs/DESIGN-SYSTEM.md)
- [Grok / Muse integration handoff](docs/CODEX-DESIGN-HANDOFF.md)
- [Proposed client acquisition plan](docs/CLIENT-ACQUISITION.md)

Preview the complete deployed layout (including demos) and run the storefront checks:

```bash
node scripts/build-design-preview.mjs
node --test tests/storefront.test.mjs
python3 -m http.server 8080 --directory dist
```

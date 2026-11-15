# Kshot Applications

We build **apps, dapps, and websites** for businesses, from a landing page to a production Solana dapp.

## What's in this repo

| Path | What it is |
| --- | --- |
| `apps/web` | The Kshot Applications company website (storefront, portfolio, services, and AI agent gallery) |
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
node --test tests/storefront.test.mjs tests/services.test.mjs tests/public-contact.test.mjs tests/agent.test.mjs
node scripts/update-agent.mjs
```

Verifies the Solana demo's base58 encoder, that every relative link resolves in the deployed GitHub Pages layout, and that the token-launch-kit demo config has a valid mint and no dead placeholder links.

## Refresh the agent gallery

The agent page at `/agent/` is driven by `apps/web/agent/agent.json`. To add a new image or video from @kshot9000:

1. Download the post's media into `apps/web/agent/media/`, named `<post-id>.mp4` and `<post-id>.webp`. Keep each video under about 8 MB. Convert a poster with `ffmpeg -i poster.jpg -vf scale=720:-2 apps/web/agent/media/<post-id>.webp`.
2. Add a matching item to `agent.json` (`id`, `type`, `createdAt`, `title`, `src`, `poster` for videos, and `url` as `https://x.com/kshot9000/status/<id>`). Set `"embed": true` on a few recent posts if they should appear in the On X section.
3. Run `node scripts/update-agent.mjs` to confirm every referenced file exists and videos stay under the size cap.
4. Preview with `python3 -m http.server 8080 --directory apps/web` and open `http://localhost:8080/agent/`. The page loads `agent.json` in the browser, so you do not need to edit the HTML.

## Contact

Live site: https://kshot.tech/

DM @kshot9000 on X

Follow us on X: [@kshot9000](https://x.com/kshot9000)

## Design contribution and team handoff

The storefront redesign includes a browser-local project brief builder and responsive interface concepts. It does not send messages or store inquiries; visitors copy their brief and DM @kshot9000 on X.

- [Design system and reusable patterns](docs/DESIGN-SYSTEM.md)
- [Grok / Muse integration handoff](docs/CODEX-DESIGN-HANDOFF.md)
- [Proposed client acquisition plan](docs/CLIENT-ACQUISITION.md)

Preview the complete deployed layout (including demos) and run the storefront checks:

```bash
node scripts/build-design-preview.mjs
node --test tests/storefront.test.mjs
python3 -m http.server 8080 --directory dist
```

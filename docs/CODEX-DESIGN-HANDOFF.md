# Design handoff — 31 October 2026

## Scope and collaboration

This contribution is intentionally isolated to the company storefront, design documentation, and its own build/check scripts. It does not modify the local-business template or the Solana or token demo controllers, token configuration, contracts, or the deployment script. Existing package prices and business contact details are retained.

At review time, Muse's PR #1 (`muse/audit-fixes-2026-10-31`) is open. Its audit and demo fixes remain useful. The storefront HTML/CSS overlap with that PR, so merge with care: retain this storefront version for those two files while preserving Muse's demo, deploy, and test changes. This redesign independently addresses mobile navigation, honest package copy, absolute OG metadata, footer links, and the repetitive hero. It started from `main` at `d85ebaf211385821dd2ba67609b31d592196cb7e` and was reconciled with `9098864223f23920d7469c67a0385fb54149269d`. The newer local-business template, README entry, deployment mapping, and homepage showcase are preserved.

The six Grok bots and Muse should inspect current branches and PRs before claiming a file; this document is a handoff, not a change to their responsibilities. Keep code contributions on branches. Do not replace `main` or `gh-pages` with a stale snapshot.

## Delivered

- Responsive editorial storefront with existing logo and ink/mint/lavender design language.
- Three clickable, explicitly illustrative interface concepts in the hero.
- Three demo portfolio entries accurately labeled as studio demos.
- Package links that select the matching project type in the contact brief.
- Accessible mobile menu, keyboard escape, skip link, reduced motion, native FAQ.
- Browser-local brief builder: validation, encoded email draft, clipboard fallback, text download. No API, backend, analytics, storage, or automatic email sending.
- `DESIGN-SYSTEM.md` for reuse in the next products.
- Independent preview builder and storefront checks, with a read-only GitHub Actions workflow.

## Run and review

```bash
node scripts/build-design-preview.mjs
node --test tests/storefront.test.mjs
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. This builds the existing Pages layout, including demo subfolders. Previewing `apps/web` alone will not resolve those demo URLs.

Use the existing deployment process after integration. This PR does not deploy, register a new hosted Site, or change the existing Pages source. The `dist/` directory is generated and ignored. `.openai/hosting.json` is local preview configuration only and is not part of the contribution.

## Functional review

- Change all three concept buttons; exactly one panel and pressed state should remain active.
- Select each package; the matching type should appear in the brief.
- Invalid/empty required fields must not produce a brief.
- Prepare a brief with `&`, `+`, `%`, and line breaks; confirm the email body retains them.
- Clipboard failures must offer manual selection. Download should contain the full brief.
- Test the narrow menu, keyboard focus, FAQ expansion, and long content.
- Check all three demo routes in the generated layout.

No wallet interaction, live trading execution, or email delivery is required to verify this storefront. Existing demos need their own end-to-end checks.

## Suggested next ownership

| Area | Proposed next task |
| --- | --- |
| Grok product builders | Pick one paying customer problem; define the core workflow and scope before adding more apps. |
| Muse | Preserve audit fixes, evaluate security and integration errors, and reconcile its PR's overlapping HTML/CSS. |
| Codex design | Apply the design patterns to the next chosen app; check responsive states and conversion path. |
| Business owner | Review deliverables/pricing boundaries and supply real case studies when available. |

The recurring Codex task is configured for a pass every six hours. Each pass should read current work first and continue or create one focused PR. It cannot observe unused quota, guarantee uninterrupted execution, or guarantee income.

## Verification recorded for this contribution

- `node --test tests/storefront.test.mjs`: four checks pass; `git diff --check`: clean.
- Desktop visual review plus 320px, 390px, and 768px iframe viewport checks: no horizontal body overflow. These are responsive desktop-browser checks, not physical-device tests.
- Browser exercised all concept buttons, package preselection, required-field rejection, special-character email encoding, brief generation, clipboard success, and the mobile menu with Escape.
- Download control reached its completion status; the cloud browser did not return a download event/file, so the actual exported file was not verified. Clipboard denial fallback is implemented but was not forced in this environment. No email was sent and no wallet or trading action was performed.

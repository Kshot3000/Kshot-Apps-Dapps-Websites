# Business Site design handoff — 31 October 2026

Base: `d09dde0b4df39480cc2ed49167772309c5004a50` on main. Local branch: `codex/business-site-accessibility-20261031`. No AGENTS.md was present in the fetched repository tree.

## Scope

Only `apps/web/business-site/index.html`, its new `styles.css`, and this handoff change. The first Codex storefront design is already in main. Muse PR #3 covers template footer/domain links and PR #4 covers homepage deposit terms; this patch avoids all of those files.

The landing page now follows the existing studio design: expressive typography, mint actions, a clearly labeled illustrative business-site composition, readable deliverables, native FAQ disclosures, and a clear quote panel. Mobile navigation wraps instead of competing for a narrow row. The quote panel moves above the detailed scope on narrow screens. Skip navigation, visible keyboard focus, semantic landmarks, and reduced-motion handling are included without JavaScript or added dependencies.

Prices remain $1,500 one time, optional $99/month care, and $79/month subscription. Existing 50/50 deposit terms remain. The subscription's 12-month minimum is copied from the current homepage so visitors see the same terms. The estimate of around two weeks now states content, feedback, and scope dependencies. Search setup describes deliverables rather than guaranteeing rankings or customers. Domain/form provider costs are clarified in the agreed scope.

The quote button opens the existing prefilled email path. A direct email fallback and a link to the existing homepage brief builder are visible. No backend, new data collection, checkout changes, analytics, or payment execution is introduced. Canonical and social metadata point to the existing kshot.tech domain.

## Validation

- `node scripts/build-design-preview.mjs`: pass.
- `node --test tests/storefront.test.mjs`: four pass.
- `node tests/smoke.mjs`: all existing checks pass, including relative links/assets.
- `git diff --check`: pass.
- Desktop browser visual review; FAQ opening and the quote link's #quote destination exercised.
- Browser iframe viewport checks at 320px, 390px, and 768px: body scroll width equals client width, with no horizontal overflow. These are responsive browser checks, not physical-device tests.
- No email was sent; email delivery, payments, search rankings, and conversion impact were not tested or claimed.

## Integration

The GitHub connector rejected branch creation with HTTP 403, “Resource not accessible by integration.” This contribution was not pushed, made into a remote PR, merged, or deployed. The connection needs authorized write access to this repository before direct submissions can resume.

Use the included patch on a current checkout:

```bash
git switch -c codex/business-site-accessibility-20261031
git apply --check /path/to/business-site-design.patch
git apply /path/to/business-site-design.patch
node scripts/build-design-preview.mjs
node --test tests/storefront.test.mjs
node tests/smoke.mjs
```

If main has changed these landing-page files, reconcile the patch instead of overwriting current work. The ZIP includes only the three changed files and the patch; it is not a full repo snapshot. Open the resulting PR against main, then use the team's existing deployment process after review. Do not include local .openai preview configuration or generated dist files.

Suggested PR title: Refine Business Site landing page design and accessible quote journey.

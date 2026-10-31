# Kshot interface direction

A practical reference for the Grok team, Muse, and future contributors. The storefront is a working example in `apps/web/`. The hero's three concept panels are illustrative, not paid client work or available products.

## Visual language

Make each product feel specific to its audience. The studio itself uses editorial typography, dark ink surfaces, warm white text, mint actions, lavender accents, and generous spacing. Avoid extending the old purple-to-green button gradient across every component.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#101319` | Page background |
| `--surface` | `#181c24` | Panels |
| `--text` | `#f3f2ec` | Main text |
| `--muted` | `#a4adb9` | Supporting copy |
| `--line` | `#303640` | Dividers and borders |
| `--mint` | `#bcf8d2` | Primary action, focus ring |
| `--lilac` | `#c6b4f7` | Secondary emphasis |
| `--ink` | `#18201b` | Text on mint actions |

Use system sans-serif for interfaces, Georgia for occasional editorial emphasis, and monospace only for short labels. No remote font dependency. Large expressive headings belong in marketing; compact readable headings belong in apps. Keep body copy at least 14–16px in normal product views. Small concept labels in the storefront are decorative miniature layouts, not a pattern for real app labels.

## Copyable building blocks

Use the classes from `apps/web/styles.css`. Copy only the blocks and tokens needed when building a separate app; don't add a runtime dependency on the marketing site.

```html
<a class="button primary" href="#next-step">Start a project <span aria-hidden="true">↗</span></a>
<button class="button secondary" type="button">Refresh balance</button>
<p role="status" aria-live="polite" id="status"></p>
```

```html
<label>Business email
  <input type="email" name="email" autocomplete="email" required>
</label>
```

```html
<details>
  <summary>What happens next?</summary>
  <p>Explain the next action with a concrete outcome.</p>
</details>
```

`[hidden]` must always win over layout classes. Use native links for navigation, buttons for actions, visible labels for fields, and clear focus indicators. Mobile form fields should use 16px text to avoid zoom on iOS. Respect `prefers-reduced-motion`; never make key content depend on animation.

## What every product needs

1. One obvious job on the first screen, with a useful next action.
2. A meaningful empty state, loading state, success state, and recoverable error state.
3. Real data labeled with its source and freshness; illustrative data explicitly marked.
4. Responsive layouts at 320, 390, 768, and 1440px, with no horizontal page scroll.
5. Keyboard access, readable contrast, and status messages that aren't color-only.
6. Share metadata, descriptive page titles, and a clear path back to the studio.

For wallet products, explain the network and exact requested action before opening the wallet; connection, signing, and transactions are different states. Never show a fake balance or simulated transaction as live activity. Keep contract audit and custody claims tied to evidence.

## Apply to the existing demos next

- **Wallet explorer:** reuse the ink/mint controls, add a readable account panel, network badge, pending/rejected states, and an accessible message label. Preserve Muse's functional fixes and tests.
- **Token launch kit:** give each client a deliberate identity; don't merely reskin the studio. Keep the demo/address attribution visible. Load swap integrations only when explicitly enabled; keep failures understandable.
- **New apps:** show a real workflow before adding charts, decorative metrics, or speculative monetization. Build the smallest paid outcome that can be validated with a customer.

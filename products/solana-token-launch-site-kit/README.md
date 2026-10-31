# Solana Token Launch Site Kit v1.0

A fast, one-page website for a Solana token: hero with contract address and "Copy CA" button, buy buttons, tokenomics, how-to-buy, roadmap, socials, and an optional SOL/USDC payment page. Plain HTML, CSS, and JavaScript with no build step.

```
site/
  index.html      main page (also edit the <title>/<meta> placeholders here)
  config.js       <- everything you edit lives here
  app.js          renders the page from config.js
  style.css       styles (colors come from config.js)
  logo.svg        replace with your logo
  pay/            optional Solana Pay page (SOL or USDC)
  vendor/         QR code library (MIT), used by the pay page
```

## Setup in 5 steps

1. **Edit the placeholders.** Open `site/config.js` and replace every `{{PLACEHOLDER}}`: `{{TOKEN_NAME}}`, `{{TICKER}}`, `{{TAGLINE}}`, `{{CONTRACT_ADDRESS}}`, `{{X_URL}}`, `{{TELEGRAM_URL}}`, `{{DISCORD_URL}}`, the tokenomics values, and (optionally) `{{WALLET_ADDRESS}}` for the pay page. Delete any social you don't use. Then find-and-replace `{{TOKEN_NAME}}`, `{{TICKER}}`, `{{TAGLINE}}`, and `{{SITE_URL}}` in the `<head>` of `site/index.html`. Open `site/index.html` in a browser: a yellow bar lists anything you've missed and disappears when you're done.
2. **Add your branding.** Replace `site/logo.svg` (or drop in `logo.png` and change `logo` in config.js). Set `colors.primary` and `colors.accent`. Optionally set `features.chart` and `features.swap` to `true` once the token is trading.
3. **Deploy it free.** Pick one:
   - **Netlify:** sign in to a free Netlify account, open app.netlify.com/drop, and drag the `site` folder onto the page.
   - **Vercel:** install the CLI and run `npx vercel` inside `site`, or import a Git repo containing it.
   - **GitHub Pages:** create a repo, upload the *contents* of `site`, then go to Settings, Pages, and choose "Deploy from a branch" (main, root).
4. **Add a custom domain.** In your host's domain settings add the domain, then at your registrar create the records it shows you (usually an `A`/`ALIAS` record for the root and a `CNAME` for `www`). HTTPS is issued automatically on all three hosts once DNS resolves (minutes to a few hours).
5. **Check and share.** Visit the live site, click "Copy CA" and each buy link to confirm they open your token, and if you enabled `/pay/`, send yourself a tiny test payment before sharing.

## The payment page (optional)

`site/pay/` builds a Solana Pay link and QR code for **your own** wallet (`payments.walletAddress` in config.js). Payers choose SOL or USDC, enter an amount and a reference, and their wallet opens with everything filled in. You can prefill it with a link like `pay/?amount=25&token=USDC&ref=1001`. The page hides itself from search engines, and stays disabled until a valid Solana address is set. It does not confirm payments for you; check your wallet or a block explorer.

## Notes

- Always double-check the contract address. A wrong address sends buyers to the wrong token.
- The chart and swap widgets are loaded from DexScreener and Jupiter, so their availability depends on those services.
- Nothing here is financial or legal advice. Keep the disclaimer and follow the rules that apply where you and your buyers are.

See `LICENSE.txt` for what you can do with this template (one site, for you or one client; no resale).

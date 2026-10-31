# Local Business Website Template v1.0

A clean, mobile-friendly one-page website for a local business: tap-to-call header, booking and directions buttons, services with prices, reviews, opening hours, Google map, and a working contact form. Plain HTML, CSS, and JavaScript with no build step.

```
site/
  index.html     main page (also edit the <title>/<meta> placeholders here)
  config.js      <- everything you edit lives here
  app.js         renders the page from config.js
  style.css      styles (colors come from config.js)
  favicon.svg    replace with your icon
```

## Setup in 5 steps

1. **Edit the placeholders.** Open `site/config.js` and replace every `{{PLACEHOLDER}}`: `{{BUSINESS_NAME}}`, `{{BUSINESS_TYPE}}`, `{{TAGLINE}}`, `{{PHONE}}`, `{{EMAIL}}`, `{{ADDRESS}}`, the services and prices, the reviews, and the social links. Add or remove services, reviews, and hours rows freely. Then find-and-replace `{{BUSINESS_NAME}}`, `{{BUSINESS_TYPE}}`, and `{{TAGLINE}}` in the `<head>` of `site/index.html`. Open `site/index.html` in a browser: a yellow bar lists anything you've missed and disappears when you're done.
2. **Set up the contact form.** Easiest: create a free form at formspree.io, copy its ID (the part after `/f/`), and paste it into `formspreeId`. Or delete the placeholder (`formspreeId: ""`) and the form will open the visitor's email app addressed to your `email`. Optionally add a `bookingUrl` (Square, Booksy, Calendly, and so on), a `heroImage`, and your colors.
3. **Deploy it free.** Pick one:
   - **Netlify:** sign in to a free Netlify account, open app.netlify.com/drop, and drag the `site` folder onto the page.
   - **Vercel:** install the CLI and run `npx vercel` inside `site`, or import a Git repo containing it.
   - **GitHub Pages:** create a repo, upload the *contents* of `site`, then go to Settings, Pages, and choose "Deploy from a branch" (main, root).
4. **Add a custom domain.** In your host's domain settings add the domain, then at your registrar create the records it shows you (usually an `A`/`ALIAS` record for the root and a `CNAME` for `www`). HTTPS is issued automatically on all three hosts once DNS resolves (minutes to a few hours).
5. **Check and share.** On your phone, tap the call button, the directions button, and send a test message through the form. Add the site link to your Google Business Profile and socials.

## Notes

- Only use real reviews from real customers, with their permission.
- The map and directions use Google Maps from your `address`; no API key is needed.
- If you use a hero photo, make sure you own it or have the right to use it.

See `LICENSE.txt` for what you can do with this template (one site, for you or one client; no resale).

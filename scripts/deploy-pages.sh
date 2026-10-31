#!/usr/bin/env bash
# Publishes apps/web at the site root, plus each demo app in its own subfolder, to the gh-pages branch.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
tmp=$(mktemp -d)
cp -r apps/web/. "$tmp/"
cp -r apps/solana-demo "$tmp/solana-demo"
cp -r apps/token-launch-kit "$tmp/token-launch-kit"
cp -r apps/local-business-template "$tmp/local-business"
rm -f "$tmp/solana-demo/README.md" "$tmp/token-launch-kit/README.md" "$tmp/local-business/README.md"
touch "$tmp/.nojekyll"
# Keep the custom domain (e.g. kshot.tech) across force-pushed deploys.
cname=$(gh api repos/Kshot3000/Kshot-Apps-Dapps-Websites/pages --jq ".cname // empty" 2>/dev/null || true)
if [ -n "$cname" ]; then echo "$cname" > "$tmp/CNAME"; fi
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="${GIT_NAME:-Kshot3000}" -c user.email="${GIT_EMAIL:-318831680+Kshot3000@users.noreply.github.com}" commit -qm "Deploy site"
git push -qf "$(cd - >/dev/null && git remote get-url origin)" gh-pages
echo "Deployed."

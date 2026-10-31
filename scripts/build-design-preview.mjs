// Dependency-free local preview packaging. Does not deploy or touch gh-pages.
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await mkdir(out, { recursive: true });
// Keep the directory inode stable for running static preview servers.
for (const entry of await readdir(out)) await rm(path.join(out, entry), { recursive: true, force: true });
await cp(path.join(root, 'apps/web'), out, { recursive: true });
for (const [app, route] of [['solana-demo', 'solana-demo'], ['token-launch-kit', 'token-launch-kit'], ['local-business-template', 'local-business']]) {
  await cp(path.join(root, 'apps', app), path.join(out, route), { recursive: true, filter: source => !source.endsWith('README.md') });
}
await writeFile(path.join(out, '.nojekyll'), '');
console.log('Built static preview in dist/');

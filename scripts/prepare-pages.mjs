import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const prefix = '/old-school-toxic';
async function fixAssets(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await fixAssets(file);
    else if (['.html', '.css'].includes(extname(file))) {
      const input = await readFile(file, 'utf8');
      const output = input.replace(/((?:src|srcset|href)=["']|url\(["']?)\/images\//g, `$1${prefix}/images/`).replace(/((?:src|srcset|href)=["'])\/_astro\//g, `$1${prefix}/_astro/`);
      if (input !== output) await writeFile(file, output);
    }
  }
}
await fixAssets('dist');

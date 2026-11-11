// Paraglide's compile options, shared by vite.config.ts and `pnpm i18n` (the CLI can't set the storage key).
// The URL prefix (/cs, /uk; none is English), then the saved pick, the browser's languages, English.
import { fileURLToPath } from 'node:url';
import { compile } from '@inlang/paraglide-js';

/** @type {import("@inlang/paraglide-js").CompilerOptions} */
export const paraglide = {
  project: './project.inlang',
  outdir: './src/paraglide',
  strategy: ['url', 'localStorage', 'preferredLanguage', 'baseLocale'],
  localStorageKey: 'rtg-lang',
};

if (process.argv[1] === fileURLToPath(import.meta.url))
  await compile(paraglide);

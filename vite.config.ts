import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

import { paraglide } from './paraglide.config.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    paraglideVitePlugin(paraglide),
    // tests need the class names, not the stylesheet; the default mode can lose a file's CSS under Vitest
    vanillaExtractPlugin(
      process.env.VITEST ? { unstable_mode: 'transform' } : undefined
    ),
  ],
});

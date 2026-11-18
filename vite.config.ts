/// <reference types="vitest/config" />
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
  test: {
    coverage: {
      provider: 'v8',
      // the plain-function modules the unit tests cover; hooks and components are checked in Storybook
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.css.ts',
        'src/**/use[A-Z]*.ts',
        'src/hooks/**',
        'src/paraglide/**',
        'src/routeTree.gen.ts',
        'src/testing/**',
      ],
      // json-summary feeds the coverage badge in the README (the badge job in test.yml)
      reporter: ['text-summary', 'html', 'json-summary'],
      // a little under where coverage stands, so CI fails when new code lands without tests
      thresholds: { statements: 60, branches: 70, functions: 75, lines: 60 },
    },
  },
});

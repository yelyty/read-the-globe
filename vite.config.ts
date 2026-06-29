import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		react(),
		vanillaExtractPlugin()
	],
})

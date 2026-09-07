// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	vite: {
		// @ts-expect-error
		plugins: [tailwindcss()],
	},

	integrations: [],
	adapter: cloudflare(),
	output: 'server',
});

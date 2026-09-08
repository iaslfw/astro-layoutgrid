import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
	site: 'https://layoutgrid.iaslfw.workers.dev',

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react(), sitemap()],
	adapter: cloudflare(),
});

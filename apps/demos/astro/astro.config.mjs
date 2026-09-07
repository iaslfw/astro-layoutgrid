// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import layoutgrid from 'astro-layoutgrid';

// https://astro.build/config
export default defineConfig({
	vite: {
		// @ts-expect-error
		plugins: [tailwindcss()],
	},

	integrations: [layoutgrid()],
});

// @ts-check
import { defineConfig } from 'astro/config';

import layoutgrid from 'astro-layoutgrid-integration';

// https://astro.build/config
export default defineConfig({
	integrations: [layoutgrid()],
});

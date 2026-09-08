/**
 * The configuration module the integration generates at dev-server start.
 *
 * Purely internal: only files in this package import it, so this declaration is
 * needed at compile time and never ships. `tsc` consumes it without emitting
 * anything, and it is absent from `dist` for that reason.
 */
declare module 'virtual:astro-layoutgrid/config' {
	import type { LayoutgridConfig } from './schema.js';

	const config: LayoutgridConfig;
	export default config;
}

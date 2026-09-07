import type { AstroIntegration } from 'astro';

import { ICON } from './icon.js';
import { resolve, type LayoutgridConfig, type LayoutgridOptions } from './schema.js';

/**
 * The Astro integration.
 *
 * Registers a dev toolbar app that draws a column grid over the page. This is
 * the only thing a user of the package touches:
 *
 * ```js
 * import layoutgrid from 'astro-layoutgrid';
 *
 * export default defineConfig({
 * 	integrations: [layoutgrid({ columns: 12 })],
 * });
 * ```
 *
 * No import in any layout, no markup, no keyboard shortcut to remember.
 *
 * @packageDocumentation
 */

const NAME = 'astro-layoutgrid';
const VIRTUAL_ID = 'virtual:astro-layoutgrid/config';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Builds the source of the virtual configuration module.
 *
 * The configuration is embedded with `JSON.stringify` rather than assembled by
 * hand. `color` and `maxWidth` are strings the user controls, and this module
 * is generated JavaScript source: hand-quoting them would let a value close the
 * string and continue as code.
 */
function configModule(config: LayoutgridConfig): string {
	return `export default ${JSON.stringify(config)};\n`;
}

/**
 * @param options - Grid options; anything omitted falls back to the defaults
 *
 * @returns The integration, for the `integrations` array in `astro.config`
 */
export default function layoutgrid(options: LayoutgridOptions = {}): AstroIntegration {
	return {
		name: NAME,
		hooks: {
			'astro:config:setup': ({ command, addDevToolbarApp, updateConfig }) => {
				if (command !== 'dev') return;
				const config = resolve(options);

				updateConfig({
					vite: {
						plugins: [
							{
								name: `${NAME}/config`,
								resolveId(id: string) {
									return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
								},
								load(id: string) {
									return id === RESOLVED_ID ? configModule(config) : undefined;
								},
							},
						],
					},
				});

				addDevToolbarApp({
					id: NAME,
					name: 'Layout Grid',
					icon: ICON,
					// Resolved against the running file, so `dist/index.js` finds `dist/toolbar-app.js`
					entrypoint: new URL('./toolbar-app.js', import.meta.url),
				});
			},
		},
	};
}

export type { Breakpoint, LayoutgridConfig, LayoutgridOptions, PerBreakpoint } from './schema.js';
export { DEFAULTS } from './schema.js';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import layoutgrid from '../dist/index.js';
import { DEFAULTS, resolve } from '../dist/schema.js';

const VIRTUAL_ID = 'virtual:astro-layoutgrid/config';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Runs the `astro:config:setup` hook against stand-ins that record what the
 * integration asked for.
 *
 * The integration is a function returning an object, so none of this needs a
 * dev server, a browser, or Astro itself running.
 */
function setup(options, command = 'dev') {
	const apps = [];
	const plugins = [];

	const integration = layoutgrid(options);
	integration.hooks['astro:config:setup']({
		command,
		addDevToolbarApp: (app) => apps.push(app),
		updateConfig: (config) => plugins.push(...(config.vite?.plugins ?? [])),
	});

	return { integration, apps, plugins };
}

/** Evaluates generated source without writing it to disk. */
async function evaluate(source) {
	return import(`data:text/javascript,${encodeURIComponent(source)}`);
}

describe('the integration', () => {
	it('is named, so Astro can report on it', () => {
		assert.equal(layoutgrid().name, 'astro-layoutgrid');
	});

	it('registers one toolbar app in dev', () => {
		const { apps } = setup();
		assert.equal(apps.length, 1);
		assert.equal(apps[0].id, 'astro-layoutgrid');
		assert.equal(apps[0].name, 'Layout Grid');
	});

	it('points its entrypoint at a file that exists after the build', () => {
		// The failure this repository has shipped twice: a path in package
		// metadata that nothing ever resolved.
		const { apps } = setup();
		assert.ok(existsSync(fileURLToPath(apps[0].entrypoint)));
	});

	for (const command of ['build', 'preview', 'sync']) {
		it(`registers nothing during ${command}`, () => {
			// This is what makes "dev-only" a fact rather than a claim: outside dev
			// the integration adds neither an app nor a Vite plugin, so a user's
			// production build is untouched.
			const { apps, plugins } = setup({}, command);
			assert.equal(apps.length, 0);
			assert.equal(plugins.length, 0);
		});
	}
});

describe('the virtual configuration module', () => {
	it('claims its own specifier and nothing else', () => {
		const [plugin] = setup().plugins;
		assert.equal(plugin.resolveId(VIRTUAL_ID), RESOLVED_ID);
		assert.equal(plugin.resolveId('some/other/module'), undefined);
	});

	it('serves only the resolved id', () => {
		// The NUL prefix marks the id as virtual, so no other plugin tries to read
		// it from disk.
		const [plugin] = setup().plugins;
		assert.ok(plugin.load(RESOLVED_ID));
		assert.equal(plugin.load(VIRTUAL_ID), undefined);
		assert.equal(plugin.load('/some/file.ts'), undefined);
	});

	it('emits JavaScript that evaluates to the resolved configuration', async () => {
		const [plugin] = setup({ columns: 16, gutter: { mobile: 0.5 } }).plugins;
		const module = await evaluate(plugin.load(RESOLVED_ID));
		assert.deepEqual(module.default, resolve({ columns: 16, gutter: { mobile: 0.5 } }));
	});

	it('applies the defaults when the user passes nothing', async () => {
		const [plugin] = setup().plugins;
		const module = await evaluate(plugin.load(RESOLVED_ID));
		assert.deepEqual(module.default, DEFAULTS);
	});

	it('resolves user options rather than passing them through', async () => {
		// Clamping happens on the server, where the developer is looking, and the
		// toolbar app receives something it cannot disagree with.
		const [plugin] = setup({ opacity: 7, columns: 0 }).plugins;
		const module = await evaluate(plugin.load(RESOLVED_ID));
		assert.equal(module.default.opacity, 1);
		assert.equal(module.default.columns.mobile, 1);
	});

	it('escapes strings the user controls', async () => {
		// The module is generated source. A hand-quoted value could close the
		// string and continue as code; JSON.stringify cannot.
		const hostile = '"; globalThis.PWNED = true; //';
		const [plugin] = setup({ color: hostile }).plugins;
		const module = await evaluate(plugin.load(RESOLVED_ID));
		assert.equal(module.default.color, hostile);
		assert.equal(globalThis.PWNED, undefined);
	});
});

describe('the toolbar app bundle', () => {
	it('is emitted next to the integration', async () => {
		// It cannot be imported here: it depends on the virtual module and on
		// `astro/toolbar`, both of which only exist inside Vite. Its behaviour is
		// verified in a browser; this only guards the path.
		const { existsSync } = await import('node:fs');
		const { fileURLToPath } = await import('node:url');
		assert.ok(existsSync(fileURLToPath(new URL('../dist/toolbar-app.js', import.meta.url))));
	});
});

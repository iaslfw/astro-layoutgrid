import { defineToolbarApp } from 'astro/toolbar';
import config from 'virtual:astro-layoutgrid/config';

import { Overlay } from './overlay.js';

/**
 * The dev toolbar app.
 *
 * Joins the configuration baked in by the integration, the overlay and the
 * toolbar button. There is no settings panel: the grid is configured in
 * `astro.config` and nowhere else, so the button is a switch and nothing more.
 *
 * @packageDocumentation
 */

const VISIBLE_KEY = 'astro-layoutgrid:visible';

/**
 * Whether the grid was left switched on.
 *
 * Storage may be unreadable — a private window, blocked site data — and the
 * access itself throws in that case rather than returning null. Off is the safe
 * answer: an overlay that fails to appear is a smaller surprise than one that
 * appears unbidden.
 */
function readVisible(): boolean {
	try {
		return localStorage.getItem(VISIBLE_KEY) === 'true';
	} catch {
		return false;
	}
}

/** Remembers the state for the next reload; failing to is not worth a crash. */
function writeVisible(visible: boolean): void {
	try {
		localStorage.setItem(VISIBLE_KEY, String(visible));
	} catch {
		return;
	}
}

export default defineToolbarApp({
	init(_canvas, app) {
		// `_canvas` is this app's own shadow root. The overlay must not go in
		// there: inside the toolbar's shadow tree it would sit under the page
		// rather than over it, and the symptom is nothing at all on screen. It
		// goes into the document, which is what `mount` defaults to.
		const overlay = new Overlay(config, document);
		overlay.mount();

		app.onToggled(({ state }) => {
			overlay.toggle(state);
			writeVisible(state);
		});

		// Routed through the toolbar rather than straight to the overlay, so the
		// button's active state and the grid move together. The shortcut is a
		// second way to press the same button, not a second switch.
		document.addEventListener('keydown', (event) => {
			// `code`, not `key`, so the shortcut survives a non-QWERTY layout.
			if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.code !== 'KeyG') return;
			event.preventDefault();
			app.toggleState({ state: !overlay.visible });
		});

		// Registered first, then triggered: `toggleState` asks the toolbar to
		// switch the app on, which sets the button's active state and dispatches
		// the same event a click would. Restoring through that one path is why the
		// button and the overlay cannot disagree.
		if (readVisible()) app.toggleState({ state: true });
	},
});

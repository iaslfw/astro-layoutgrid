import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';

import { Overlay } from '../dist/overlay.js';
import { resolve } from '../dist/schema.js';

/**
 * A document the overlay can be built in.
 *
 * linkedom has no `matchMedia`, so these tests exercise the viewport-width
 * fallback rather than the media query path. That path is only observable in a
 * real browser; so are `color-mix` and whether the grid actually lines up.
 */
function makeDocument(width) {
	const { document, window } = parseHTML('<!doctype html><html><body></body></html>');
	window.innerWidth = width;
	return document;
}

const mount = (width, options) => {
	const document = makeDocument(width);
	const overlay = new Overlay(resolve(options), document);
	overlay.mount();
	return { overlay, document, host: document.body.firstElementChild };
};

describe('mount', () => {
	it('attaches a single host to the body', () => {
		const { document, host } = mount(1400);
		assert.equal(document.body.children.length, 1);
		assert.equal(host.tagName, 'DIV');
	});

	it('builds inside a shadow root, out of reach of the page', () => {
		const { document, host } = mount(1400);
		assert.notEqual(host.shadowRoot, null);
		// The decisive assertion: the page cannot see, and therefore cannot style,
		// anything the overlay builds.
		assert.equal(document.body.querySelector('.column'), null);
	});

	it('puts the load-bearing styles inline on the host', () => {
		// `:host` rules lose against the page's own selectors; inline styles do not.
		const { host } = mount(1400);
		assert.equal(host.style.position, 'fixed');
		assert.equal(host.style.pointerEvents, 'none');
		assert.equal(host.style.zIndex, '1000');
	});

	it('starts hidden', () => {
		const { overlay, host } = mount(1400);
		assert.equal(overlay.visible, false);
		assert.equal(host.style.display, 'none');
	});

	it('renders the column count of the active breakpoint', () => {
		assert.equal(mount(1400).host.shadowRoot.querySelectorAll('.column').length, 12);
		assert.equal(mount(800).host.shadowRoot.querySelectorAll('.column').length, 8);
		assert.equal(mount(500).host.shadowRoot.querySelectorAll('.column').length, 4);
	});

	it('is a no-op the second time', () => {
		const { overlay, document } = mount(1400);
		overlay.mount();
		assert.equal(document.body.children.length, 1);
	});
});

describe('visibility', () => {
	it('follows show, hide and toggle', () => {
		const { overlay } = mount(1400);
		overlay.show();
		assert.equal(overlay.visible, true);
		overlay.hide();
		assert.equal(overlay.visible, false);
		overlay.toggle();
		assert.equal(overlay.visible, true);
	});

	it('obeys an explicit target state', () => {
		// The toolbar always passes one: Astro reports the state to move to, not a
		// wish to flip. A flip that guesses is how a button ends up disagreeing
		// with the screen.
		const { overlay } = mount(1400);
		overlay.toggle(false);
		assert.equal(overlay.visible, false);
		overlay.toggle(true);
		assert.equal(overlay.visible, true);
		overlay.toggle(true);
		assert.equal(overlay.visible, true);
	});
});

describe('update', () => {
	it('rebuilds the columns when the count changes', () => {
		const { overlay, host } = mount(1400);
		overlay.update(resolve({ columns: 6 }));
		assert.equal(host.shadowRoot.querySelectorAll('.column').length, 6);
	});

	it('changes appearance through custom properties alone', () => {
		// Colour and opacity must not cost DOM work: the toolbar's sliders call
		// this many times a second.
		const { overlay, host } = mount(1400);
		const before = host.shadowRoot.querySelectorAll('.column')[0];

		overlay.update(resolve({ color: '#0000ff', showBackground: true, opacity: 0.5 }));

		assert.equal(host.style.getPropertyValue('--lg-color'), '#0000ff');
		assert.equal(host.style.getPropertyValue('--lg-opacity'), '0.5');
		assert.equal(host.shadowRoot.querySelectorAll('.column')[0], before);
	});

	it('treats showBackground as an opacity of zero', () => {
		const { host } = mount(1400, { opacity: 0.4, showBackground: false });
		assert.equal(host.style.getPropertyValue('--lg-opacity'), '0');
	});

	it('keeps the overlay visible across an update', () => {
		const { overlay } = mount(1400);
		overlay.show();
		overlay.update(resolve({ columns: 3 }));
		assert.equal(overlay.visible, true);
	});
});

describe('destroy', () => {
	it('removes everything it put in the document', () => {
		const { overlay, document } = mount(1400);
		overlay.destroy();
		assert.equal(document.body.children.length, 0);
	});

	it('is final, and the discarded instance stays inert', () => {
		const { overlay, document } = mount(1400);
		overlay.destroy();
		overlay.mount();
		assert.equal(document.body.children.length, 0);
		assert.doesNotThrow(() => overlay.update(resolve({ columns: 3 })));
	});
});

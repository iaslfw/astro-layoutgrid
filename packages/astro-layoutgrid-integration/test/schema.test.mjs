import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULTS, deserialize, resolve, serialize } from '../dist/schema.js';

// Deliberately imported from `dist`, not `src`: these tests exercise the emitted
// output, which is what a consumer actually receives. A package that typechecks
// but emits something unusable is the failure this repository has shipped twice.

describe('resolve', () => {
	it('returns the defaults when given nothing', () => {
		assert.deepEqual(resolve(), DEFAULTS);
	});

	it('spreads a bare number across every breakpoint', () => {
		assert.deepEqual(resolve({ columns: 16 }).columns, { mobile: 16, tablet: 16, desktop: 16 });
	});

	it('fills the breakpoints a partial object leaves out', () => {
		const { gutter } = resolve({ gutter: { mobile: 0.5 } });
		assert.equal(gutter.mobile, 0.5);
		assert.equal(gutter.tablet, DEFAULTS.gutter.tablet);
		assert.equal(gutter.desktop, DEFAULTS.gutter.desktop);
	});

	it('keeps zero, which a truthiness check would swallow', () => {
		assert.equal(resolve({ gutter: 0 }).gutter.mobile, 0);
		assert.equal(resolve({ opacity: 0 }).opacity, 0);
		assert.equal(resolve({ zIndex: 0 }).zIndex, 0);
		assert.equal(resolve({ showBackground: false }).showBackground, false);
	});

	it('rejects numbers that are not usable', () => {
		assert.equal(resolve({ zIndex: Number.NaN }).zIndex, DEFAULTS.zIndex);
		assert.equal(resolve({ opacity: Number.POSITIVE_INFINITY }).opacity, DEFAULTS.opacity);
	});

	it('survives values of the wrong type entirely', () => {
		assert.deepEqual(resolve(null), DEFAULTS);
		assert.deepEqual(resolve('nonsense'), DEFAULTS);
		assert.deepEqual(resolve({ columns: [1, 2, 3] }).columns, DEFAULTS.columns);
		assert.equal(resolve({ color: '' }).color, DEFAULTS.color);
	});

	it('constrains values to what can be rendered', () => {
		assert.equal(resolve({ columns: 0 }).columns.mobile, 1);
		assert.equal(resolve({ columns: 4.7 }).columns.mobile, 5);
		assert.equal(resolve({ gutter: -3 }).gutter.mobile, 0);
		assert.equal(resolve({ opacity: 7 }).opacity, 1);
	});

	it('never lets the desktop threshold fall below the tablet one', () => {
		// Otherwise the tablet range is empty and that breakpoint can never win.
		const { breakpoints } = resolve({ breakpoints: { tablet: 900, desktop: 400 } });
		assert.equal(breakpoints.desktop, 900);
	});

	it('shares no references with the defaults', () => {
		const config = resolve();
		config.columns.mobile = 99;
		assert.equal(DEFAULTS.columns.mobile, 4);
	});

	it('is idempotent, because the toolbar re-resolves what it already resolved', () => {
		const once = resolve({ columns: 7 });
		assert.deepEqual(resolve(once), once);
	});

	it('drops properties that are not part of the schema', () => {
		assert.ok(!('foo' in resolve({ foo: 1 })));
	});
});

describe('serialize and deserialize', () => {
	it('round-trips without loss', () => {
		const config = resolve({ columns: 16, gutter: { mobile: 0.5 } });
		assert.deepEqual(deserialize(serialize(config)), config);
	});

	it('falls back to the defaults instead of throwing', () => {
		// localStorage is no more trustworthy than a DOM attribute. A parse error
		// escaping here would kill the toolbar app at startup, and the symptom —
		// no button in the toolbar — points nowhere near the cause.
		assert.deepEqual(deserialize('{truncated'), DEFAULTS);
		assert.deepEqual(deserialize(null), DEFAULTS);
		assert.deepEqual(deserialize(undefined), DEFAULTS);
		assert.deepEqual(deserialize(''), DEFAULTS);
		assert.deepEqual(deserialize('null'), DEFAULTS);
		assert.deepEqual(deserialize('[1,2,3]'), DEFAULTS);
	});
});

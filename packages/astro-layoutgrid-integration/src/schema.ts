/**
 * Configuration schema for the layout grid.
 *
 * This module is the single source of truth for what a grid configuration is,
 * what it defaults to, and how it survives a round trip through `localStorage`.
 * Every default in the package lives in {@link DEFAULTS}, and every value that
 * reaches the overlay has passed through {@link resolve}.
 *
 * @packageDocumentation
 */

/**
 * The three breakpoints the grid knows about.
 *
 * Mobile is the implicit fallback: it covers everything below the tablet
 * threshold and therefore has no configurable minimum width of its own.
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** One value per breakpoint. */
export type PerBreakpoint<T> = { mobile: T; tablet: T; desktop: T };

/**
 * A per-breakpoint value as the user may write it.
 *
 * A bare number applies to all three breakpoints; an object may set any subset,
 * with the remaining breakpoints falling back to the default.
 */
export type PerBreakpointInput = number | Partial<PerBreakpoint<number>>;

/**
 * Grid options as written by the user in `astro.config.mjs`.
 *
 * Every property is optional, and per-breakpoint properties accept a shorthand.
 * This is the only shape in the package that is allowed to be incomplete —
 * {@link resolve} turns it into a {@link LayoutgridConfig}.
 *
 * @example
 * ```js
 * layoutgrid({ columns: 12, gutter: { mobile: 0.5 } })
 * ```
 */
export interface LayoutgridOptions {
	/** Number of columns. @default \{ mobile: 4, tablet: 8, desktop: 12 \} */
	columns?: PerBreakpointInput;
	/** Space between columns, in rem. @default 1 */
	gutter?: PerBreakpointInput;
	/** Space to the left and right of the grid, in rem. @default 1 */
	margin?: PerBreakpointInput;
	/** Viewport width in px at which each breakpoint starts. @default \{ tablet: 768, desktop: 1024 \} */
	breakpoints?: Partial<{ tablet: number; desktop: number }>;
	/** CSS color for the column borders and fills. @default "#ff0000" */
	color?: string;
	/** Opacity of the column fills, 0 to 1. Only used when `showBackground` is on. @default 0.1 */
	opacity?: number;
	/** CSS max-width of the grid container. @default "100vw" */
	maxWidth?: string;
	/** Whether columns are filled instead of only outlined. @default false */
	showBackground?: boolean;
	/** Stacking order of the overlay. @default 1000 */
	zIndex?: number;
}

/**
 * A fully resolved grid configuration.
 *
 * Nothing here is optional and nothing is ambiguous, which is the point: code
 * consuming this type never needs a fallback of its own. A second fallback
 * would be a second default, and defaults that exist in two places drift apart.
 */
export interface LayoutgridConfig {
	columns: PerBreakpoint<number>;
	/** In rem. */
	gutter: PerBreakpoint<number>;
	/** In rem. */
	margin: PerBreakpoint<number>;
	/** In px. Mobile starts at 0 by definition and is therefore absent. */
	breakpoints: { tablet: number; desktop: number };
	color: string;
	opacity: number;
	maxWidth: string;
	showBackground: boolean;
	zIndex: number;
}

/**
 * The default configuration, and the only place in this package where a
 * default value may be written.
 *
 * Treat it as immutable. {@link resolve} always returns freshly built objects
 * rather than references into this one, so callers cannot mutate it by accident.
 */
export const DEFAULTS: LayoutgridConfig = {
	columns: { mobile: 4, tablet: 8, desktop: 12 },
	gutter: { mobile: 1, tablet: 1, desktop: 1 },
	margin: { mobile: 1, tablet: 1, desktop: 1 },
	breakpoints: { tablet: 768, desktop: 1024 },
	color: '#ff0000',
	opacity: 0.1,
	maxWidth: '100vw',
	showBackground: false,
	zIndex: 1000,
};

/**
 * Returns `value` when it is a number that can be used, otherwise `fallback`.
 *
 * Two checks rather than one. `typeof` rejects strings, `null` and objects;
 * `Number.isFinite` rejects `NaN` and `Infinity`, which are numbers by type,
 * survive `JSON.parse`, and would reach the overlay as invalid CSS.
 */
function num(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Constrains `value` to the inclusive range `[min, max]`. */
function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/** Returns `value` when it is a non-empty string, otherwise `fallback`. */
function text(value: unknown, fallback: string): string {
	return typeof value === 'string' && value !== '' ? value : fallback;
}

/**
 * Reads a value that may be anything, as an object.
 *
 * The null check is not decoration: `typeof null` is `'object'`, so without it
 * every property access below would throw. Non-objects collapse to an empty
 * object, which makes every property read `undefined` and therefore fall back
 * to its default — one branch fewer everywhere this is used.
 */
function asRecord(value: unknown): Record<string, unknown> {
	return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

/** A column count: a whole number, at least one. */
function asColumns(value: number): number {
	return Math.max(1, Math.round(value));
}

/** A spacing value in rem: never negative, but fractions are welcome. */
function asSpacing(value: number): number {
	return Math.max(0, value);
}

/**
 * Expands a per-breakpoint input into a complete set of three values.
 *
 * A bare number spreads across every breakpoint; an object contributes the
 * breakpoints it names and leaves the rest at their fallback; anything else
 * falls back entirely. That last case needs no branch of its own, because a
 * non-object collapses to an empty record and every lookup then misses.
 *
 * @param input - The value as the user or storage supplied it
 * @param fallback - The per-breakpoint defaults that fill the gaps
 * @param sanitize - Applied to every resulting value, for clamping and rounding
 */
function expand(
	input: unknown,
	fallback: PerBreakpoint<number>,
	sanitize: (value: number) => number,
): PerBreakpoint<number> {
	if (typeof input === 'number') {
		const value = sanitize(num(input, fallback.mobile));
		return { mobile: value, tablet: value, desktop: value };
	}

	const partial = asRecord(input);

	return {
		mobile: sanitize(num(partial.mobile, fallback.mobile)),
		tablet: sanitize(num(partial.tablet, fallback.tablet)),
		desktop: sanitize(num(partial.desktop, fallback.desktop)),
	};
}

/**
 * Resolves user options into a complete, valid configuration.
 *
 * This function is the validation boundary of the package. Its parameter is
 * typed as {@link LayoutgridOptions}, but at runtime it also receives whatever
 * {@link deserialize} parsed out of storage, which no type can vouch for. It
 * must therefore check types as well as ranges, and trust nothing it is given.
 *
 * Values are to be corrected rather than rejected. A development tool that
 * refuses to start because a stored opacity is out of range is worse than one
 * that quietly uses the nearest sensible value.
 *
 * The returned object must be freshly built rather than share references with
 * {@link DEFAULTS}, so that callers cannot mutate the defaults by accident.
 *
 * @param options - Partial options, or nothing at all
 *
 * @returns A configuration with every property set
 *
 * @example
 * ```ts
 * resolve();                              // → DEFAULTS
 * resolve({ columns: 16 });               // → 16 columns at every breakpoint
 * resolve({ gutter: { mobile: 0.5 } });   // → mobile 0.5, the rest unchanged
 * resolve({ opacity: 7 });                // → opacity 1
 * ```
 *
 * @remarks
 * Column counts are whole numbers of at least one; spacing is never negative;
 * opacity is confined to 0 through 1. `NaN` and `Infinity` survive `JSON.parse`
 * and must be treated as missing, not passed on as CSS.
 *
 * The desktop breakpoint may not sit below the tablet breakpoint. Were it
 * allowed to, the tablet range would be empty and that breakpoint could never
 * become active — a configuration with no correct behaviour.
 */
export function resolve(options?: LayoutgridOptions): LayoutgridConfig {
	const input = asRecord(options);
	const breakpoints = asRecord(input.breakpoints);

	const tablet = Math.max(0, Math.round(num(breakpoints.tablet, DEFAULTS.breakpoints.tablet)));
	const desktop = Math.max(
		tablet,
		Math.round(num(breakpoints.desktop, DEFAULTS.breakpoints.desktop)),
	);

	return {
		columns: expand(input.columns, DEFAULTS.columns, asColumns),
		gutter: expand(input.gutter, DEFAULTS.gutter, asSpacing),
		margin: expand(input.margin, DEFAULTS.margin, asSpacing),
		breakpoints: { tablet, desktop },
		color: text(input.color, DEFAULTS.color),
		opacity: clamp(num(input.opacity, DEFAULTS.opacity), 0, 1),
		maxWidth: text(input.maxWidth, DEFAULTS.maxWidth),
		showBackground:
			typeof input.showBackground === 'boolean' ? input.showBackground : DEFAULTS.showBackground,
		zIndex: Math.round(num(input.zIndex, DEFAULTS.zIndex)),
	};
}

/**
 * Serialises a configuration for storage.
 *
 * Used to persist the toolbar's settings across a page reload. The result must
 * be accepted by {@link deserialize} unchanged.
 *
 * @param config - A resolved configuration
 *
 * @returns The configuration as a string
 */
export function serialize(config: LayoutgridConfig): string {
	return JSON.stringify(config);
}

/**
 * Reads a configuration back out of storage.
 *
 * Must never throw. `localStorage` is no more trustworthy than a DOM attribute:
 * it may hold a truncated string, a shape written by an older version of this
 * package, or something a user typed by hand. Anything unusable falls back to
 * {@link DEFAULTS} rather than propagating an exception — a parse error here
 * would kill the toolbar app at startup, and the resulting symptom (no button
 * in the toolbar) points nowhere near the cause.
 *
 * Whatever does parse should be passed through {@link resolve}, so that
 * validation and default-filling are inherited rather than written a second
 * time. That is what keeps {@link resolve} the only place holding defaults.
 *
 * @param raw - A string from {@link serialize}, or nothing
 *
 * @returns A complete configuration, in every case
 *
 * @example
 * ```ts
 * deserialize(serialize(config));   // → an equal configuration
 * deserialize('{truncated');        // → DEFAULTS
 * deserialize(null);                // → DEFAULTS
 * ```
 */
export function deserialize(raw: string | null | undefined): LayoutgridConfig {
	if (typeof raw !== 'string') return resolve();

	try {
		const data = JSON.parse(raw);
		return resolve(data);
	} catch {
		return resolve();
	}
}

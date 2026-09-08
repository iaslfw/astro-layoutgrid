import type { Breakpoint, LayoutgridConfig } from './schema.js';

/**
 * The column grid overlay.
 *
 * Knows nothing about Astro, nothing about the dev toolbar and nothing about
 * server-rendered markup. It is handed a {@link LayoutgridConfig} and a
 * `document`, and it builds, updates and removes a grid of its own making.
 * That independence is what makes it testable outside a browser.
 *
 * @packageDocumentation
 */

/** Prefix for the custom properties the overlay writes onto its host. */
const PROP = '--lg';

/**
 * Styles for the shadow tree.
 *
 * Everything here is safe from the page: the shadow boundary keeps the host
 * document's CSS out. Values that change at runtime are read from custom
 * properties, so a settings change is a property write rather than a rebuild.
 *
 * The fill is mixed rather than applied through `opacity`, which would fade the
 * column borders along with it and blur the very lines the tool exists to show.
 */
const STYLES = `
	.container {
		box-sizing: border-box;
		height: 100%;
		margin: 0 auto;
		max-width: var(${PROP}-max-width);
		padding-inline: var(${PROP}-margin);
	}

	.columns {
		display: grid;
		height: 100%;
		gap: var(${PROP}-gutter);
	}

	.column {
		box-sizing: border-box;
		border-inline: 1px solid var(${PROP}-color);
		background: color-mix(in srgb, var(${PROP}-color) calc(var(${PROP}-opacity) * 100%), transparent);
	}
`;

export class Overlay {
	private config: LayoutgridConfig;
	private readonly doc: Document;

	private host: HTMLElement | null = null;
	private container: HTMLElement | null = null;
	private columnsEl: HTMLElement | null = null;

	/** One query per threshold: tablet and desktop. Mobile is the absence of both. */
	private queries: MediaQueryList[] = [];
	/** Bound once, so that `removeEventListener` can find the same reference again. */
	private readonly onQueryChange: () => void;

	private breakpoint: Breakpoint = 'mobile';
	private columnCount = 0;
	private mounted = false;
	private destroyed = false;

	/**
	 * @param config - A resolved configuration; every property must be set
	 * @param doc - The document to build in. Injected rather than taken from the
	 *   global scope so the overlay can be exercised in a test environment.
	 */
	constructor(config: LayoutgridConfig, doc: Document = document) {
		this.config = config;
		this.doc = doc;
		this.onQueryChange = () => this.syncBreakpoint();
	}

	/** Whether the overlay is currently on screen. Derived, never stored. */
	get visible(): boolean {
		return this.host !== null && this.host.style.display !== 'none';
	}

	/**
	 * Builds the overlay and attaches it to the document.
	 *
	 * Starts hidden: the toolbar decides when the grid appears, and an overlay
	 * that flashes up on page load would be worse than useless.
	 *
	 * Calling this twice is a no-op rather than an error. There is exactly one
	 * caller, so a second call would be a bug in this package — but crashing a
	 * development tool over it helps nobody, and the guard costs one line.
	 *
	 * @param target - Where to attach. Defaults to the document body.
	 */
	mount(target: HTMLElement = this.doc.body): void {
		if (this.mounted || this.destroyed) return;

		this.host = this.doc.createElement('div');

		// Inline, not `:host`: the shadow boundary protects the tree inside, but
		// the host element itself is still matched by the page's own selectors,
		// and a `:host` rule loses against them. An inline style does not.
		Object.assign(this.host.style, {
			position: 'fixed',
			inset: '0',
			display: 'none',
			pointerEvents: 'none',
			zIndex: String(this.config.zIndex),
		});

		const root = this.host.attachShadow({ mode: 'open' });
		const style = this.doc.createElement('style');
		style.textContent = STYLES;

		this.container = this.doc.createElement('div');
		this.container.className = 'container';
		this.columnsEl = this.doc.createElement('div');
		this.columnsEl.className = 'columns';
		this.container.append(this.columnsEl);
		root.append(style, this.container);

		this.applyProperties();
		this.watchBreakpoints();
		this.breakpoint = this.readBreakpoint();
		this.buildColumns();

		target.append(this.host);
		this.mounted = true;
	}

	/**
	 * Applies a new configuration.
	 *
	 * Only the column count needs DOM work; everything else is a custom property
	 * on the host, and writing one is cheaper than deciding whether it was worth
	 * writing. This matters because the toolbar's sliders can call this dozens of
	 * times per second, and rebuilding twelve elements each time would be felt.
	 *
	 * @param config - A resolved configuration
	 */
	update(config: LayoutgridConfig): void {
		if (this.destroyed) return;

		const thresholdsChanged =
			config.breakpoints.tablet !== this.config.breakpoints.tablet ||
			config.breakpoints.desktop !== this.config.breakpoints.desktop;

		this.config = config;
		if (!this.mounted) return;

		if (this.host) this.host.style.zIndex = String(config.zIndex);

		// Re-arm before reading: the new thresholds decide which breakpoint is active.
		if (thresholdsChanged) this.watchBreakpoints();
		this.breakpoint = this.readBreakpoint();

		this.applyProperties();

		if (config.columns[this.breakpoint] !== this.columnCount) this.buildColumns();
	}

	/** Shows the overlay. */
	show(): void {
		if (this.host) this.host.style.display = 'block';
	}

	/** Hides the overlay, leaving it mounted and ready. */
	hide(): void {
		if (this.host) this.host.style.display = 'none';
	}

	/**
	 * Shows or hides the overlay.
	 *
	 * @param force - The state to move to. Given, it is used as-is; omitted, the
	 *   current state is inverted. The toolbar always passes it, because Astro
	 *   tells it the target state rather than a wish to flip — and a flip that
	 *   guesses is how a toolbar button ends up disagreeing with the screen.
	 */
	toggle(force?: boolean): void {
		// `??`, not `||`: with `||`, `toggle(false)` would fall through to the
		// inverted state and turn the overlay on.
		if (force ?? !this.visible) this.show();
		else this.hide();
	}

	/**
	 * Removes the overlay and everything it registered.
	 *
	 * Final: a destroyed overlay cannot be mounted again, build a new one
	 * instead. Every listener is removed here, because in development this
	 * class is created and discarded on every reload, and a listener that
	 * outlives its overlay accumulates silently until something gets slow.
	 */
	destroy(): void {
		this.unwatchBreakpoints();
		this.host?.remove();
		this.host = null;
		this.container = null;
		this.columnsEl = null;
		this.mounted = false;
		this.destroyed = true;
	}

	/**
	 * Writes every runtime value onto the host as a custom property.
	 *
	 * Per-breakpoint values are resolved to the active breakpoint here, so the
	 * shadow stylesheet never has to know which one that is.
	 *
	 * `showBackground` needs no class of its own: switching it off is the same
	 * as a fill opacity of zero, and one code path is better than two.
	 */
	private applyProperties(): void {
		const { config, breakpoint, host } = this;
		if (!host) return;

		host.style.setProperty(`${PROP}-gutter`, `${config.gutter[breakpoint]}rem`);
		host.style.setProperty(`${PROP}-margin`, `${config.margin[breakpoint]}rem`);
		host.style.setProperty(`${PROP}-max-width`, config.maxWidth);
		host.style.setProperty(`${PROP}-color`, config.color);
		host.style.setProperty(`${PROP}-opacity`, String(config.showBackground ? config.opacity : 0));
	}

	/**
	 * Rebuilds the column elements for the active breakpoint.
	 *
	 * `grid-template-columns` is written here rather than read from a custom
	 * property: the count is the one value that already coincides with DOM work,
	 * so keeping it in JavaScript avoids relying on `repeat(var(…))` resolving
	 * the way one hopes.
	 */
	private buildColumns(): void {
		if (!this.columnsEl) return;

		const count = this.config.columns[this.breakpoint];
		this.columnsEl.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
		this.columnsEl.replaceChildren();

		const fragment = this.doc.createDocumentFragment();
		for (let i = 0; i < count; i++) {
			const column = this.doc.createElement('div');
			column.className = 'column';
			fragment.append(column);
		}
		this.columnsEl.append(fragment);

		this.columnCount = count;
	}

	/**
	 * Determines the active breakpoint.
	 *
	 * Reads the media queries when they exist. Where `matchMedia` is missing —
	 * a test environment, most likely — it falls back to the viewport width, so
	 * that the overlay behaves rather than silently claiming to be mobile.
	 */
	private readBreakpoint(): Breakpoint {
		const [tablet, desktop] = this.queries;

		if (tablet && desktop) {
			if (desktop.matches) return 'desktop';
			return tablet.matches ? 'tablet' : 'mobile';
		}

		const width = this.doc.defaultView?.innerWidth ?? 0;
		if (width >= this.config.breakpoints.desktop) return 'desktop';
		return width >= this.config.breakpoints.tablet ? 'tablet' : 'mobile';
	}

	/**
	 * Reacts to a threshold being crossed.
	 *
	 * Does nothing when the breakpoint is unchanged, which is why the media
	 * queries are worth the trouble: a resize observer would fire on every pixel
	 * of a drag and leave this check to run hundreds of times a second.
	 */
	private syncBreakpoint(): void {
		const next = this.readBreakpoint();
		if (next === this.breakpoint) return;

		this.breakpoint = next;
		this.applyProperties();
		if (this.config.columns[next] !== this.columnCount) this.buildColumns();
	}

	/** Subscribes to both thresholds, replacing any previous subscription. */
	private watchBreakpoints(): void {
		this.unwatchBreakpoints();

		const view = this.doc.defaultView;
		if (!view?.matchMedia) return;

		this.queries = [
			view.matchMedia(`(min-width: ${this.config.breakpoints.tablet}px)`),
			view.matchMedia(`(min-width: ${this.config.breakpoints.desktop}px)`),
		];
		for (const query of this.queries) query.addEventListener('change', this.onQueryChange);
	}

	/** Removes the media query listeners and forgets the queries. */
	private unwatchBreakpoints(): void {
		for (const query of this.queries) query.removeEventListener('change', this.onQueryChange);
		this.queries = [];
	}
}

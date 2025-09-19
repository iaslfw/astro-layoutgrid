/**
 * Represents the available responsive breakpoint identifiers for the layout grid.
 *
 * This type defines the three standard breakpoints used throughout the grid system
 * to determine which layout configuration should be active based on viewport width.
 * The breakpoints follow a mobile-first approach where mobile is the default fallback.
 *
 * @since 1.0.0
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Normalized grid configuration data used internally by the layout grid system.
 *
 * This interface represents the processed and normalized configuration after
 * default values have been applied and array formats have been standardized.
 * It contains all the necessary data for rendering the responsive grid overlay.
 *
 * @since 1.2.0
 */
export interface GridData {
	/** Number of columns to display on mobile devices */
	mobileColumns: number;
	/** Number of columns to display on tablet devices */
	tabletColumns: number;
	/** Number of columns to display on desktop devices */
	desktopColumns: number;
	/** Minimum width in pixels to trigger tablet layout */
	tabletBreakpoint: number;
	/** Minimum width in pixels to trigger desktop layout */
	desktopBreakpoint: number;
	/** Gutter spacing in rem for [mobile, tablet, desktop] breakpoints */
	gutterArray: number | number[];
	/** Margin spacing in rem for [mobile, tablet, desktop] breakpoints */
	marginArray: number | number[];
	/** CSS color value for grid lines and backgrounds */
	gridColor: string;
	/** Opacity level (0-1) for grid background when showBackground is true */
	gridOpacity: number;
	/** Maximum width constraint for the grid container */
	maxWidth: string;
	/** Whether to display colored backgrounds in grid columns */
	showBackground: boolean;
	/** z-index value for the grid overlay */
	zIndex: number;
}

/**
 * Configuration props interface for the LayoutGrid Astro component.
 *
 * This interface defines all the customizable properties that can be passed
 * to the LayoutGrid component. All properties are optional and have sensible
 * defaults based on common design system patterns (similar to Tailwind CSS).
 *
 * @since 1.0.0
 */
export interface LayoutgridProps {
	/** Number of columns to display on desktop devices (≥1024px). @default 12 */
	desktopColumns?: number;
	/** Number of columns to display on tablet devices (768px-1023px). @default 8 */
	tabletColumns?: number;
	/** Number of columns to display on mobile devices (<768px). @default 4 */
	mobileColumns?: number;
	/**
	 * Gutter spacing between columns in rem units.
	 * Can be a single number (applied to all breakpoints) or an array [mobile, tablet, desktop].
	 * @default 1
	 */
	gutter?: number | [number, number, number];
	/**
	 * Margin spacing around the grid container in rem units.
	 * Can be a single number (applied to all breakpoints) or an array [mobile, tablet, desktop].
	 * @default 1
	 */
	margin?: number | [number, number, number];
	/** CSS color value for grid lines and column backgrounds. @default "#ff0000" */
	gridColor?: string;
	/** Opacity level (0-1) for column backgrounds when showBackground is enabled. @default 0.1 */
	gridOpacity?: number;
	/** Maximum width constraint for the grid container (CSS value). @default "100vw" */
	maxWidth?: string;
	/** Whether to display colored backgrounds in grid columns for better visibility. @default false */
	showBackground?: boolean;
	/** Minimum viewport width in pixels to trigger tablet layout. @default 768 */
	tabletBreakpoint?: number;
	/** Minimum viewport width in pixels to trigger desktop layout. @default 1024 */
	desktopBreakpoint?: number;
	/** z-index value for the grid overlay @default 1000*/
	zIndex?: number;
}

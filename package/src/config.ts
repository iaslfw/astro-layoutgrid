/**
 * Creates a normalized configuration object from HTML dataset attributes.
 *
 * This function processes the dataset attributes from a DOM element and converts
 * them into a structured configuration object with proper type casting and default
 * values. It handles the conversion from string-based HTML attributes to the
 * appropriate JavaScript types needed for grid rendering.
 *
 * @param dataset - The DOMStringMap containing data attributes from an HTML element
 *
 * @returns A normalized configuration object with typed properties and defaults applied
 *
 * @remarks
 * The function performs several type conversions:
 * - String numbers are parsed to integers for columns and breakpoints
 * - JSON strings are parsed to arrays for gutter and margin values
 * - String floats are parsed for opacity values
 * - Boolean strings ("true"/"false") are converted to actual booleans
 *
 * All properties have sensible defaults that align with common design system patterns,
 * particularly following Tailwind CSS breakpoint conventions.
 *
 * @since 1.0.0
 */
export const createConfig = (dataset: DOMStringMap) => {
	return {
		columns: {
			mobile: parseInt(dataset.mobileColumns || '4'),
			tablet: parseInt(dataset.tabletColumns || '8'),
			desktop: parseInt(dataset.desktopColumns || '12'),
		},
		breakpoints: {
			tablet: parseInt(dataset.tabletBreakpoint || '768'),
			desktop: parseInt(dataset.desktopBreakpoint || '1024'),
		},
		gutter: JSON.parse(dataset.gutter || '[0.75, 1, 1]') as [number, number, number],
		margin: JSON.parse(dataset.margin || '[0.75, 1, 1]') as [number, number, number],
		gridColor: dataset.gridColor || '#ff0000',
		gridOpacity: parseFloat(dataset.gridOpacity || '0.1'),
		showBackground: dataset.showBackground === 'true',
	};
};

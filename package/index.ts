// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import Layoutgrid from './src/Layoutgrid.astro';
export default Layoutgrid;

// Export all types for TypeScript users (excluding the main props to avoid duplicates)
export type { Breakpoint, GridData } from './src/types';
export type { LayoutgridProps as GridProps } from './src/types';

/// <reference types="astro/client" />

import type { LayoutgridProps } from './types';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// Ambient module declaration for .astro files
declare module '*.astro' {
	const Component: AstroComponentFactory;
	export default Component;
}

// Declare the specific Layoutgrid component with proper typing
declare module './Layoutgrid.astro' {
	interface LayoutgridComponent extends AstroComponentFactory {
		(props: LayoutgridProps): ReturnType<AstroComponentFactory>;
	}
	
	const Layoutgrid: LayoutgridComponent;
	export default Layoutgrid;
}

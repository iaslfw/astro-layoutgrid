/// <reference types="astro/client" />

// Ambient module declaration for .astro files
declare module '*.astro' {
	import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
	const Component: AstroComponentFactory;
	export default Component;
}

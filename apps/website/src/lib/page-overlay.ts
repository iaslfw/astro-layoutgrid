import { DEFAULTS, type LayoutgridConfig } from 'astro-layoutgrid';
import { Overlay } from 'astro-layoutgrid/overlay';

let overlay: Overlay | null = null;

function instance(): Overlay {
	if (overlay === null) {
		overlay = new Overlay(DEFAULTS, document);
		overlay.mount();
		overlay.show();
	}
	return overlay;
}

export function updateOverlay(config: LayoutgridConfig): void {
	instance().update(config);
}

export function setOverlayVisible(visible: boolean): void {
	instance().toggle(visible);
}

export function isOverlayVisible(): boolean {
	return instance().visible;
}

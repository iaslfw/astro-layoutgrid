import { DEFAULTS, type LayoutgridConfig, type LayoutgridOptions } from 'astro-layoutgrid';

const PER_BREAKPOINT = ['columns', 'gutter', 'margin'] as const;

function same(a: unknown, b: unknown): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

function shorten(value: { mobile: number; tablet: number; desktop: number }): unknown {
	return value.mobile === value.tablet && value.tablet === value.desktop ? value.mobile : value;
}

export function toOptions(config: LayoutgridConfig, all = false): LayoutgridOptions {
	const options: Record<string, unknown> = {};

	for (const key of PER_BREAKPOINT) {
		if (all || !same(config[key], DEFAULTS[key])) options[key] = shorten(config[key]);
	}
	for (const key of [
		'breakpoints',
		'color',
		'opacity',
		'maxWidth',
		'showBackground',
		'zIndex',
	] as const) {
		if (all || !same(config[key], DEFAULTS[key])) options[key] = config[key];
	}

	return options as LayoutgridOptions;
}

export function format(options: LayoutgridOptions, indent = '\t'): string {
	const entries = Object.entries(options);
	if (entries.length === 0) return '{}';

	const body = entries
		.map(([key, value]) => `${indent}${key}: ${formatValue(value, indent)},`)
		.join('\n');
	return `{\n${body}\n}`;
}

function formatValue(value: unknown, indent: string): string {
	if (typeof value === 'string') return `'${value}'`;
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	if (value && typeof value === 'object') {
		const inner = Object.entries(value)
			.map(([k, v]) => `${indent}\t${k}: ${formatValue(v, indent + '\t')},`)
			.join('\n');
		return `{\n${inner}\n${indent}}`;
	}
	return String(value);
}

export function parse(text: string): unknown {
	try {
		return new Function(`'use strict'; return (${text});`)() as unknown;
	} catch {
		return null;
	}
}

export function fullConfig(source: string): string {
	const body = source
		.split('\n')
		.map((line, index) => (index === 0 ? line : '\t\t' + line))
		.join('\n');

	return [
		"import { defineConfig } from 'astro/config';",
		"import layoutgrid from 'astro-layoutgrid';",
		'',
		'export default defineConfig({',
		'\tintegrations: [layoutgrid(' + body + ')],',
		'});',
	].join('\n');
}

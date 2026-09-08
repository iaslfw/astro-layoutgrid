export type ColumnState = 'shipped' | 'active' | 'planned';

export interface RoadmapItem {
	title: string;
	body: string;
	meta?: string;
}

export interface RoadmapColumn {
	state: ColumnState;
	label: string;
	items: RoadmapItem[];
}

export const roadmapColumns = {
	item: 'Item',
	note: 'Note',
	detail: 'What it is',
} as const;

export const roadmap: RoadmapColumn[] = [
	{
		state: 'planned',
		label: 'Planned',
		items: [
			{
				title: 'Vite plugin',
				meta: 'unblocks the rest',
				body: 'The shared delivery mechanism for everything below.',
			},
			{
				title: 'SvelteKit',
				body: 'First, because its Vite setup is the least surprising.',
			},
			{
				title: 'Nuxt',
				body: 'Vue projects, through a module around the same plugin.',
			},
			{
				title: 'React',
				body: 'Next.js and React Router, once the plugin has proved itself.',
			},
		],
	},
	{
		state: 'active',
		label: 'In progress',
		items: [
			{
				title: 'This site',
				body: 'The config editor above drives the real overlay class.',
			},
			{
				title: 'Documentation',
				body: 'Options and migration still live in the README.',
			},
		],
	},
	{
		state: 'shipped',
		label: 'Shipped',
		items: [
			{
				title: 'Astro integration',
				meta: 'v2.0.0',
				body: 'A dev toolbar app, registered from astro.config.',
			},
			{
				title: 'Framework-free core',
				body: 'The grid is a plain class. It knows nothing about Astro.',
			},
			{
				title: 'Zero dependencies',
				body: 'Nothing lands in your lockfile.',
			},
		],
	},
];

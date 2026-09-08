export interface SectionHeading {
	title: string;
	body?: string;
}

export const sections = {
	features: {
		title: 'It stays out of your way.',
		body:
			'A grid you can trust is one you stop thinking about — until you need it, and then it is one click away.',
	},
	roadmap: {
		title: 'Astro today. The same grid everywhere else.',
		body:
			'The overlay is already framework-free. What is left for every other framework is the delivery, not the drawing.',
	},
	install: {
		title: 'Set up in thirty seconds.',
	},
} satisfies Record<string, SectionHeading>;

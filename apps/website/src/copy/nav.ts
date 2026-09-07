export type SocialKind = 'github' | 'x' | 'linkedin' | 'substack';

export interface NavLink {
	label: string;
	href: string;
}

export interface SocialLink extends NavLink {
	kind: SocialKind;
	description: string;
}

export const nav = {
	homeLabel: 'home',
	docs: {
		label: 'Docs',
		href: 'https://github.com/iaslfw/astro-layoutgrid#readme',
	},
	blog: {
		label: 'Blog',
		href: 'https://substack.com/@iaslf',
	},
	repository: {
		label: 'GitHub',
		href: 'https://github.com/iaslfw/astro-layoutgrid',
	},
	socialsLabel: 'Socials',
	menuLabel: 'Menu',
	menuTitle: 'Navigation',
	socials: [
		{
			kind: 'github',
			label: 'GitHub',
			href: 'https://github.com/iaslfw',
			description: 'Code and everything unfinished',
		},
		{
			kind: 'x',
			label: 'X',
			href: 'https://x.com/iaslfw',
			description: 'Thoughts and musings',
		},
		{
			kind: 'substack',
			label: 'Substack',
			href: 'https://substack.com/@iaslf',
			description: 'Longer writing, less often',
		},
		{
			kind: 'linkedin',
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/iaslfw',
			description: 'Professional network',
		},
	] satisfies SocialLink[],
} as const;

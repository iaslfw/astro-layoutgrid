export type SocialKind = 'github' | 'x' | 'linkedin' | 'substack';

export interface NavLink {
	label: string;
	href: string;
}

export interface SocialLink extends NavLink {
	kind: SocialKind;
	description: string;
}

const docs: NavLink = {
	label: 'Docs',
	href: 'https://github.com/iaslfw/astro-layoutgrid#readme',
};

const blog: NavLink = {
	label: 'Blog',
	href: 'https://substack.com/@iaslf',
};

export const nav = {
	homeLabel: 'home',
	docs,
	blog,
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

export type FeatureArtName = 'dependencies' | 'production' | 'isolation';

export interface Feature {
	title: string;
	body: string;
	wide: boolean;
	art: FeatureArtName;
}

export const features: Feature[] = [
	{
		title: 'Zero dependencies, one line of config',
		body:
			'The package has no dependencies at all — nothing lands in your lockfile, and there is no supply chain to inherit. It goes in astro.config and nowhere else: no import in your layouts, no markup, no keyboard shortcut you have to be told about.',
		wide: true,
		art: 'dependencies',
	},
	{
		title: 'It never reaches your users',
		body:
			'Not because a setting is right, but because dev toolbar apps do not exist in a production build. Build your site and search the output — there are no matches.',
		wide: false,
		art: 'production',
	},
	{
		title: 'Nothing can shift it',
		body:
			'The grid lives in a shadow root and carries its load-bearing styles inline. No stylesheet on your page can move it, so you never end up mistrusting the tool instead of your layout.',
		wide: false,
		art: 'isolation',
	},
];

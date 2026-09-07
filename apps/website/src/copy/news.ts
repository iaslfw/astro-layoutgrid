export const news = {
	badge: 'News',
	teaser: 'v2.0 is out now',
	title: 'Version 2 is an integration, not a component',
	subtitle: 'What changed, and why it was worth a major version.',
	image: {
		src: '/news-v2.svg',
		alt: 'A page with a column grid laid over it',
		width: 640,
		height: 300,
	},
	paragraphs: [
		'Version 1 was a component. You imported it, pasted it into every layout, and remembered a keyboard shortcut nobody had told you about. Its code was shipped to your users along with everything else, because a component has no way of knowing it was only meant for development.',
		'Version 2 registers an app in Astro’s dev toolbar instead. It goes in `astro.config` and nowhere else: no import, no markup, and a visible button rather than an undocumented key combination.',
		'The part worth stressing is what that buys you. Dev toolbar apps do not exist in a production build — there is no mechanism by which the overlay could reach one. Being development-only stopped being a setting that can be got wrong and became a property of how the thing is built. You can check it rather than trust it: run `astro build` and search the output for `layoutgrid-overlay`. There are no matches.',
		'Underneath, it was rewritten rather than repaired. The old version kept its configuration in two places that disagreed with each other, offered no way to change anything at runtime, and rendered into your page where any stylesheet could shift it. The new one has a single source of defaults, a real API, and lives in a shadow root where nothing on your page can reach it. It also has no dependencies at all.',
		'Migrating is three small edits: drop the component from your layouts, move its props into `layoutgrid()`, and rename `gridColor` and `gridOpacity` to `color` and `opacity`. The shortcut is unchanged.',
	],
	close: 'Close',
	readMore: 'Read on GitHub',
} as const;

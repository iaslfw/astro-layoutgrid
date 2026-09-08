export const playground = {
	open: 'Edit the configuration',
	title: 'astro.config.mjs',
	description:
		'Change the options and the grid behind this dialog follows. It is the same text you paste into your own configuration.',
	prefix: 'integrations: [layoutgrid(',
	suffix: ')],',
	textareaLabel: 'Options for layoutgrid()',
	applied: 'Applied as you type.',
	invalid: 'Not valid JavaScript yet — the grid is showing the last version that was.',
	copy: 'Copy config',
	copied: 'Copied',
	confirm: 'Okay',
	toggle: 'Toggle the grid',
} as const;

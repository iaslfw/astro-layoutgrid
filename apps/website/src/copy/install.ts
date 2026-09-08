export const installCommands = {
	npm: 'npm install -D astro-layoutgrid',
	pnpm: 'pnpm add -D astro-layoutgrid',
	yarn: 'yarn add -D astro-layoutgrid',
	bun: 'bun add -d astro-layoutgrid',
} as const;

export type PackageManager = keyof typeof installCommands;

export const install = {
	body: 'Install it, add layoutgrid() to your integrations, and press',
	shortcut: 'Cmd/Ctrl + Shift + G',
} as const;

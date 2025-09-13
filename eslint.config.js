import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
	js.configs.recommended,

	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				// DOM/Browser globals
				HTMLElement: 'readonly',
				document: 'readonly',
				window: 'readonly',
				Element: 'readonly',
				KeyboardEvent: 'readonly',
				DOMStringMap: 'readonly',
				ResizeObserver: 'readonly',
				customElements: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': typescript,
		},
		rules: {
			// Essential TypeScript rules for npm packages
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					args: 'after-used',
					vars: 'all',
					caughtErrors: 'none',
				},
			],
			'@/prefer-const': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-inferrable-types': 'error',
			'no-unused-vars': 'off', // Handled by TypeScript rule
			'no-undef': 'off', // TypeScript handles this
		},
	},

	// Astro files
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.astro'],
		languageOptions: {
			globals: {
				// DOM/Browser globals for Astro
				HTMLElement: 'readonly',
				document: 'readonly',
				window: 'readonly',
				Element: 'readonly',
				KeyboardEvent: 'readonly',
				DOMStringMap: 'readonly',
				ResizeObserver: 'readonly',
				customElements: 'readonly',
			},
		},
		rules: {
			// Essential Astro rules
			'astro/no-conflict-set-directives': 'error',
			'astro/no-unused-define-vars-in-style': 'error',
			'no-undef': 'off', // TypeScript handles this
		},
	},

	{
		files: ['**/*.js', '**/*.ts', '**/*.astro'],
		rules: {
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],
		},
	},

	// Configuration files (allow console)
	{
		files: ['*.config.js', '*.config.mjs', '*.config.ts'],
		rules: {
			'no-console': 'off',
		},
	},

	// Ignore patterns
	{
		ignores: ['node_modules/**', 'dist/**', '.astro/**'],
	},
];

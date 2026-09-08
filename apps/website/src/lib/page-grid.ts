import { DEFAULTS } from 'astro-layoutgrid';

const { columns, gutter, margin, breakpoints, maxWidth } = DEFAULTS;

export const pageGridCss = `
.page-grid {
	display: grid;
	width: 100%;
	max-width: ${maxWidth};
	margin-inline: auto;
	box-sizing: border-box;
	grid-template-columns: repeat(${columns.mobile}, minmax(0, 1fr));
	gap: ${gutter.mobile}rem;
	padding-inline: ${margin.mobile}rem;
}

.page-col {
	grid-column: 1 / -1;
	min-width: 0;
}

@media (min-width: ${breakpoints.tablet}px) {
	.page-grid {
		grid-template-columns: repeat(${columns.tablet}, minmax(0, 1fr));
		gap: ${gutter.tablet}rem;
		padding-inline: ${margin.tablet}rem;
	}
}

@media (min-width: ${breakpoints.desktop}px) {
	.page-grid {
		grid-template-columns: repeat(${columns.desktop}, minmax(0, 1fr));
		gap: ${gutter.desktop}rem;
		padding-inline: ${margin.desktop}rem;
	}

	.page-col {
		grid-column: ${Math.floor(columns.desktop / 4) + 1} / span ${columns.desktop / 2};
	}

	.page-col-wide {
		grid-column: 1 / -1;
	}
}
`;

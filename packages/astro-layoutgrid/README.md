# astro-layoutgrid

A responsive column grid you can lay over any page while you build it, to check that things line up.

Version 2 is **a real Astro integration**. Version 1 was a component: you imported it, pasted it into
every layout, remembered a keyboard shortcut nobody had told you about, and shipped its code to your
users. This one goes in `astro.config` and nowhere else.

```js
import { defineConfig } from 'astro/config';
import layoutgrid from 'astro-layoutgrid';

export default defineConfig({
  integrations: [layoutgrid()],
});
```

That is the whole installation. No import in your layouts, no markup, nothing to remember: the grid
appears as a button in the Astro dev toolbar.

## Install

```bash
npm install -D astro-layoutgrid
```

`-D` is deliberate. This is a development tool and never reaches your users — see
[Dev-only, by construction](#dev-only-by-construction).

## Use it

Click the layout grid button in the dev toolbar, or press <kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> +
<kbd>G</kbd>. The shortcut presses the same button, so the toolbar and the grid can never disagree
about whether it is on.

Whether the grid was on survives a reload, so it stays put across the dozens of reloads a working
session actually involves.

## Configure it

Everything is configured in `astro.config`, and nothing anywhere else. One place to look, one place
to change, and the file is the truth.

```js
layoutgrid({
  columns: { mobile: 4, tablet: 8, desktop: 12 },
  gutter: 1,
  margin: { mobile: 1, tablet: 1.5, desktop: 2 },
  color: '#ff0000',
  maxWidth: '1200px',
});
```

| Option           | Type                       | Default                                 | What it does                                           |
| ---------------- | -------------------------- | --------------------------------------- | ------------------------------------------------------ |
| `columns`        | `number` or per breakpoint | `{ mobile: 4, tablet: 8, desktop: 12 }` | Number of columns                                      |
| `gutter`         | `number` or per breakpoint | `1`                                     | Space between columns, in rem                          |
| `margin`         | `number` or per breakpoint | `1`                                     | Space either side of the grid, in rem                  |
| `breakpoints`    | `{ tablet, desktop }`      | `{ tablet: 768, desktop: 1024 }`        | Viewport width in px at which each one starts          |
| `color`          | `string`                   | `'#ff0000'`                             | Any CSS colour, for the lines and fills                |
| `opacity`        | `number`                   | `0.1`                                   | Fill opacity, 0 to 1; used when `showBackground` is on |
| `maxWidth`       | `string`                   | `'100vw'`                               | CSS max-width of the grid container                    |
| `showBackground` | `boolean`                  | `false`                                 | Fill the columns instead of only outlining them        |
| `zIndex`         | `number`                   | `1000`                                  | Stacking order of the overlay                          |

Anything per-breakpoint takes a shorthand: `gutter: 1` means all three, `gutter: { mobile: 0.5 }`
means mobile only and leaves the rest at their defaults.

Values are corrected rather than rejected. A column count below one becomes one, an opacity of `7`
becomes `1`, and a desktop breakpoint below the tablet one is lifted to match — because a tablet
range with no width in it is a setting with no correct behaviour. A development tool that refuses to
start over a typo would be the worse trade.

Filled columns are mixed rather than faded, so the lines stay sharp at any opacity.

## Dev-only, by construction

Nothing here reaches a production build. Not because an option is set correctly, but because Astro's
dev toolbar apps do not exist in one — there is no mechanism by which the overlay could get there.

You can check it rather than take our word for it: run `astro build` and search the output for
`layoutgrid-overlay`. There are no matches.

## Coming from version 1

Version 1 was a component. If you have it, the move is:

1. Delete `<Layoutgrid />` from your layouts, and its import.
2. Add `layoutgrid()` to `integrations` in `astro.config`, with the props you were passing.
3. Two renames: `gridColor` is now `color`, `gridOpacity` is now `opacity`.
4. Per-breakpoint values are objects now, not arrays. `gutter={[0.5, 1, 1]}` becomes
   `gutter: { mobile: 0.5, tablet: 1, desktop: 1 }` — the array's positions meant mobile, tablet,
   desktop, which nothing said out loud.

The shortcut is unchanged.

## Requirements

Astro 5, 6 or 7. Node 22.12 or newer, which is what Astro 7 asks for.

## Licence

MIT © Sebastian Wolf

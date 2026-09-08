# astro-layoutgrid

A column grid you can lay over any page while you build it, to check that things line up.

[![npm](https://img.shields.io/npm/v/astro-layoutgrid?logo=npm&label=npm)](https://www.npmjs.com/package/astro-layoutgrid)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-yellow)](./LICENCE)
[![Built for Astro](https://img.shields.io/badge/built%20for-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build)

Version 2 is **an Astro integration**. Version 1 was a component: you imported it, pasted it into
every layout, remembered a keyboard shortcut nobody had told you about, and shipped its code to your
users. This one goes in `astro.config` and nowhere else.

## Install

```bash
npm install -D astro-layoutgrid
```

`-D` is deliberate. This is a development tool and never reaches your shipped product — see
[Dev-only, by construction](#dev-only-by-construction).

## Set it up

```js
import { defineConfig } from 'astro/config';
import layoutgrid from 'astro-layoutgrid';

export default defineConfig({
  integrations: [layoutgrid()],
});
```

That is the whole installation. No import in your layouts, no markup, nothing to remember.

## Use it

Click the layout grid button in the Astro dev toolbar, or press <kbd>Cmd/Ctrl</kbd> +
<kbd>Shift</kbd> + <kbd>G</kbd>. The shortcut presses the same button, so the toolbar and the grid
can never disagree about whether it is on.

Whether the grid was on survives a reload, so it stays put across the dozens of reloads a working
session actually involves.

## Options

Everything is configured in `astro.config`, and nowhere else. One place to look, one place to
change, and the file is the truth.

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
| `maxWidth`       | `string`                   | `'100vw'`                               | CSS `max-width` of the grid container                  |
| `showBackground` | `boolean`                  | `false`                                 | Fill the columns instead of only outlining them        |
| `zIndex`         | `number`                   | `1000`                                  | Stacking order of the overlay                          |

### Per-breakpoint values

`columns`, `gutter` and `margin` take a shorthand. A bare number applies to all three breakpoints; an
object sets the ones you name and leaves the rest at their defaults.

```js
gutter: 1; // all three
gutter: {
  mobile: 0.5;
} // mobile only; tablet and desktop stay at 1
```

There is no `breakpoints.mobile`, because mobile is everything below the tablet threshold. A field
with only one valid value is a trap, not a setting.

### Values are corrected, not rejected

A column count below one becomes one. An opacity of `7` becomes `1`. A desktop breakpoint below the
tablet one is lifted to match, because a tablet range with no width in it is a configuration with no
correct behaviour. `NaN` and `Infinity` count as missing.

A development tool that refuses to start over a typo would be the worse trade.

### Filled columns

`showBackground` fills the columns instead of only outlining them. The fill is mixed rather than
faded, so the lines stay sharp at any opacity — unlike version 1, where turning the fill down also
dimmed the borders you were trying to read.

## Dev-only, by construction

Nothing here reaches a production build. Not because an option is set correctly, but because Astro's
dev toolbar apps do not exist in one — there is no mechanism by which the overlay could get there.

You can check it rather than take our word for it:

```bash
astro build
grep -r "layoutgrid-overlay" dist/
```

No matches.

## Using the overlay directly

The grid itself is a plain class with no framework code in it. If you need one outside the toolbar —
on a deployed staging site, or in a documentation page that demonstrates it — import it from the
`./overlay` subpath and drive it yourself.

```js
import { resolve } from 'astro-layoutgrid';
import { Overlay } from 'astro-layoutgrid/overlay';

const overlay = new Overlay(resolve({ columns: 16 }), document);
overlay.mount();
overlay.show();

overlay.update(resolve({ color: '#0af' })); // change it at runtime
overlay.toggle(false); // or pass no argument to invert
overlay.destroy(); // final; build a new one to start again
```

This is deliberately the long way round. The integration is the supported path, and anything you
import here **will** be in your production bundle. `resolve` is exported alongside it because it is
the package's validation boundary: it fills defaults, constrains values and never throws, so
anything built from user input should pass through it first.

## Coming from version 1

Version 1 was a component. If you have it:

1. Delete `<Layoutgrid />` from your layouts, and its import.
2. Add `layoutgrid()` to `integrations` in `astro.config`, with the props you were passing.
3. Two renames: `gridColor` is now `color`, `gridOpacity` is now `opacity`.
4. Per-breakpoint values are objects now, not arrays. `gutter={[0.5, 1, 1]}` becomes
   `gutter: { mobile: 0.5, tablet: 1, desktop: 1 }` — the array's positions meant mobile, tablet,
   desktop, which nothing said out loud.

The keyboard shortcut is unchanged.

## TypeScript

Types ship with the package; there is nothing to install. `LayoutgridOptions` is what you write,
`LayoutgridConfig` is what comes out of `resolve` — complete, with no optional properties.

```ts
import type { Breakpoint, LayoutgridConfig, LayoutgridOptions } from 'astro-layoutgrid';
```

## Requirements

Astro 5, 6 or 7. Node 22.12 or newer, which is what Astro 7 asks for.

## Licence

MIT © Sebastian Wolf

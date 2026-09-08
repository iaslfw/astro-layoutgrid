# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-09-08

A rewrite. Version 1 was a component you pasted into every layout; version 2 is an Astro integration
that registers a dev toolbar app. No code is shared between them, and every entry below is a
consequence of that.

### Changed

- **The package is an Astro integration.** It goes in `integrations` in `astro.config` and nowhere
  else — no import in your layouts, no markup, no keyboard shortcut you have to be told about. The
  grid appears as a button in the Astro dev toolbar.
- **`gridColor` is now `color`, `gridOpacity` is now `opacity`.** The prefix said nothing that the
  option name did not already say.
- **Per-breakpoint values are objects, not arrays.** `gutter={[0.5, 1, 1]}` becomes
  `gutter: { mobile: 0.5, tablet: 1, desktop: 1 }`. The array's positions meant mobile, tablet,
  desktop, which nothing said out loud.
- **Values are corrected rather than ignored.** A column count below one becomes one, an opacity of
  `7` becomes `1`, and a desktop breakpoint below the tablet one is lifted to match — a tablet range
  with no width in it is a configuration with no correct behaviour. `NaN` and `Infinity` count as
  missing.

### Added

- **A public runtime API.** The overlay has `mount`, `update`, `show`, `hide`, `toggle(force?)`,
  `visible` and `destroy`. Version 1 had none: the only way to reconfigure it was to detach the
  element from the document and re-attach it so that `connectedCallback` ran again.
- **The `./overlay` subpath**, for embedding the grid outside the toolbar — on a deployed staging
  site, or in a page that demonstrates it. `resolve` is exported alongside it as the validation
  boundary for anything built from user input.
- **A keyboard shortcut that agrees with the button.** <kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> +
  <kbd>G</kbd> presses the same toolbar button rather than reaching past it, so the two cannot
  disagree about whether the grid is on.
- **The visible state survives a reload**, which matters across the dozens of reloads a working
  session actually involves.
- **Tests.** 38 of them, on `node:test` with `linkedom`. They import from `dist/`, not `src/`, so
  they exercise what is actually shipped.

### Removed

- **The `<Layoutgrid />` component.** See [Coming from version 1](./README.md#coming-from-version-1)
  for the three edits that replace it.
- **The `./astro` export subpath.** It pointed at `./src/astro.d.ts` while the file was at
  `src/libs/astro.d.ts`, so it never resolved for anyone. With types resolving from the main entry
  point it has no purpose.

### Fixed

- **The overlay no longer reaches production builds.** Not because an option is set correctly, but
  because dev toolbar apps do not exist in one. In version 1 it shipped to your users unless you
  remembered to disable it in every layout you had pasted it into.
- **The configuration had two sources of truth that disagreed.** Build-time and client-side code each
  described the same object with different defaults — `gutter` was `1` in one and `0.75` in the
  other. It never surfaced because every attribute was always written; the moment one was missing,
  the grid rendered with different spacing than the props asked for. There is now one schema and one
  set of defaults.
- **Filled columns no longer dim their own outlines.** `showBackground` used to lower the opacity of
  the whole column element, fading the very lines you were trying to read. The fill is mixed now, so
  the lines stay sharp at any opacity.
- **Nothing on your page can shift the grid.** It lives in a shadow root and carries `position`,
  `inset`, `pointer-events` and `z-index` inline, where no stylesheet of yours can reach them.
- **`tsc --noEmit` passes.** Version 1's type-check was broken against its own entry point for
  months, because an ambient `declare module '*.astro'` sat in a file that was itself a module.
- **`files` names the licence file that exists.** It said `LICENSE`; the file is `LICENCE`.

### Requirements

Astro 5, 6 or 7, and Node 22.12 or newer — the latter is what Astro 7 asks for.

## [1.2.0] — 2025

Last release of the component. Added TypeScript IntelliSense and per-breakpoint gutter and margin
configuration.

## [1.1.0] — 2025

## [1.0.1] — 2025

## [1.0.0] — 2025

First release.

[2.0.0]: https://github.com/iaslfw/astro-layoutgrid/releases
[1.2.0]: https://www.npmjs.com/package/astro-layoutgrid/v/1.2.0
[1.1.0]: https://www.npmjs.com/package/astro-layoutgrid/v/1.1.0
[1.0.1]: https://www.npmjs.com/package/astro-layoutgrid/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/astro-layoutgrid/v/1.0.0

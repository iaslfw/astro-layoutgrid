# astro-layoutgrid

A column grid you can lay over any page while you build it, to check that things line up.

[![npm](https://img.shields.io/npm/v/astro-layoutgrid?logo=npm&label=npm)](https://www.npmjs.com/package/astro-layoutgrid)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-yellow)](./packages/astro-layoutgrid/LICENCE)
[![Built for Astro](https://img.shields.io/badge/built%20for-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Deployed on Cloudflare Workers](https://img.shields.io/badge/deployed%20on-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://layoutgrid.iaslfw.workers.dev)

Version 2 is **an Astro integration**, not a component. It goes in `astro.config` and nowhere else:
no import in your layouts, no markup, and nothing in your production build.

```js
import { defineConfig } from 'astro/config';
import layoutgrid from 'astro-layoutgrid';

export default defineConfig({
  integrations: [layoutgrid()],
});
```

The grid then appears as a button in the Astro dev toolbar, or on
<kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>.

**→ [Full documentation](./packages/astro-layoutgrid/README.md)** — options, defaults, and migrating
from 1.x.

## Why it is different

- **Zero dependencies.** No `dependencies` field, nothing added to your lockfile, no supply chain to
  inherit.
- **It never reaches your users.** Not because a setting is right, but because dev toolbar apps do
  not exist in a production build. Build your site and search the output — there are no matches.
- **Nothing can shift it.** The grid lives in a shadow root and carries its load-bearing styles
  inline, so no stylesheet on your page can move it.

## This repository

`packages/` holds what you import; `apps/` holds what you run.

| Path                        | Workspace                  | What it is                                                                                                                      |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `packages/astro-layoutgrid` | `astro-layoutgrid`         | The package, and its documentation.                                                                                             |
| `apps/website`              | `astro-layoutgrid-website` | The public site at [layoutgrid.iaslfw.workers.dev](https://layoutgrid.iaslfw.workers.dev). The only workspace that is deployed. |
| `apps/demos/astro`          | `astro-layoutgrid-demo`    | A local demo. Never deployed, allowed to be messy.                                                                              |

There is one website and many demos, so a demo for another framework becomes
`apps/demos/<framework>` and needs no change to the workspace list. Everything under `apps/` reads
the package through a workspace link, so a change to it is visible immediately — no `npm pack`, no
publish.

## Getting started

```bash
npm install      # once, at the root — links every workspace
npm run dev      # the website
npm run dev:demo # the Astro demo, which uses the integration
```

## Commands

All from the repository root.

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run build`        | Builds every workspace that has a `build` script |
| `npm run typecheck`    | Type-checks every workspace                      |
| `npm test`             | Builds, then runs the tests (`node:test`)        |
| `npm run lint`         | oxlint across the whole repository               |
| `npm run format`       | Prettier across the whole repository             |
| `npm run format:check` | Prettier in check mode, for CI                   |
| `npm run ship:website` | Builds the website and deploys it with Wrangler  |

Linting and formatting are configured **once, at the root** — `.oxlintrc.json`, `.prettierrc` and
`.prettierignore`. No workspace has its own tooling config, and there is no ESLint here.

To target one workspace: `npm run <script> --workspace astro-layoutgrid`.

## Releasing

A GitHub release triggers [`publish-npm.yaml`](./.github/workflows/publish-npm.yaml), which builds
and publishes the package. The version lives in `packages/astro-layoutgrid/package.json`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Elsewhere

- **[Substack](https://substack.com/@iaslf)** — longer pieces, less often. The rewrite from component
  to integration is covered there, along with the reasoning behind it.
- **[X](https://x.com/iaslfw)** — shorter things, more often.

## Licence

MIT © [Sebastian Wolf](https://github.com/iaslfw)

# astro-layoutgrid

A responsive grid overlay for Astro, published to npm as
[`astro-layoutgrid`](https://www.npmjs.com/package/astro-layoutgrid). It renders a column overlay on
top of a page so you can check alignment against a design grid, toggled with `Cmd/Ctrl + Shift + G`.

This repository is a monorepo holding the package together with the two projects that consume it.

## Layout

`packages/` holds what you import; `apps/` holds what you run.

| Path                      | Workspace                     | What it is                                                                                                                                        |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/astro-layoutgrid` | `astro-layoutgrid`          | The published package. Its own README is the user-facing documentation.                                                                           |
| `apps/demos/astro`        | `astro-layoutgrid-demo`       | The public demo at [astro-layoutgrid-demo.iaslfw.workers.dev](https://astro-layoutgrid-demo.iaslfw.workers.dev), deployed to Cloudflare Workers.  |
| `apps/playgrounds/astro`  | `astro-layoutgrid-playground` | A bare Astro app for trying things out and for reproduction cases. Never deployed.                                                                |

The extra level under `apps/` is deliberate: a demo or playground for another framework becomes
`apps/demos/<framework>` without renaming anything. The workspace glob is `apps/*/*`. See
`docs/adr/0003-apps-verzeichnis.md`.

**The demo is a website, not a test surface.** `npm run ship:demo` deploys whatever is in the working
tree, so anything you park there to try it out can go public by accident. Experiments, debug pages
and reproduction cases belong in the playground, which is never deployed and is allowed to be messy.
Treat an edit to the demo as an edit to production.

Demo and playground depend on `astro-layoutgrid` as `"*"`, which npm resolves to the local workspace.
**A change under `packages/astro-layoutgrid` is visible in both immediately** — there is no `npm pack`
step and nothing has to be published first. See `docs/adr/0001-monorepo-layout.md`.

## Commands

Run these from the repository root.

```bash
npm install              # links all workspaces; one lockfile lives here
npm run dev              # the demo
npm run dev:playground   # the bare playground
npm run build            # every workspace
npm run typecheck        # every workspace
npm run lint             # every workspace that has a lint script
npm run format           # Prettier across the repository
npm run ship:demo        # builds the demo and deploys it with Wrangler
```

To target one workspace: `npm run <script> --workspace astro-layoutgrid`.

## Before you change anything

Two things will look like your fault and are not:

- **`npm run typecheck` fails.** `index.ts(4,24): error TS2307: Cannot find module
'./src/Layoutgrid.astro'`. This is a pre-existing bug, reproducible at commit `ea0b204` from before
  the monorepo existed. It blocks the next release, because CI runs `typecheck` on release. See
  BL-01 in the backlog. Do not paper over it with `skipLibCheck` or a `@ts-ignore`.
- **`npm run lint` does not cover the demo or the playground.** Neither has a `lint` script, and the
  demo's `eslint.config.js` would crash if it were ever run. See BL-17.

Also worth knowing before you trust a green build: because demo and playground read the package
through a workspace symlink, they never exercise `files` or `exports` from `package.json`. A build
that passes here says nothing about whether the published tarball works. See BL-16.

## Open work

Findings from the code review and project scan live in **[`docs/BACKLOG.md`](./docs/BACKLOG.md)**,
numbered `BL-01` and up and ordered by priority. Start there rather than re-deriving problems from
the source. When you finish an item, set its `Status` to `done` in the same change that fixes it.

Direction decisions that are settled — and one that deliberately is not — are recorded in
[`docs/adr/`](./docs/adr/).

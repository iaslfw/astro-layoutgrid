# astro-layoutgrid

A responsive grid overlay for Astro, published to npm as
[`astro-layoutgrid`](https://www.npmjs.com/package/astro-layoutgrid). It renders a column overlay on
top of a page so you can check alignment against a design grid, toggled with `Cmd/Ctrl + Shift + G`.

This repository is a monorepo holding the package together with the two projects that consume it.

## Layout

`packages/` holds what you import; `apps/` holds what you run.

| Path                                    | Workspace                      | What it is                                                                                                                                       |
| --------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/astro-layoutgrid`             | `astro-layoutgrid`             | The published package, version 1.x. In maintenance only — see below.                                                                             |
| `packages/astro-layoutgrid-integration` | `astro-layoutgrid-integration` | The rewrite in progress: an Astro integration with a Dev Toolbar app. Private, not published.                                                    |
| `apps/demos/astro`                      | `astro-layoutgrid-demo`        | The public demo at [astro-layoutgrid-demo.iaslfw.workers.dev](https://astro-layoutgrid-demo.iaslfw.workers.dev), deployed to Cloudflare Workers. |
| `apps/playgrounds/astro`                | `astro-layoutgrid-playground`  | A bare Astro app for trying things out and for reproduction cases. Never deployed.                                                               |

The extra level under `apps/` is deliberate: a demo or playground for another framework becomes
`apps/demos/<framework>` without renaming anything. The workspace glob is `apps/*/*`. See
`docs/adr/0003-apps-verzeichnis.md`.

## The rewrite

`packages/astro-layoutgrid-integration` is a **greenfield rewrite**, not a refactor. When working on
it, assume the existing component does not exist. The open findings in `packages/astro-layoutgrid` —
the duplicated configuration source (BL-03), the missing runtime API (BL-04) — are **not
prerequisites**: the new code is meant not to have those defects rather than to inherit repaired
versions of them. Do not start there and migrate across; that inverts the agreed order. The old
package, the demo and the rest get cleaned up **afterwards**.

The integration is **dev-only by construction**. A `mode: 'always'` option that would have injected
the overlay into production builds was considered and rejected, because it turns the dev-only
guarantee into a setting someone can get wrong. Dev Toolbar apps do not exist in production builds,
so there is no mechanism by which the overlay could reach a user's bundle. The check is a build
followed by a grep for the overlay in the emitted HTML: it must find nothing.

The package contains **no `.astro` file** and must not gain one — that is what keeps it clear of
BL-01. See `docs/adr/0005-integration-neubau-dev-only.md` for the direction and `docs/NEUBAU.md`
for the plan — both in the local, uncommitted `docs/` directory described under **Open work**. Start
there rather than re-deriving the design.

It is the only workspace with tests (`node:test` plus `linkedom`, 27 of them). They import from
`dist/`, not `src/`, so that they exercise the emitted output — a package that typechecks but emits
something unusable is the failure this repository has shipped twice. Keep new tests on `dist/` for
the same reason, and run `npm test` from the root.

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
npm run test             # builds, then runs node:test in every workspace that has tests
npm run lint             # oxlint across the whole repository
npm run lint:fix         # oxlint --fix
npm run format           # Prettier across the repository
npm run format:check     # Prettier in check mode, for CI
npm run ship:demo        # builds the demo and deploys it with Wrangler
```

Linting and formatting are configured **once, at the root** — `.oxlintrc.json`, `.prettierrc` and
`.prettierignore`. No workspace has its own tooling config or its own `lint`/`format` script, and
there is no ESLint in this repository. Do not reintroduce per-workspace configs; see
`docs/adr/0004-tooling.md`.

To target one workspace: `npm run <script> --workspace astro-layoutgrid`.

## Before you change anything

Three things will look like your fault and are not:

- **`npm run typecheck` fails.** `index.ts(4,24): error TS2307: Cannot find module
'./src/Layoutgrid.astro'`. This is a pre-existing bug, reproducible at commit `ea0b204` from before
  the monorepo existed. It blocks the next release, because CI runs `typecheck` on release. See
  BL-01 in the backlog. Do not paper over it with `skipLibCheck` or a `@ts-ignore`.
- **`npm run lint` reports three `no-console` warnings** in the demo's `Popup.astro` and
  `Label.astro`, and still exits 0. That is deliberate: those three are BL-22 and should stay visible
  without failing the lint gate. Do not silence them with an inline disable comment — fix them as
  part of BL-22 or leave them alone.
- **The demo builds but does not run.** Since the update to Astro 7 and `@astrojs/cloudflare` 14 it
  answers every request with `[object Object]` instead of HTML, under both `astro preview` and
  `wrangler dev`, while `astro build` exits 0. **Do not run `npm run ship:demo`** until this is
  fixed — it would publish a broken demo. See BL-29. The playground renders correctly, so the package
  itself is fine under Astro 7.

Also worth knowing before you trust a green build: because demo and playground read the package
through a workspace symlink, they never exercise `files` or `exports` from `package.json`. A build
that passes here says nothing about whether the published tarball works. See BL-16.

## Open work

`docs/` is a **local working directory and is deliberately not checked in** — it is listed in
`.gitignore`. It holds the backlog, the architecture decision records and the plan for the rewrite:
notes for whoever is working on this repository, not documentation for its users. That is why
nothing below is a link: after a fresh clone these files do not exist, and a link would only
promise otherwise.

If `docs/` is missing, you are in a clone rather than the working copy, and the references in this
file point at nothing. Say so rather than guessing at their contents, and do not recreate them from
memory — reconstructed decision records are worse than absent ones, because they read as though
someone decided.

Where it is present, it contains:

- `docs/BACKLOG.md` — every known defect and improvement, numbered `BL-01` and up, ordered by
  priority. Start there rather than re-deriving problems from the source. When you finish an item,
  set its `Status` to `done` in the same change that fixes it.
- `docs/NEUBAU.md` — the plan for the rewrite: what is finished, which design questions are already
  answered, and what comes next.
- `docs/adr/` — direction decisions that are settled, and one that deliberately is not.

Because the backlog is not in the repository, `BL-` numbers appearing in commit messages cannot be
looked up from a clone. That is accepted: the commit messages here carry their own reasoning and do
not depend on the backlog to be understood.

# astro-layoutgrid

A responsive grid overlay for Astro, published to npm as
[`astro-layoutgrid`](https://www.npmjs.com/package/astro-layoutgrid). It renders a column overlay on
top of a page so you can check alignment against a design grid, toggled with `Cmd/Ctrl + Shift + G`.

This repository is a monorepo holding the package together with the two projects that consume it.

## Layout

`packages/` holds what you import; `apps/` holds what you run.

| Path                        | Workspace               | What it is                                                                                                                   |
| --------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `packages/astro-layoutgrid` | `astro-layoutgrid`      | The package: an Astro integration with a Dev Toolbar app, version 2. Still `private`, so it cannot be published by accident. |
| `apps/demos/astro`          | `astro-layoutgrid-demo` | A local demo. Never deployed, allowed to be messy. `react/`, `svelte/` and `vue/` are empty placeholders.                    |

**`apps/website` does not exist yet.** It is being set up from scratch and will be the project's
entry point and the only workspace that is deployed. Until it is there, nothing in this repository is
deployed at all. Add it back to `workspaces` in the root `package.json` when it appears — the list is
written out rather than globbed, because there is one website and many demos. A demo for another
framework becomes `apps/demos/<framework>` and needs no change. See
`docs/adr/0006-website-und-lokale-demos.md`.

## The rewrite

`packages/astro-layoutgrid` is a **greenfield rewrite** of what used to live there, not a refactor
of it. The 1.x component has been deleted; version 2 shares no code with it. Everything in the
backlog numbered BL-01 through BL-14 describes that deleted code and is therefore moot — those
entries should be closed as `wontfix` rather than worked on. Do not reconstruct the old component
from the published 1.2.0 tarball to fix them.

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

**Demos are local and never deployed.** Experiments, debug pages and reproduction cases belong in one
of them; they are allowed to be messy. Deployment is the website's job alone, and the website does
not exist yet — so at the moment nothing here reaches the public.

The demo depends on `astro-layoutgrid` as `"*"`, which npm resolves to the local workspace.
**A change under `packages/astro-layoutgrid` is visible in both immediately** — there is no `npm pack`
step and nothing has to be published first. See `docs/adr/0001-monorepo-layout.md`.

## Commands

Run these from the repository root.

```bash
npm install              # links all workspaces; one lockfile lives here
npm run dev              # the Astro demo
npm run build            # every workspace
npm run typecheck        # every workspace
npm run test             # builds, then runs node:test in every workspace that has tests
npm run lint             # oxlint across the whole repository
npm run lint:fix         # oxlint --fix
npm run format           # Prettier across the repository
npm run format:check     # Prettier in check mode, for CI
```

Linting and formatting are configured **once, at the root** — `.oxlintrc.json`, `.prettierrc` and
`.prettierignore`. No workspace has its own tooling config or its own `lint`/`format` script, and
there is no ESLint in this repository. Do not reintroduce per-workspace configs; see
`docs/adr/0004-tooling.md`.

To target one workspace: `npm run <script> --workspace astro-layoutgrid`.

`ci.yaml` runs those five checks on every push and pull request, and the deploy and publish workflows
reuse it through `workflow_call` rather than repeating the steps. If you add a check, add it there
and all three get it. `ci.yaml` deliberately skips pushes to `main`, because the deploy workflow
calls it for those and would otherwise run it twice.

When you need a dev server, start it detached — `astro dev --background` — and manage it with
`astro dev stop`, `astro dev status` and `astro dev logs`. A foreground server blocks the shell
and tends to be left running.

## Before you change anything

Four things will look like your fault and are not:

- **`npm run typecheck` fails.** `index.ts(4,24): error TS2307: Cannot find module
'./src/Layoutgrid.astro'`. This is a pre-existing bug, reproducible at commit `ea0b204` from before
  the monorepo existed. It blocks the next release, because CI runs `typecheck` on release. See
  BL-01 in the backlog. Do not paper over it with `skipLibCheck` or a `@ts-ignore`.
- **`npm run lint` reports three `no-console` warnings** in the demo's `Popup.astro` and
  `Label.astro`, and still exits 0. That is deliberate: those three are BL-22 and should stay visible
  without failing the lint gate. Do not silence them with an inline disable comment — fix them as
  part of BL-22 or leave them alone.
- **`@astrojs/cloudflare` 14 is broken here.** Anything using it answers every request with
  `[object Object]` instead of HTML, under both `astro preview` and `wrangler dev`, while
  `astro build` exits 0. This was reproduced on a nearly empty page, so the fault is the adapter's,
  not the content's and not the package's. It will resurface the moment the website adds the adapter.
  See BL-29.

- **Your editor shows the package as one big error.** TypeScript 7 is the native port and ships no
  `tsserver` — `node_modules/typescript/lib/` contains `tsc.js` and nothing else. An editor set to
  "use workspace version" finds no language server and gives up, so everything goes red while `tsc`
  itself reports no errors at all. Fix it on the editor side: install the TypeScript (Native Preview)
  extension, or point the editor at its own bundled TypeScript. **Do not downgrade the package.**
  Staying on the newest TypeScript is a deliberate decision; the cost is that `@astrojs/check` also
  refuses to run (it wants `^5 || ^6`), which is accepted.

Also worth knowing before you trust a green build: because the demo reads the package through a
workspace symlink, it never exercises `files` or `exports` from `package.json`. A build that passes
here says nothing about whether the published tarball works. See BL-16.

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

# Contributing

Thanks for looking. This is a small project with a small surface, so this document is short on
process and long on the two or three things that are easy to get wrong here.

## Getting set up

You need **Node 22.12 or newer** — that is what Astro 7 asks for — and npm 10 or newer.

```bash
git clone https://github.com/iaslfw/astro-layoutgrid.git
cd astro-layoutgrid
npm install          # once, at the root; this links every workspace
npm run dev:demo     # the Astro demo, which uses the integration
```

`npm run dev:demo` is the one to start with: it runs a real Astro app with the integration
registered, so the toolbar button is there and you are looking at the thing you are changing.
`npm run dev` runs the public website instead, which draws its grid through the overlay class rather
than the integration.

## How the repository is laid out

`packages/` holds what you import; `apps/` holds what you run.

| Path                        | What it is                                            |
| --------------------------- | ----------------------------------------------------- |
| `packages/astro-layoutgrid` | The package. Five modules, no dependencies.           |
| `apps/website`              | The public site. The only workspace that is deployed. |
| `apps/demos/astro`          | A local demo. Never deployed, allowed to be messy.    |

Everything under `apps/` reads the package through a workspace link, so a change to
`packages/astro-layoutgrid` is visible in them immediately. There is no `npm pack` step and nothing
has to be published first.

That convenience has a sharp edge, and it is the single most useful thing to know about this
repository: **a linked consumer never goes through `files` or `exports`.** It reads the source folder
directly. So a green build here is compatible with a completely broken tarball, and that is exactly
how two broken paths reached a published release. If you touch `package.json`, the build output, or
anything either of those fields names, say so in the pull request.

## Before you open a pull request

```bash
npm run lint
npm run format
npm run typecheck
npm test
npm run build
```

All five must pass. CI runs the same set.

## Conventions

**One config per tool, at the root.** `.oxlintrc.json`, `.prettierrc` and `.prettierignore` live in
the repository root and nowhere else. Please do not add per-workspace lint or format configs; that
is what the last cleanup removed. There is no ESLint here.

**No explanatory comments in the code.** Reasoning belongs in the commit message or the pull request,
not between the lines. Doc comments on a public API are welcome; a paragraph explaining what the next
five lines do is not.

**Defaults live in exactly one place.** `DEFAULTS` in `schema.ts`, and nothing else may hold a
fallback. A second `?? 1` somewhere is a second default, and two defaults drift apart — the previous
version had exactly that bug, disagreeing with itself about gutter spacing.

**Everything from outside goes through `resolve`.** It is the validation boundary: it checks types as
well as ranges, corrects rather than throws, and never blows up. If you add a source of input,
route it through there instead of validating in place.

**Relative imports need their `.js` extension.** The package builds with `moduleResolution: nodenext`
so that the compiler enforces this. It looks wrong next to a `.ts` file and is correct: the path
describes the emitted output, which is what Node resolves at runtime.

**The package must not gain a dependency** without a good reason and a note in the pull request.
"Zero dependencies" is on the box.

**The package must not gain a `.astro` file.** TypeScript cannot resolve them, and the previous
version's type-check was broken for exactly that reason for months.

## Tests

Tests are `node:test` with `linkedom`, under `packages/astro-layoutgrid/test/`. They import from
**`dist/`, not `src/`**, so they exercise the emitted output. Please keep new tests on `dist/` for
the same reason — three of the bugs found during the rewrite were in the gap between what compiled
and what shipped.

`npm test` builds first, so you never test a stale `dist/`.

## Commit messages

A subject line in the imperative, then a body that explains **why**, not what — the diff already
says what. If a change fixes something subtle, describe the failure so the next person recognises it.
Long bodies are fine and welcome.

## Reporting a bug

Please include the Astro version, the Node version, your `layoutgrid()` options, and whether it
happens in `astro dev`, `astro build` or both. That last one narrows things down faster than anything
else: the integration only exists in development, so a problem that survives a build is a different
problem entirely.

A minimal reproduction beats a description. If you can trigger it on a page with nothing on it, say
so — that is usually the whole diagnosis.

## Code of conduct

Be decent. Assume the other person is trying to help.

## Licence

By contributing you agree that your contributions are licensed under the MIT licence.

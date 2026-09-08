# astro-layoutgrid — Monorepo

Dieses Repository enthält das npm-Package `astro-layoutgrid` sowie die Projekte, mit denen es entwickelt und vorgeführt wird.

[![NPM Version](https://img.shields.io/npm/v/astro-layoutgrid)](https://www.npmjs.com/package/astro-layoutgrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Built%20for-Astro-orange)](https://astro.build)

## Struktur

| Ordner                      | Workspace               | Zweck                                                                                                                                                                      |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/astro-layoutgrid` | `astro-layoutgrid`      | Das Package: eine Astro-Integration mit Dev-Toolbar-App, Version 2. **Die Dokumentation liegt in [dessen README](./packages/astro-layoutgrid/README.md).** Noch `private`. |
| `apps/demos/astro`          | `astro-layoutgrid-demo` | Eine lokale Demo. Wird nie deployt und darf unaufgeräumt sein. `react/`, `svelte/` und `vue/` sind leere Platzhalter.                                                      |

Demo und Playground binden das Package über den npm-Workspace ein. Eine Änderung unter
`packages/astro-layoutgrid` ist dort also sofort sichtbar — ohne `npm pack` und ohne Veröffentlichung.

Unter `apps/` liegt, was man startet; unter `packages/`, was man importiert. Es gibt **eine** Website
und **viele** Demos — eine Demo für ein weiteres Framework wird zu `apps/demos/<framework>`.
`apps/website` wird gerade neu aufgesetzt und fehlt daher noch; bis dahin wird nichts deployt. Siehe
[`docs/adr/0006-website-und-lokale-demos.md`](./docs/adr/0006-website-und-lokale-demos.md).

## Einstieg

```bash
npm install          # einmalig, im Repo-Root - verlinkt alle Workspaces
npm run dev          # startet die Demo
```

## Nützliche Befehle

Alle im Repo-Root auszuführen:

| Befehl                 | Wirkung                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run build`        | Baut alle Workspaces, die ein `build`-Script haben |
| `npm run typecheck`    | Typprüfung über alle Workspaces                    |
| `npm test`             | Baut und führt die Tests aus (`node:test`)         |
| `npm run lint`         | oxlint über das gesamte Repository                 |
| `npm run lint:fix`     | oxlint mit `--fix`                                 |
| `npm run format`       | Prettier über das gesamte Repository               |
| `npm run format:check` | Prettier im Prüfmodus, für CI                      |
| `npm run ship:demo`    | Baut die Demo und deployt sie via Wrangler         |

Linting und Formatierung sind **einmal im Root** konfiguriert — `.oxlintrc.json`, `.prettierrc` und
`.prettierignore`. Kein Workspace hat eigene Tooling-Configs, und ESLint gibt es hier nicht mehr.

Einen einzelnen Workspace ansprechen:

```bash
npm run <script> --workspace astro-layoutgrid
```

## Veröffentlichen

Das Package wird von GitHub Actions veröffentlicht, sobald ein Release erstellt wird — siehe [`.github/workflows/publish-npm.yaml`](./.github/workflows/publish-npm.yaml). Die Versionsnummer wird in `packages/astro-layoutgrid/package.json` gepflegt, die Änderungen in [`CHANGELOG.md`](./packages/astro-layoutgrid/CHANGELOG.md).

## Mitmachen

Siehe [CONTRIBUTING.md](./CONTRIBUTING.md).

Gut. Nun sind die Docs an der Reihe. Lass uns nun diese Überarbeiten. Das Root-Readme soll ein kleiner Einstiegspunkt werden. Dieser soll eine Übersicht, sowie die richtigen Badges anzeigen. Ebenfalls auf die eigentlichen Docs (Im package) verlinken und auf meinen Blog, Substack für weitere Infos
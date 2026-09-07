# astro-layoutgrid — Monorepo

Dieses Repository enthält das npm-Package `astro-layoutgrid` sowie die Projekte, mit denen es entwickelt und vorgeführt wird.

[![NPM Version](https://img.shields.io/npm/v/astro-layoutgrid)](https://www.npmjs.com/package/astro-layoutgrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Built%20for-Astro-orange)](https://astro.build)

## Struktur

| Ordner                                  | Workspace                      | Zweck                                                                                                                                                                                            |
| --------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/astro-layoutgrid`             | `astro-layoutgrid`             | Das veröffentlichte Package, Version 1.x. **Die Dokumentation liegt in [dessen README](./packages/astro-layoutgrid/README.md).**                                                                 |
| `packages/astro-layoutgrid-integration` | `astro-layoutgrid-integration` | Der Neubau: eine Astro-Integration mit Dev-Toolbar-App. Dev-only, privat, noch nicht veröffentlicht.                                                                                             |
| `apps/demos/astro`                      | `astro-layoutgrid-demo`        | Die öffentliche Demo unter [astro-layoutgrid-demo.iaslfw.workers.dev](https://astro-layoutgrid-demo.iaslfw.workers.dev), deployt auf Cloudflare Workers. Sie ist eine Website, keine Testfläche. |
| `apps/playgrounds/astro`                | `astro-layoutgrid-playground`  | Eine nackte Astro-Instanz zum Ausprobieren und für Repro-Cases. Wird nie deployt und darf unaufgeräumt sein.                                                                                     |

Demo und Playground binden das Package über den npm-Workspace ein. Eine Änderung unter
`packages/astro-layoutgrid` ist dort also sofort sichtbar — ohne `npm pack` und ohne Veröffentlichung.

Unter `apps/` liegt, was man startet; unter `packages/`, was man importiert. Die zusätzliche Ebene
(`demos/astro`, `playgrounds/astro`) hält Platz für Varianten anderer Frameworks, ohne dass dafür
später umbenannt werden muss.

## Einstieg

```bash
npm install          # einmalig, im Repo-Root - verlinkt alle Workspaces
npm run dev          # startet die Demo
npm run dev:playground
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

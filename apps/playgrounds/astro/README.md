# astro-layoutgrid — Playground (Astro)

Nackte Astro-Instanz zum Ausprobieren des Overlays und zum Festhalten von Repro-Cases.

Bewusst minimal: `defineConfig({})` ohne Adapter, kein CSS-Framework, eine Seite. Genau deshalb ist
sie brauchbar — bei einem Package, dessen gesamter Output ein visuelles Overlay ist, muss man
ausschliessen koennen, dass fremdes CSS, ein `transform`-Container oder ein Stacking Context aus dem
Layout mitredet. Zusaetzlich deckt der Playground den statischen Astro-Build ab, waehrend die Demo
ausschliesslich SSR faehrt.

```bash
npm run dev:playground   # aus dem Repo-Root
```

Das Overlay wird mit `Cmd/Ctrl + Shift + G` umgeschaltet. Die einzige `<Layoutgrid />`-Instanz steht
in `src/layouts/Layout.astro` — Props dort anpassen.

Dieser Playground wird **nie deployt** und darf unaufgeraeumt bleiben. Debug-Seiten und Repro-Cases
gehoeren hierher und sollen committet werden, damit sie wiederauffindbar sind — nicht in die Demo,
die eine oeffentliche Website ist.

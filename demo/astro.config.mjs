// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss()],
  },

  integrations: [],
  adapter: netlify(),
  output: "static",
});

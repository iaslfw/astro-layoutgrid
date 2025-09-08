import eslintPluginAstro from "eslint-plugin-astro";
export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "astro/no-set-html-directive": "error",
    },
  },
];

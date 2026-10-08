import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import typescript from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      ".astro/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  eslint.configs.recommended,
  ...typescript.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["*.{js,mjs,ts}", "scripts/**/*.{js,mjs,ts}", "e2e/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["public/**/*.js", "src/**/*.{js,ts,astro}"],
    languageOptions: { globals: { ...globals.browser } },
  },
]);

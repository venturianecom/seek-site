# Seek website

Static English product website for Seek, published with GitHub Pages at
`https://seek.venturiane.com`.

## Local development

Use Node.js 24, then run:

```sh
npm install
npm run dev
```

Validate a production build with:

```sh
npm run validate
```

The validation gate checks Prettier formatting, ESLint, Astro and TypeScript,
the production build, generated HTML, internal links, unit tests, responsive
browser behavior, and WCAG accessibility rules. Playwright requires Chromium:

```sh
npx playwright install chromium
```

## Structure

- `src/layouts/BaseLayout.astro` is the composition layer for metadata,
  navigation, product state, and the shared footer.
- `src/components/` contains presentational components that receive their state
  through props.
- `src/config/product.ts` is the single source for release availability.
- `src/content/releases/` contains Markdown release notes.
- `src/pages/` contains route-level content.
- `public/` contains static assets, CSS, and browser behavior.
- `e2e/` and colocated `*.test.ts` files cover browser and unit behavior.

## Downloads

Download availability is controlled in `src/config/product.ts`. Keep
`downloadUrl` and `latestVersion` set to `null` before the first public release.
When a signed and notarized build is ready, set both fields and validate the
site before publishing.

## Release notes

Release notes are Markdown files in `src/content/releases/`. Copy
`_template.md`, rename it to the release version, complete its frontmatter and
content, then set `draft: false`. Astro validates every published entry and
creates its detail page during the static build.

## Deployment

Changes pushed to `master` are validated, built, and deployed by the GitHub
Pages workflow.

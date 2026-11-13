## Why

62 shadcn components (plus 2 hooks and a highlighter lib) are now installed in `packages/ui/src/shadcn/`. Nobody has checked that they reach consumers intact: the last build only compiled `button` and `utils`, and nothing proves that every public path resolves with types once installed from npm. The playground has one Button story and no documentation or tests. Before the first real release, consumers need a verified package and a documentation site where they can learn and try every component, in English and Spanish.

## What Changes

- **Verified package output** for `@aureus-core/ui`. A new `check:package` step runs after every build and in CI. It fails if any installed shadcn component or hook is missing its compiled module or type declarations, if an internal `@/` alias leaks into `dist/`, if `publint` or `@arethetypeswrong/cli` (ESM-only profile) report problems, or if the packed tarball contains sources, tests or stories.
- **Dependency hygiene.** `date-fns` and `@tanstack/react-table` are imported by no package file, so they move from the package's `dependencies` to the playground's `devDependencies`, where only stories use them. **BREAKING** (minor, pre-1.0): consumers who relied on these packages arriving transitively must add them themselves. TypeScript goes to `^7.1`.
- **Consumer documentation.** README and a Storybook "Getting started" guide cover requirements, CSS setup, the import-path table, required providers (`TooltipProvider`, `SidebarProvider`, `DirectionProvider`), dark mode, RTL and theming.
- **Full Storybook coverage.** Every installed shadcn component gets stories and docs, grouped by category: Actions, Forms, Overlays, Navigation, Data display, Feedback, Layout, AI/Chat. Each one has:
  - a Playground with a control for every prop, plus variant, size and state stories and real-world compositions;
  - interaction tests for every interactive component;
  - a docs page with summary, usage guidance, import snippet, anatomy, API table, keyboard and ARIA notes, theming notes and upstream links.
- **Bilingual docs (EN/ES).** A locale switcher in the toolbar changes all documentation prose without a reload. Guides and Foundations pages cover colors, radius and typography tokens.
- **Toolbars** for light/dark theme, LTR/RTL direction and mobile viewports.
- **Stories as tests.** Every story runs as an automated test in a real browser (render + play + accessibility) during `pnpm test` and in CI. A coverage test fails when an installed component has no stories or docs, or when a translation is missing.
- **Published docs site.** Storybook is deployed to GitHub Pages on every push to `main`.
- A `minor` changeset for `@aureus-core/ui`.

Non-goals: no new custom components in `src/components/`. No edits to CLI-owned files. No visual-regression (screenshot) testing. Storybook sidebar names and demo copy inside components stay in English; only documentation prose is bilingual.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui-package`: adds a verified-output requirement (per-component artifacts, no leaked aliases, packaging lint, type-resolution check, tarball contents). Adds a requirement that every runtime dependency is used by the package and documented for consumers, including providers.
- `component-playground`: adds requirements for full component coverage, bilingual docs with a live locale switcher, a documented API and accessibility section per component, theme/direction/viewport toolbars, stories executed as interaction and accessibility tests, and a published documentation site.
- `monorepo-tooling`: the "Pull request checks" requirement now also includes the package-output check and the browser-based story tests.

## Impact

- **Code**: `packages/ui/package.json`, `packages/ui/scripts/check-package.mjs` (new), `apps/storybook/**` (config, i18n and docs infrastructure, ~62 story + docs pairs, guides, fixtures, public assets, `vitest.config.ts`), `turbo.json`, `.github/workflows/ci.yml`, `.github/workflows/storybook-pages.yml` (new), `README.md`, `CONTRIBUTING.md`, `.changeset/*`.
- **Dependencies**:
  - ui (dev): `publint`, `@arethetypeswrong/cli`, `typescript@^7.1`.
  - storybook (dev): `@storybook/addon-themes`, `@storybook/addon-vitest`, `vitest`, `@vitest/browser-playwright`, `playwright`, `date-fns`, `@tanstack/react-table`.
- **CI**: installs Chromium for browser tests, so runs get longer. A new Pages workflow is added, and the repository must have Pages set to "GitHub Actions" as its source.
- **Consumers**: every installed shadcn component becomes importable from the published package. `date-fns` and `@tanstack/react-table` no longer arrive transitively.

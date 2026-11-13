## Context

The current state relevant to the approach (motivation: see proposal.md - Why):

- **Package build.** `packages/ui` builds with tsdown in unbundled mode (`src/**/*.{ts,tsx}` → `dist/`, one file per source). Public exports are wildcards: `./shadcn/*` → `dist/shadcn/ui/*`, `./hooks/*` → `dist/shadcn/hooks/*`, plus `./lib/utils` and `./styles.css`. The last recorded build only had `button.tsx` and `lib/utils.ts`.
- **Installed shadcn layer.** 62 components (radix-nova style) import:
  - `cn` (a package) and `radix-ui`, `@base-ui/react`, `@shadcn/react/*`;
  - feature libraries: recharts, shiki, cmdk, vaul, embla, input-otp, react-day-picker, react-resizable-panels;
  - each other, through the `@/shadcn/...` alias.

  `lib/highlighter.tsx` loads `shiki/langs/*` with dynamic imports. Three components carry context providers that consumers must mount: `TooltipProvider`, `SidebarProvider` and `DirectionProvider`.
- **Unused runtime dependencies.** No package file imports `date-fns` or `@tanstack/react-table`.
- **Playground.** `apps/storybook` is Storybook 10 (react-vite) with `addon-docs` and `addon-a11y` (`a11y.test: "error"`). It consumes the package only through public paths (an existing requirement), so stories import the built `dist/`, not source.
- **Conventions.** Pure kebab-case names with `-` role suffixes; nothing under `src/shadcn/**` may be edited.

## Goals / Non-Goals

**Goals:**
- Make "every installed component is consumable" a check that fails the build pipeline, not a manual test.
- One repeatable story/docs contract that 62 components follow, enforced by tests rather than review.
- Bilingual docs that switch live, without duplicating stories.

**Non-Goals:**
- Auto-generating prop documentation from TypeScript.
- Localizing the Storybook manager UI, the sidebar story names, or demo text rendered inside components.
- Visual regression snapshots, and cross-browser runs beyond Chromium.

## Decisions

### D1. Package check as a Node script over the build output
`packages/ui/scripts/check-package.mjs` runs as `check:package`. Turbo models it as a task with `dependsOn: ["build"]`, and CI runs it after `pnpm build`. The script:
1. Lists `src/shadcn/ui/*.tsx` and `src/shadcn/hooks/*.ts` and asserts that each has a `.js` and a `.d.ts` under `dist/`.
2. Greps `dist/**/*.{js,d.ts}` for `from "@/` and `import("@/`.
3. Runs `publint --strict`.
4. Runs `attw --pack . --profile esm-only` with an explicit `--entrypoints` list built from step 1 (`./shadcn/<name>`, `./hooks/<name>`, `./lib/utils`), because attw cannot expand wildcard exports by itself.
5. Runs `pnpm pack --dry-run --json` and rejects any `src/`, `*-tests.*` or `*-stories.*` entry.

Each failure prints the offending component or file.
- *Alternative:* a Vitest test in `packages/ui`. Rejected: Turbo's `test` runs only after the dependencies' builds (`^build`), not after the package's own build, so the test could see a stale `dist/`.
- *If tsdown leaves `@/` unresolved:* fix it in `tsdown.config.ts` (tsconfig `paths` resolution or an explicit alias), never in `src/shadcn/`.

### D2. Story layout: one folder per component, grouped by category
`apps/storybook/src/stories/shadcn/<category>/<name>/` holds `<name>-stories.tsx` and `<name>-docs.ts`. Story titles follow `shadcn/<Category>/<Name>`, and `storySort` orders the categories:
`Guides → Foundations → shadcn (Actions, Forms, Overlays, Navigation, Data display, Feedback, Layout, AI/Chat) → components`.

The folder, not just the file, is per component because each component needs two files. The existing `src/stories/shadcn/button-stories.tsx` is replaced by `actions/button/`. The `stories` glob is already recursive.

### D3. Docs content as typed bilingual data, rendered by one custom docs page
`<name>-docs.ts` exports `defineComponentDocs({ importPath, exports, providers?, primitive?, en: ComponentDocsContent, es: ComponentDocsContent })`.

`ComponentDocsContent` holds:
- `summary`, `whenToUse[]`, `whenNotToUse[]`;
- `anatomy`: map of sub-component to description;
- `api`: map of sub-component to a map of prop to `{ type, default?, description }`;
- `stories`: map of story export name to description;
- `keyboard`: key and action pairs;
- `aria`, `theming`, `links`.

The type is `Record<Locale, ComponentDocsContent>`, and a mapped type keyed on the English entry's keys forces the Spanish entry to have the same keys. A runtime check covers what types cannot, such as empty strings.

Stories attach the content with `parameters: { aureusDocs: docs }`. `.storybook/docs/component-docs-page.tsx`, set as the global `parameters.docs.page`, renders these sections in order:
1. Title and Summary;
2. Import snippet (Storybook `Source` block with copy);
3. Providers callout;
4. Anatomy;
5. `<Primary/>` and `<Controls/>`;
6. Localized API table;
7. Examples: each story through `<Canvas of>` with its localized description;
8. Accessibility (keyboard table and ARIA notes);
9. Theming;
10. Links.

Missing content falls back to the standard autodocs blocks, so a story without docs still renders.
- *Why a custom API table instead of argTypes descriptions:* the stories import compiled `dist/`, so react-docgen extracts no prop descriptions. Upstream shadcn has no JSDoc. And `argTypes` are read once into the story store, so they cannot change with the locale. `<Controls>` stays as the interactive tool, with categories but without long descriptions.
- *Alternative:* MDX per component and locale. Rejected: it doubles the number of files, and nothing type-checks that the two locales match.

### D4. Live locale switching
- `preview.tsx` declares `globalTypes.locale` (toolbar, items `en` and `es`, default `en`).
- `use-locale.ts` reads the current globals from the docs context on mount, then subscribes to the preview channel's `GLOBALS_UPDATED` event (`addons.getChannel()` from `storybook/preview-api`) and re-renders on change. Storybook already keeps globals in the URL, so a shared link keeps its locale.
- `<Localized en es>` is the MDX helper for guides and foundations. `ui-strings.ts` holds the fixed headings of the docs page.
- *Fallback, if the docs renderer does not receive channel events in this Storybook version:* store the locale in `localStorage` and reload the docs iframe when the global changes. This is decided in task 3.3; the spec only requires "no full page reload" of the manager, which the iframe reload preserves.
- *Measured in task 3.3 (Storybook 10.6.7):* live switching works on MDX pages and story canvases, with no reload. On component docs pages (autodocs), Storybook itself remounts the preview iframe on any global change: theme, direction, locale, with or without the custom page. The page then renders the new locale from the story store, the manager never reloads, and the spec holds. No `localStorage` fallback is needed.

### D5. Toolbars mirror consumer mechanisms
- **Theme:** `withThemeByClassName({ themes: { light: "", dark: "dark" }, parentSelector: "html" })` from `@storybook/addon-themes`, the same `.dark` class consumers use.
- **Direction:** a global `direction` toolbar plus a decorator that sets `document.documentElement.dir` and wraps the story in the package's `DirectionProvider`.
- **Providers:** a global decorator wraps every story in `TooltipProvider`. `SidebarProvider` stays inside the Sidebar stories, as it would in an app.
- **Viewports:** the default Storybook viewports, with a `mobile1` story for Sidebar, Drawer and Sheet.

### D6. Stories are the test suite
`apps/storybook/vitest.config.ts` defines two projects:
- `storybook`: `storybookTest({ configDir: ".storybook" })` with browser mode (`@vitest/browser-playwright`, Chromium, headless). Every story becomes a test, and the existing `a11y.test: "error"` turns axe violations into failures.
- `unit` (node): `src/coverage-tests.ts` checks that every `packages/ui/src/shadcn/ui/*.tsx` basename has a story folder containing both files. It then imports every `-docs.ts` and asserts that both locales are non-empty and have the same keys. Each failure names the component and the entry.

Interaction scripts use `storybook/test` (`userEvent`, `expect`, `fn`, `within`). Overlays query `within(document.body)` because they render into portals. Each interactive component's playground story gets a `play` that checks keyboard behaviour and its main state change; overlays also assert focus moving into the overlay and returning to the trigger.

`"test": "vitest run"` is added to the playground, so it joins `turbo test`. CI installs Chromium with `playwright install --with-deps chromium` before `pnpm test`.
- *Alternative:* `@storybook/test-runner` (Jest + a running Storybook). Rejected: it needs a served build, and Storybook 10 recommends the Vitest addon.

### D7. Deterministic fixtures
- Local images live in `apps/storybook/public/`, served through `staticDirs`.
- Data (users, payments, chart series, chat transcript) lives in `src/fixtures/`.
- Dates in stories are fixed, so Calendar and other time-based stories do not change from day to day.

No network access during tests.

### D8. GitHub Pages deployment
`.github/workflows/storybook-pages.yml` runs on `push: main` and `workflow_dispatch`, with `permissions: pages: write, id-token: write, contents: read` and `concurrency: pages`. Steps:
1. Check out, then set up pnpm and Node (same as CI);
2. `pnpm turbo run build --filter=@aureus-core/storybook...`;
3. `actions/upload-pages-artifact` with `apps/storybook/storybook-static`;
4. `actions/deploy-pages`.

Storybook's static output uses relative asset paths, so the `/<repo>/` subpath needs no base configuration. The README and the package `homepage` link to the site.

## Risks / Trade-offs

- [62 components is a lot of hand-written content, and quality may drift] → Button is the reference template (task 4), the coverage test enforces completeness, and the work is done in category batches, each closed with green tests.
- [Some upstream components fail axe out of the box, for example a missing label on a demo-only element] → Fix it in the story by supplying the accessible name a real consumer would provide. If the violation is in the component itself, disable only that rule on that story with a comment linking the upstream issue. Never relax the rule globally.
- [Browser tests make CI slower and add flakiness from animations or portals] → Run Chromium only, use `findBy*` and waits instead of timeouts, and add `prefers-reduced-motion` emulation in the Vitest browser config.
- [Live locale switching relies on Storybook preview channel internals] → Keep it isolated in `use-locale.ts` with the reload fallback (D4).
- [attw's handling of wildcard exports] → Pass explicit entry points (D1). If attw still misreports wildcard subpaths, keep `publint` plus the consumer smoke build (task 2.6) as the type-resolution evidence and record the limitation in the script.
- [Moving `date-fns` and `@tanstack/react-table` out may break consumers] → Pre-1.0 minor bump with a changeset entry that tells consumers to install them directly.
- [Heavy dependencies (recharts, shiki) increase install size for every consumer] → Accepted. Output is unbundled, so they cost nothing at runtime unless imported. Moving them to optional peers is a possible later change.

## Migration Plan

1. Land the package fixes and the check first (tasks 1–2), with no consumer-visible change except the dependency cleanup.
2. Land the infrastructure and the Button template.
3. Land the category batches, then guides, then CI and Pages.
4. Release through the normal Changesets flow.

Rollback: revert the PR. Nothing about the published package's import paths changes.

## Open Questions

- The exact GitHub Pages URL depends on the repository owner and name at deploy time. It is filled into the README and `homepage` once the first deploy succeeds.

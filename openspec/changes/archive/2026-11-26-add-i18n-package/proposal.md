## Why

Every Aureus app (a Vite + React SPA with i18next) keeps its texts in the same layout:
- `src/common/locales/<language>.json` for texts shared by the whole app;
- `src/features/<module>/locales/<language>.json` for each module (`auth`, `companies`, `accounts`…).

Today each app wires this up by hand. Each namespace and each JSON file is imported and registered in an i18next setup file, so a new module means remembering to register it. `t("…")` gives no autocompletion and accepts keys that don't exist. A key missing in one language is only found in production, when the raw key shows up on screen.

A shared package lets every app declare the rule once, or not at all. New modules are then picked up automatically, `t()` is typed from the real JSON files, and the languages are kept in sync by the build.

## What Changes

- **New published package `@aureus-core/i18n`:**
  - ESM only, with a private `internal/` layer;
  - built with tsdown and checked with its own `check:package`;
  - three public entry points:
    - `@aureus-core/i18n/vite`: a Vite plugin that runs in Node;
    - `@aureus-core/i18n/runtime`: the browser runtime;
    - `@aureus-core/i18n/client`: type declarations only, for the virtual module.

  `i18next`, `react-i18next` and `react` 19 are required peers. `vite` is an optional peer, needed only by `/vite`.
- **Vite plugin `aureusI18n(options)`:**
  - **Discovery without configuration.** By default every folder named `locales` under `src/` is a namespace, named after the folder that contains it (`src/features/auth/locales` → `auth`). It never looks inside `node_modules`, `dist` or hidden folders.
  - **Language detection.** The languages are the JSON file names (`es.json`, `en.json`).
  - **Optional options:**
    - `include` / `exclude` globs narrow the search;
    - `namespaces` maps a folder to an explicit namespace name, and also adds folders not called `locales`;
    - `defaultNamespace`;
    - `typesFile`.

    `typesFrom` (the reference language) is required.
  - **Name collisions.** Two folders resolving to the same namespace are an error that names both paths.
  - **Virtual module `virtual:aureus-i18n`.** It exposes the discovered languages and namespaces, and one lazy loader per language and namespace.
  - **Generated type file** (default `src/types/i18next.d.ts`). It augments i18next's `CustomTypeOptions` with the `typesFrom` content as literal types. Namespaces, keys and interpolation values of `t()` and `useTranslation()` are then checked and autocompleted. The file is rewritten only when its content changes, and it is meant to be committed.
  - **Key parity check against `typesFrom`.** It reports missing keys, extra keys and missing language files: a warning in development and an error in `vite build`.
  - **Development loop:**
    - adding or removing a namespace folder or a language file regenerates the types and reloads the page;
    - editing a JSON file regenerates the types and hot-updates the texts without a reload.
- **Runtime `createI18n(config)`:**
  - creates and initializes an i18next instance wired to `react-i18next`, with a backend that loads each language/namespace on demand;
  - preloads the default namespace;
  - limits the supported languages to the discovered ones;
  - `fallbackLng` is required: the library never fixes a locale.
  - **Language detection, on by default:**
    - the first of `navigator.languages` that matches a discovered language is used (`es-ES` → `es`);
    - the user's choice is stored in `localStorage` on every language change;
    - `detection: false` or an explicit `lng` turns detection off, and `storageKey` customizes the storage key.
  - **Opt-in `syncDocument`:** keeps `<html lang>` and `dir` in sync with the language.
  - **`options` pass-through:** any other i18next init option is passed as is.
  - **No texts:** the package never ships user-facing texts. Only developer warnings and errors are hard-coded, in English.
- **Documentation:**
  - a new bilingual `i18n` section in Storybook, with a complete guide (configuration step by step, benefits, options reference, examples A–I, best practices/FAQ) and a live runtime demo;
  - a package README, a root README section, a CONTRIBUTING section and links from the existing guides;
  - a `minor` changeset.

Non-goals:
- Bundlers other than Vite, and frameworks with server rendering.
- Translation management (extracting keys from code, machine translation, remote translation services).
- Formats other than one JSON file per language and namespace.
- Changing `@aureus-core/ui`, `@aureus-core/hooks` or `@aureus-core/utils` behavior.
- Migrating existing apps (that is a later, app-side change).

## Capabilities

### New Capabilities

- `i18n-package`: the public contract of `@aureus-core/i18n`:
  - the entry points;
  - the required and optional peers;
  - the private layer;
  - development-only warnings;
  - no default texts;
  - the published contents.
- `i18n-vite-plugin`: the `aureusI18n` plugin:
  - namespace and language discovery (defaults, `include` / `exclude`, `namespaces`, collisions);
  - the virtual module contract;
  - type generation for `t()`;
  - the key parity check (dev warning, build error);
  - the development reload and hot-update loop.
- `i18n-runtime`: `createI18n`:
  - required options and pass-through;
  - lazy loading per language and namespace;
  - supported languages;
  - language detection and persistence;
  - `syncDocument`;
  - hot updates of texts.

### Modified Capabilities

- `component-playground`:
  - **Playground renders the built package:** it also consumes `@aureus-core/i18n` through its public paths.
  - **Story organisation:** a new `i18n/` section after `hooks/`.
  - **Bilingual documentation:** the i18n pages are covered too.

## Impact

- **New code:**
  - `packages/i18n/`: `package.json`, `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`, `client.d.ts`, `scripts/check-package.mjs`, `README.md`;
  - `src/vite/`, `src/runtime/`, `src/internal/`.
- **Playground:**
  - `apps/storybook/package.json` depends on `@aureus-core/i18n` (`workspace:*`), `i18next` and `react-i18next`;
  - new `src/stories/i18n/` (MDX guide and demo story);
  - `storySort` in `.storybook/preview.tsx`;
  - `src/coverage-tests.ts` adds `i18n` to the bilingual MDX check;
  - links from `guides/getting-started.mdx` and `hooks/schema-form.mdx`.
- **Docs:** root `README.md`, `CONTRIBUTING.md`, `.changeset/add-i18n-package.md`.
- **CI / release:** no workflow changes. The root `typecheck`, `test`, `build` and `check:package` already run over `packages/*`.
- **Manual step:** before the first release, the owner creates `@aureus-core/i18n` on npm and registers `release.yml` as its trusted publisher, as was done for utils and hooks.
- **Dependencies:**
  - peers `i18next`, `react-i18next` and `react ^19` (required), and `vite` (optional);
  - devDependencies on the same versions, plus Testing Library and jsdom for runtime tests;
  - no runtime dependencies.

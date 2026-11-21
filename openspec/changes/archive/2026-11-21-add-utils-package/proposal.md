## Why

Every app needs the same rules for showing values to the user:
- the same mark when a value is missing;
- trimmed and truncated text;
- numbers and dates written the same way in every language.

Today each screen repeats that logic. Every consumer app is multilingual (i18next), and the user can change the language at runtime, so a format hard-coded in a screen is wrong as soon as the language changes. The monorepo only publishes `@aureus-core/ui`, which is a React component library. Plain functions that every project can use, with or without React, have no home yet.

## What Changes

- **New published package `@aureus-core/utils`:**
  - ESM only, no runtime dependencies, no React;
  - one public entry point per module (`@aureus-core/utils/<module>`), no root barrel;
  - a private `internal/` layer;
  - built with tsdown and checked with its own `check:package` (outputs, aliases, publint, attw, tarball).
- **Module `date-formats`:**
  - A **closed catalog** of date and time formats defined in the library:
    - date formats: `short`, `medium`, `long`, `full`, `numericDate`, `dayMonth`, `monthYear`, `weekday`, `month`, `year`;
    - time formats: `time`, `timeWithSeconds`;
    - date-time formats: `shortDateTime`, `mediumDateTime`, `longDateTime`.

    Apps pick a name and never declare a format. Each name resolves to the active language's form: `Intl` options by default, plus a per-language pattern only where the library wants an exact form.
  - `createDateFormatter({ locale?, timeZone? })` returns `{ format(value, name, overrides?) }`.
  - `dateFormatNames` and the `DateFormatName` type.
  - Inputs are `Date`, a timestamp or an ISO string. Local ISO strings (`YYYY-MM-DD`, `HH:mm[:ss]`, `YYYY-MM-DDTHH:mm[:ss]`) are read as local wall time, never through UTC.
- **Module `display`:**
  - `createDisplay({ empty, locale?, timeZone? })` returns `text`, `number`, `boolean`, `date`, `time`, `dateTime` and `list`.
  - Each function returns a `string` and turns `null`/`undefined` into the configured `empty` text. An invalid value also becomes `empty`, with a development warning.
  - Every option is opt-in and independent. Defaults are neutral.
- **Locale and time zone are never fixed:**
  - Both default to the runtime's.
  - `locale` also accepts a getter that is evaluated on every call (`() => i18n.resolvedLanguage`).
  - `timeZone` is opt-in.
- **No default texts:**
  - `empty`, the boolean labels and the "more items" text are required by TypeScript.
  - Only developer warnings are hard-coded.
- **Playground:**
  - a new `utils` section in Storybook with bilingual pages for both modules;
  - a live catalog table that follows the toolbar locale;
  - a `display` playground.
- **Docs and release:**
  - a package README;
  - a root README section;
  - a CONTRIBUTING section;
  - a `minor` changeset.

Non-goals:
- App-defined or inline date formats.
- Relative time ("3 days ago"), compact or percent numbers, and file sizes.
- Parsing user input, and date arithmetic.
- Changing `@aureus-core/ui`. It keeps its own internal ISO helpers; merging them is a later change.

## Capabilities

### New Capabilities

- `utils-package`: the public contract of `@aureus-core/utils`:
  - module entry points;
  - layer rules;
  - no runtime dependencies;
  - locale and time zone resolution shared by all modules.
- `date-formats`: the closed date and time catalog:
  - how a name resolves for a language;
  - accepted inputs and local ISO handling;
  - time zones;
  - development warnings.
- `value-display`: the `display` functions:
  - the empty rule;
  - the options of each function and their independence;
  - required texts.

### Modified Capabilities

- `component-playground`:
  - **Story organisation:** a `utils/` section that documents the utils package.
  - **Bilingual documentation:** the utils pages are covered too.
  - **Playground renders the built package:** it also consumes `@aureus-core/utils` through its public paths.

## Impact

- **New code:**
  - `packages/utils/`: `package.json`, `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`, `vitest-global-setup.ts`, `scripts/check-package.mjs`, `README.md`;
  - `src/date-formats/`, `src/display/`, `src/internal/`.
- **Playground:**
  - `apps/storybook/package.json` depends on `@aureus-core/utils` (`workspace:*`);
  - new `src/stories/utils/` (two MDX pages, two stories);
  - `storySort` in `.storybook/preview.tsx`;
  - `src/coverage-tests.ts` adds `utils` to the bilingual MDX check.
- **Docs:** root `README.md`, `CONTRIBUTING.md`, `.changeset/add-utils-package.md`.
- **CI / release:** no workflow changes. The root `typecheck`, `test`, `build` and `check:package` already run over `packages/*`, and changesets publishes every public package.
- **Manual step:**
  - npm trusted publishing can only be configured on a package that already exists;
  - so before the first release, the owner creates `@aureus-core/utils` on npm and registers the repository's `release.yml` as its trusted publisher.
- **Dependencies:** none added. Everything is built on the platform's `Intl` (`DateTimeFormat`, `NumberFormat`, `ListFormat`, `Segmenter`).

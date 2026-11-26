## 1. Package scaffold

- [x] 1.1 Create `packages/i18n/package.json` (design decision 1):
  - `@aureus-core/i18n`, version `0.0.0`, `type: module`, `sideEffects: false`, `files: ["dist", "client.d.ts"]`;
  - explicit exports `./vite`, `./runtime` (types + default), `./client` (types → `./client.d.ts`), `./internal/*: null`, `./package.json`;
  - `publishConfig` with public access and provenance, plus `repository.directory`, `homepage`, `bugs` and `keywords`;
  - scripts `build`, `dev`, `typecheck`, `test`, `check:package`;
  - peers `i18next ^27.2.0`, `react-i18next ^18`, `react ^19` (required) and `vite ^8` (optional in `peerDependenciesMeta`);
  - devDependencies: those peers, `react-dom`, Testing Library, jsdom, tsdown, typescript, vitest, publint, attw, `@aureus-core/tsconfig`, `@types/react`, `@types/node`.

  Verify that `pnpm install` links it, and that `pnpm ls --filter @aureus-core/i18n --prod` lists no dependencies.
- [x] 1.2 Add the three config files:
  - `tsconfig.json`: extends `react-library.json`, `types: ["node"]`, `@/*` paths;
  - `tsdown.config.ts`: two configs, `src/vite/**` on platform `node` and `src/runtime/**` + `src/internal/**` on platform `browser`. Both unbundled ESM with d.ts, tests excluded, and `define` for `NODE_ENV`;
  - `vitest.config.ts`: `src/**/*-tests.{ts,tsx}`, jsdom for `runtime/**`, node for `vite/**`, `@` alias, `passWithNoTests`.

  Verify that `typecheck` and `test` run with stub entry files.
- [x] 1.3 Write `client.d.ts` as a script file declaring `virtual:aureus-i18n` with a default export of `I18nResources` (design decision 1). Verify with a type test: importing `virtual:aureus-i18n` under a tsconfig whose `types` include the client gives `I18nResources`.
- [x] 1.4 Copy and adapt `scripts/check-package.mjs` from hooks:
  - fixed entry points `vite`/`runtime` (`.js` + `.d.ts`) and `client.d.ts`;
  - attw on all three;
  - the root and `internal/*` must not resolve;
  - tarball allowlist plus `client.d.ts`;
  - a new check: no `node:*` or `vite` import in `dist/runtime/**` or `dist/internal/**`.

  Verify after a build that the check passes. Then confirm it fails and names the entry point when `dist/runtime/index.js` is deleted, and fails when a `node:fs` import is added to a runtime file.
- [x] 1.5 Confirm that the root `build`, `dev`, `typecheck`, `test` and `check:package` and the CI/release workflows pick up the package without edits. Verify with `pnpm check:package` from the root, whose output lists `@aureus-core/i18n`.

## 2. Internal layer

- [x] 2.1 Add the shared pieces with their barrels:
  - `src/internal/types/resources-contract-types.ts` (the `I18nResources` shape, `I18nUpdate`);
  - `internal/utils/constants/` (`is-dev.ts`, `virtual-module-id.ts`, `hmr-event.ts`);
  - a warn-once helper copied from hooks, with `resetWarnings`.

  Verify with `warn-once-tests.ts`: one log per key, and none when `NODE_ENV=production`.

## 3. Plugin helpers (pure, tested without Vite)

- [x] 3.1 Write `vite/types/vite-types.ts` (`AureusI18nOptions` with JSDoc on every option and its default) and `utils/helpers/match-glob.ts`. Verify with `match-glob-tests.ts`: `*` matches exactly one segment, `**` matches zero or more, exact paths match, and Windows separators are normalized.
- [x] 3.2 Write `scan-namespaces.ts` (design decision 3) with a `create-fixture-tree` test helper. Verify with `scan-namespaces-tests.ts` (spec "Namespace discovery", "Narrowing and naming discovery", "Language discovery", "Invalid configuration"):
  - the typical project with no options;
  - `node_modules`, `dist` and dot-folders ignored;
  - `exclude`;
  - `include` limited to features;
  - an explicit `namespaces` entry;
  - non-JSON files ignored;
  - sorted output;
  - collision error naming both folders;
  - error when no namespace is found.
- [x] 3.3 Write `read-locale-file.ts`, which reads and validates that a file holds an object. Verify with tests: valid object, invalid JSON, and a top-level array or string. Each error names the file.
- [x] 3.4 Write `flatten-keys.ts`, `check-key-parity.ts` and `format-parity-report.ts` (design decision 7). Verify with tests (spec "Key parity between languages"):
  - nested keys;
  - missing, extra and missing-file findings;
  - plural categories normalized (`en` one/other against `ar` six forms → no finding);
  - in-sync languages → no finding;
  - the report grouped by namespace, then language, in a stable order.
- [x] 3.5 Write `render-types-file.ts` and `write-if-changed.ts` (design decision 6). Verify with tests (spec "Generated types for `t()`"):
  - the header comment;
  - `ResourceNamespaceMap` with literal, escaped and sorted values;
  - `CustomTypeOptions.defaultNS` only when configured;
  - byte-identical output for the same input;
  - no write when the content is unchanged (mtime kept);
  - the parent folder created.
- [x] 3.6 Write `render-virtual-module.ts` (design decision 4). Verify with tests:
  - one static `import()` per file;
  - `load` resolves `{}` for a missing pair;
  - `languages`/`namespaces`/`defaultNamespace` emitted;
  - the `import.meta.hot` block only in dev.

## 4. Plugin

- [x] 4.1 Write `vite/vite.ts`:
  - `configResolved` (root);
  - option validation (`typesFrom` and `defaultNamespace` must be discovered);
  - `buildStart` (scan → types → parity; `this.error` in build, `logger.warn` in dev);
  - `resolveId`/`load` for the virtual module.

  Export `aureusI18n` and the options type from `vite/index.ts`. Verify with `plugin-build-tests.ts`, which runs `vite.build()` on fixture projects:
  - one output chunk per locale file;
  - the parity failure lists `auth`/`en`/`login.title`;
  - collision error;
  - unknown `typesFrom` error;
  - invalid JSON error;
  - the types file written and not rewritten on a second build.
- [x] 4.2 Add the dev loop (design decision 8):
  - `configureServer` watcher on add/unlink/addDir/unlinkDir → rescan, types, parity, invalidate the virtual module, full reload;
  - `hotUpdate` for a changed locale file → re-read, types, parity, `ws.send` custom event with `{ lng, ns, content }`, return `[]`;
  - deduplicated dev warnings, and invalid JSON in dev logged without stopping the server.

  Verify with `plugin-dev-tests.ts` (`createServer()` on a temp project, `ws.send` spied; spec "Development update loop"):
  - creating `features/payments/locales/{es,en}.json` → full-reload sent and the types include `payments`;
  - editing a value → custom event with the new content and no full reload;
  - removing a key → one warning, not repeated on an unrelated save.

## 5. Runtime

- [x] 5.1 Write `runtime/types/runtime-types.ts` (`CreateI18nConfig` with JSDoc; re-export `I18nResources`) and `utils/helpers/match-language.ts`. Verify with tests: exact match first, base subtag (`es-MX` → `es`), first browser preference wins, and no match → `undefined`.
- [x] 5.2 Write `resources-backend.ts` (design decision 9). Verify with tests: `read` calls `load(lng, ns)` and passes data to the callback; a rejection is passed as an error.
- [x] 5.3 Write `language-detector.ts`. Verify with tests (spec "Language detection and persistence"):
  - stored and supported → stored language;
  - stored but unsupported → browser language;
  - browser match;
  - nothing → `undefined`;
  - `cacheUserLanguage` writes under the default and under a custom key;
  - `localStorage` that throws on read and on write does not fail.
- [x] 5.4 Write `sync-document.ts` and `managed-options.ts`. Verify with tests:
  - `lang`/`dir` set after init and on change (`ar` → `rtl`);
  - a no-op without `document`;
  - each overridden managed option is dropped and warned once, naming it.
- [x] 5.5 Write `runtime/runtime.ts` (`createI18n`: isolated instance, backend, detector unless `lng`/`detection: false`, `initReactI18next`, managed init options, optional `syncDocument`, dev-only `onUpdate` → `addResourceBundle` + re-render) and `runtime/index.ts`. Verify with `runtime-tests.tsx` (Testing Library + fake resources; spec "Creating the instance", "Lazy loading", "Option pass-through", "Hot updates"):
  - the minimal setup renders `common` inside `Suspense`;
  - `auth` is requested only when its screen renders;
  - a language change loads the namespaces in use;
  - an unsupported language → fallback texts;
  - `es-ES` → `es`;
  - an extra option is applied;
  - `supportedLngs` overridden → kept and warned;
  - detection off writes nothing to storage;
  - an update event re-renders the new text without a reload;
  - no subscription when `NODE_ENV=production`.
- [x] 5.6 Write the type tests:
  - `runtime-types-tests.ts` against `tests/fixtures/i18next-fixture.d.ts`: valid key, `@ts-expect-error` for an unknown key and an unknown namespace, `common:` prefixed keys, interpolation required (`{ name }`), and plurals by base key;
  - a unit test that `render-types-file` on the matching fixture tree reproduces that fixture byte for byte.

  Confirm that the lowest `i18next` version in the peer range exposes `ResourceNamespaceMap`, and raise the floor if not. Verify with `pnpm --filter @aureus-core/i18n typecheck`.

## 6. Package checks

- [x] 6.1 Run `pnpm --filter @aureus-core/i18n build` and `check:package`. Confirm that the runtime output has no Node or Vite imports and that the tarball holds only `dist/`, `client.d.ts` and the metadata.
- [x] 6.2 Manual end-to-end check with a throwaway Vite + React app in the scratchpad, linked to the built package:
  1. the minimal setup renders `common` and `auth`, and `t("")` autocompletes in the editor;
  2. creating `features/payments/locales/{es,en}.json` while the dev server runs reloads the page and updates the `.d.ts`;
  3. editing a text updates it without a reload;
  4. removing a key from `en.json` warns in the terminal and makes `vite build` fail with the details;
  5. `vite build` emits one chunk per locale file.

  Record the outcome in the change notes.

  > **Outcome (2026-11-25):** passed with a Vite 8.3.6 + React 19.3 app driven by Playwright Chromium.
  > - The app renders `common` and `auth` in the browser language (`es-ES` → `es`), with interpolation and `<html lang>`.
  > - Editing a text updates it without a reload, and the types follow the edit.
  > - A language switch is remembered after a reload.
  > - Creating `payments` while the dev server runs fully reloads the page, adds it to the types, and its namespace loads lazily.
  > - Removing a key logs the grouped warning, and `vite build` exits 1 with the same report.
  > - The build emits one chunk per locale file.
  > - `tsc` on the app accepts the valid calls and rejects an unknown key, a missing interpolation value and an unknown namespace.
  >
  > There were no browser console errors. The run also confirmed that a prefixed key (`t("auth:welcome")`) needs its namespace in `useTranslation([...])`, which the guide states.

## 7. Playground

- [x] 7.1 Add `@aureus-core/i18n` (`workspace:*`), `i18next` and `react-i18next` to `apps/storybook/package.json`. Add `i18n` after `hooks` in `storySort` (`.storybook/preview.tsx`), and add `i18n` to the bilingual MDX balance check in `src/coverage-tests.ts`. Verify that `pnpm --filter storybook test` covers the new section and fails when an `<En>` block has no `<Es>`.
- [x] 7.2 Write the demo `src/stories/i18n/translations/translations-stories.tsx` (story title `i18n/Translations`; its component is `translations-demo.tsx` and the example app texts are `translations-locales.ts`):
  - in-memory `I18nResources` with an artificial delay;
  - `createI18n({ detection: false, … })` inside `I18nextProvider`;
  - a language selector, and a button that opens a lazily loaded `payments` panel with a visible loading state;
  - the demo labels come from `translations-strings.ts` (typed `en`/`es`) and follow the docs locale.

  Add the strings to a strings test like `utils-strings-tests.ts` (`src/stories/i18n/i18n-strings-tests.ts`). Verify that the story renders in `pnpm --filter storybook test` and that the strings test passes.

## 8. Documentation

- [x] 8.1 Write `apps/storybook/src/stories/i18n/translations.mdx` in `<En>`/`<Es>`, with every example showing the folder tree, the configuration and the result. Its sections:
  1. what it is and why, plus the benefits (no registration, autocompletion, typed interpolation, lazy loading, keys kept in sync, text HMR, remembered language, one setup for every app);
  2. how it works (diagram; dev vs build);
  3. installation and peers;
  4. step-by-step configuration with full files (`vite.config.ts`, tsconfig, `src/i18n.ts`, `main.tsx` with `Suspense`, first `useTranslation`);
  5. options reference tables for `aureusI18n` and `createI18n` (type, default, when to use);
  6. examples:
     - A: a typical project with no configuration;
     - B: adding a module while the dev server runs;
     - C: autocompletion and TS errors (nested keys, `common:` prefix, several namespaces, typed interpolation, plurals);
     - D: keys out of sync (the exact dev warning and build error, and how to fix them);
     - E: `include`/`exclude`;
     - F: `namespaces`, and resolving a collision;
     - G: language detection, a language selector, `storageKey`, `detection: false` + `lng`, `syncDocument`/RTL, and using `i18n` outside React;
     - H: schema hooks and `@aureus-core/ui` controls;
     - I: the `options` pass-through and `enableSelector` in a separate `.d.ts`;
  7. best practices and FAQ (commit the generated file, one JSON per language and module, nested keys per screen, autocompletion not showing, CI).

  Verify that the playground test command passes its bilingual check, and that `pnpm --filter storybook build` succeeds.
- [x] 8.2 Write `packages/i18n/README.md`: benefits, installation, minimal setup, condensed examples A–C, and a link to the guide. Add an `@aureus-core/i18n` section to the root `README.md` (package table, install, import paths). Add the package to `CONTRIBUTING.md` (entry points, peers, how to test the plugin with fixtures and the manual app). Link the guide from `guides/getting-started.mdx` and `hooks/schema-form.mdx` (schema hooks with typed `useTranslation`), in both languages. Verify with `pnpm lint` and the playground's bilingual test.
- [x] 8.3 Add `.changeset/add-i18n-package.md` (`@aureus-core/i18n: minor`) with a short summary. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 From the root, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm check:package`. Confirm that all pass, then run `openspec validate add-i18n-package --strict`.

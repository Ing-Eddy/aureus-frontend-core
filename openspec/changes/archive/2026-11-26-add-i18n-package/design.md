## Context

See proposal.md (Why) for the motivation. The requirements are in the specs `i18n-package`, `i18n-vite-plugin`, `i18n-runtime` and `component-playground`. Facts that shape the approach:

- **`packages/hooks` and `packages/utils` are the templates for a new package:**
  - `tsdown.config.ts`: unbundled ESM with d.ts, tests excluded, and `define` keeps `process.env.NODE_ENV`;
  - `scripts/check-package.mjs` discovers modules from `src/*/index.ts` and runs the outputs, alias-leak, publint, attw `esm-only`, self-reference and tarball checks;
  - `internal/utils/constants/is-dev.ts`, plus the warn-once helper pattern.
- **Consumers.** They are Vite + React SPAs. The repo's dev tooling is on Vite 8.3 and React 19.3. The current versions are i18next 27.2 and react-i18next 18.0, which requires `i18next >= 27.0.1`.
- **i18next 27 typings (checked in the published `typescript/options.d.ts`):**
  - `CustomTypeOptions` carries scalar options (`defaultNS`, `enableSelector`…);
  - the newer `ResourceNamespaceMap` interface takes per-namespace resource types and merges with other augmentations without TS2717;
  - `strictInterpolationChecks` defaults to `true`, so literal string types give typed `{{placeholders}}`.
- **Vite.** It serves virtual modules through `resolveId`/`load` with a `\0` id. JSON files are ES modules whose default export is the parsed object, and dynamic `import()` of a static path becomes its own chunk. `server.watcher` (chokidar) emits `add`, `addDir`, `unlink`, `unlinkDir` and `change` for everything under the root. The `hotUpdate` hook can replace the default HMR handling of a file.
- **Playground:**
  - workspace packages resolve through their `exports` (`dist/`);
  - MDX pages use `<En>`/`<Es>`;
  - `coverage-tests.ts` checks MDX balance per section;
  - interactive strings are typed `en`/`es` objects with a strings test (`stories/utils/utils-strings-tests.ts`);
  - its own `@sb/i18n` helper is the docs locale switcher, unrelated to this package.

## Goals / Non-Goals

**Goals:**
- An app needs one plugin call with `typesFrom`, one `createI18n` call and one tsconfig `types` entry. Nothing is registered per module.
- `t()`, `useTranslation()` and interpolation are type-checked from the real JSON, with no hand-written types.
- The production bundle holds only the runtime and the locale chunks that are actually used.
- Every behavior is covered by tests: pure helpers, the plugin through Vite's real JavaScript API, the runtime under jsdom, plus type tests.

**Non-Goals:**
- A wrapper around i18next or react-i18next. `createI18n` returns i18next's own instance, and components keep using `useTranslation`.
- Supporting `vite preview` or SSR specifically. Nothing breaks there, but nothing is tuned for it.

## Decisions

### 1. One package, three explicit entry points
- `package.json` `exports` lists `./vite` and `./runtime` (types + default), `./client` (types only → `./client.d.ts`), `./internal/*` → `null` and `./package.json`. There is no wildcard export. The set of entry points is closed, and `client` is not a compiled module.
- `tsdown.config.ts` is a single unbundled ESM config with d.ts and `platform: "neutral"`, like utils. Node built-ins are marked external (`deps.neverBundle: [/^node:/]`). Unbundled output keeps one file per source file, so the runtime never pulls in the plugin's code. `check:package` enforces it: no `node:*` or `vite` import in `dist/runtime/**` or `dist/internal/**`.

  The first idea was two configs (`node` for `vite/`, `browser` for the rest). It was dropped during implementation: both would emit the shared `internal/` files into the same `dist/`, and the platform only changes how unresolved imports are reported.
- `client.d.ts` is static and listed in `files`. It is a script file (no top-level import or export) containing `declare module "virtual:aureus-i18n" { const resources: import("@aureus-core/i18n/runtime").I18nResources; export default resources; }`.
- `check-package.mjs` is copied from hooks and changed in three ways:
  - the entry points are fixed: `vite` and `runtime` must have `.js` + `.d.ts`, and `client.d.ts` must exist;
  - attw runs on all three;
  - a new check fails if any `dist/runtime/**` or `dist/internal/**` file imports `node:*` or `vite`.

Alternatives:
- A module of `@aureus-core/hooks`: mixes Node build code into a browser-only package. The user chose a separate package.
- Two packages (`i18n-vite` + `i18n`): they share a contract and are versioned together, so two packages are extra ceremony.

### 2. Folder layout
```
packages/i18n/
├─ client.d.ts
└─ src/
   ├─ vite/
   │  ├─ index.ts                public: aureusI18n, AureusI18nOptions
   │  ├─ vite.ts                 the plugin (hooks wiring only)
   │  ├─ types/                  vite-types.ts + index.ts
   │  ├─ utils/helpers/          match-glob, scan-namespaces, read-locale-file, flatten-keys,
   │  │                          check-key-parity, format-parity-report, render-virtual-module,
   │  │                          render-types-file, write-if-changed (+ index.ts)
   │  └─ tests/                  one *-tests.ts per helper, plugin-tests.ts (Vite JS API), fixtures/
   ├─ runtime/
   │  ├─ index.ts                public: createI18n, I18nResources, CreateI18nConfig
   │  ├─ runtime.ts              createI18n
   │  ├─ types/                  runtime-types.ts + index.ts
   │  ├─ utils/helpers/          resources-backend, language-detector, match-language,
   │  │                          sync-document, managed-options (+ index.ts)
   │  └─ tests/                  *-tests.ts(x), runtime-types-tests.ts, fixtures/i18next-fixture.d.ts
   └─ internal/
      ├─ types/                  resources-contract-types.ts (shared by vite + runtime)
      └─ utils/constants/        is-dev.ts, virtual-module-id.ts, hmr-event.ts
```
- `vite` never imports `runtime`, and `runtime` never imports `vite`. What they share (the contract shape, the virtual id, the HMR event name) lives in `internal/`.
- Each helper is pure, or works on a given root path, so it can be tested without Vite.

### 3. Discovery is a small built-in walker
- `scan-namespaces(root, { include, exclude, namespaces })` walks `root` recursively. It skips `node_modules`, `dist` and dot-folders at any depth.
- It matches each directory's root-relative POSIX path against the `include` globs, then removes those matching `exclude`. The default for `include` is `["src/**/locales"]`. `match-glob` supports only `*` (one segment) and `**` (any number of segments), which is all the spec promises.
- `namespaces` entries are added explicitly. An explicit entry wins over a discovered folder at the same path.
- The namespace name is the parent folder's name. Names are checked for collisions after both sources are merged.
- The result is sorted: `{ namespaces: { [ns]: { dir, files: { [lng]: absPath } } }, languages: string[] }`. Languages are the `.json` base names found directly in each folder.

Alternatives:
- `tinyglobby`/`picomatch`: they add runtime dependencies, which the package contract forbids.
- `fs.globSync`: its exclusion and directory-matching behavior varies between Node versions supported by Vite 8.
- `import.meta.glob` inside the virtual module: it would hide namespace naming and collisions in client code, and could not apply exclusions or explicit names.

### 4. The virtual module is generated code with static imports
`render-virtual-module(scan, options, { dev })` emits:
```js
const loaders = { "es/auth": () => import("/abs/src/features/auth/locales/es.json"), … };
const listeners = new Set();
export default {
  languages: ["en", "es"], namespaces: ["auth", "common"], defaultNamespace: "common",
  load: (lng, ns) => (loaders[`${lng}/${ns}`]?.() ?? Promise.resolve({ default: {} })).then((m) => m.default),
  onUpdate: (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
};
if (import.meta.hot) import.meta.hot.on("aureus-i18n:update", (u) => listeners.forEach((cb) => cb(u)));
```
- The `import.meta.hot` block is emitted only in dev.
- Static paths let Rollup/Rolldown split one chunk per file, so lazy loading comes for free.
- `resolveId("virtual:aureus-i18n")` returns `"\0virtual:aureus-i18n"`.

### 5. The app passes the resources to `createI18n`
`src/i18n.ts` imports `virtual:aureus-i18n` and passes it as `resources`.

Alternative: the runtime imports the virtual module itself. Rejected for three reasons:
- Vite's dependency pre-bundling (esbuild/rolldown on `node_modules`) cannot resolve a virtual id from inside a dependency;
- the runtime would only be testable with a Vite server;
- the explicit import keeps the data flow visible.

The cost is one import line.

### 6. Types file: literal content, `ResourceNamespaceMap` + `CustomTypeOptions.defaultNS`
`render-types-file(scan, typesFrom, defaultNamespace)` produces:
```ts
// Generated by @aureus-core/i18n. Do not edit: it is rewritten from the locale files.
import "i18next";
declare module "i18next" {
  interface ResourceNamespaceMap {
    auth: { "login": { "title": "Entrar" } };
    common: { … };
  }
  interface CustomTypeOptions { defaultNS: "common" }   // only when defaultNamespace is set
}
```
- Values are emitted as JSON-escaped string literal types, with object keys quoted and sorted. Arrays become readonly tuples of literals. Numbers, booleans and null keep their literal types.
- `ResourceNamespaceMap` (i18next ≥ 27) is used instead of `CustomTypeOptions.resources`. The app can then add its own `CustomTypeOptions` (for example `enableSelector`) in another `.d.ts` without a duplicate-property error. The guide documents this (example I).
- The peer range is therefore `i18next ^27.2.0`. At implementation time, confirm that the lowest version in that range exposes `ResourceNamespaceMap`, and raise the floor if not.
- `write-if-changed` compares with the file on disk before writing, so the watcher does not loop and git diffs stay clean. The parent folder is created if needed.

Alternative: `import type x from "../features/auth/locales/es.json"`. JSON imports widen values to `string`, so typed interpolation is lost, and the relative paths make the file fragile.

### 7. Key parity check
- `flatten-keys` turns nested objects into dot paths. Arrays and leaves are terminal.
- `check-key-parity(scan, contents, typesFrom)` normalizes plural keys to their base key. The plural suffixes are `_(zero|one|two|few|many|other)` and `_ordinal_(…)`. It then compares sets per namespace and returns findings `{ ns, lng, kind: "missing" | "extra" | "missing-file", key? }`.
- `format-parity-report` groups the findings by namespace, then by language, in a stable order. The same text is used for the dev warning and the build error.
- Build (`command === "build"`): `buildStart` throws through `this.error(report)`.
- Dev: the report goes to `server.config.logger.warn`, keyed by a hash of the report, so an unchanged report is not logged again on unrelated saves.
- Invalid JSON follows the same split: an error in build; in dev, `logger.error` and the file is skipped, so the server keeps running.

### 8. Development loop
- `configureServer` subscribes to `server.watcher`:
  - `add`/`unlink`/`addDir`/`unlinkDir` on a path inside `root/src`, or inside a `namespaces` folder, rerun the scan. If the scan result changed, the plugin regenerates the types and reruns the parity check. Then it invalidates `\0virtual:aureus-i18n` in the client environment's module graph and sends `{ type: "full-reload" }`.
  - `change` on a known locale file is handled in the `hotUpdate` hook. The plugin re-reads and validates the file, regenerates the types and reruns parity. It then sends `ws.send("aureus-i18n:update", { lng, ns, content })` and returns `[]`, so Vite does not propagate the update and reload the page.
- Vite has already invalidated the JSON module, so a later full load gets the fresh file.
- The content goes in the event payload. Re-importing the same URL would hit the browser's module cache.

### 9. Runtime: `createI18n`
- It uses `i18next.createInstance()`, with `.use(resourcesBackend(resources))`, `.use(languageDetector(...))` (unless `lng`/`detection: false`) and `.use(initReactI18next)`. `init` is called with:
  ```
  { ...options, fallbackLng, lng, supportedLngs: resources.languages, nonExplicitSupportedLngs: true,
    load: "languageOnly", ns: defaultNamespace ? [defaultNamespace] : [], defaultNS: defaultNamespace ?? false }
  ```
  It returns the instance without awaiting `init`, because `Suspense` handles readiness.
- An isolated instance, not the global `i18next` default: there is no global mutation, tests are independent, and react-i18next receives the instance through `initReactI18next`. Code outside React imports `i18n` from the app's `src/i18n.ts`, and the guide says so.
- **Managed options.** `supportedLngs`, `nonExplicitSupportedLngs`, `load`, `ns`, `defaultNS`, `backend`, `resources` and `partialBundledLanguages` win over `options`. Each overridden one produces one dev warning, `[createI18n] "<name>" is managed by createI18n and was ignored.`
- **Backend.** It is an i18next `BackendModule`. `read(lng, ns, cb)` calls `resources.load(lng, ns)` and then `cb(null, data)`. A rejection is passed as `cb(error, false)`, so i18next applies its own retry and fallback.
- **Detector.** It is an i18next `LanguageDetectorModule`, so i18next calls `cacheUserLanguage` on every change.
  - `detect()` returns the stored language when it is supported. Otherwise it returns the first of `navigator.languages` (or `navigator.language`) matched by `match-language`: an exact match first, then the base subtag. If nothing matches it returns `undefined`, and i18next uses `fallbackLng`.
  - Storage access is wrapped in `try/catch`. The storage key defaults to `aureus-i18n-language`. That key is a storage id, not a text, so it does not conflict with the no-default-texts rule.
- **`syncDocument`.** It sets `document.documentElement.lang`/`dir` from `i18n.resolvedLanguage` and `i18n.dir()` after init and on every `languageChanged`. It does nothing when `document` is undefined.
- **Hot updates.** Only when `isDev`, the runtime subscribes with `resources.onUpdate(({ lng, ns, content }) => …)`. The callback calls `i18n.addResourceBundle(lng, ns, content, false, true)` (full replace), then `i18n.emit("languageChanged", i18n.language)`. React components re-render with the new texts without changing the language. The emit is chosen over `changeLanguage` so the detector does not store the language again.

### 10. Testing approach
- **Vite helpers:** unit tests against temporary folder trees created in `os.tmpdir()`, built by a `create-fixture-tree` test helper.
- **Plugin:** tests through Vite's JavaScript API (`vite` is a devDependency):
  - `build()` on fixture projects covers chunk-per-file output, parity failure, collisions and invalid JSON;
  - `createServer()` covers the virtual module content, the types file being written, the dev warning and the watcher loop (structural change → full-reload message; content change → custom event, with `ws.send` spied).
- **Runtime:** Vitest + jsdom + Testing Library with in-memory `I18nResources` fakes. It covers lazy loading, the order of reads, detection, storage failures, managed-option warnings, `syncDocument` and hot updates.
- **Types:**
  - `runtime-types-tests.ts` uses `fixtures/i18next-fixture.d.ts` to check valid keys, `@ts-expect-error` on unknown keys and namespaces, and typed interpolation;
  - a unit test asserts that `render-types-file` on the matching fixture tree reproduces that fixture byte for byte, so the fixture cannot drift.

### 11. Playground
- `apps/storybook` gains `@aureus-core/i18n` (`workspace:*`), `i18next` and `react-i18next`.
- The demo story builds fake `I18nResources` in memory, with an artificial delay to make lazy loading visible. It calls `createI18n` with `detection: false`, wraps the demo in `I18nextProvider` with that instance, and shows a language selector plus a lazily opened `payments` namespace. The demo's own labels come from `i18n-strings.ts` and follow the docs locale.
- `coverage-tests.ts` adds the `i18n` section to its MDX balance check.
- `storySort` places `i18n` after `hooks`.

## Risks / Trade-offs

- [The generated `.d.ts` can be stale in CI if someone edits a JSON file without running Vite] → The guide tells users to commit the file, and `vite build` (part of any app CI) regenerates it. A stale file shows up as a git diff after the build. A follow-up could add a check-only CLI.
- [Very large locale sets can slow TypeScript with literal types] → The guide's example I documents i18next's `enableSelector: "optimize"`. Literal types are the default because typed interpolation is a stated goal.
- [Scanning all of `src/` on every structural change in very large projects] → The scan is a directory walk that skips the heavy folders. It runs only on add/unlink events, not on every save, and `include` can narrow it.
- [A namespace folder renamed while the dev server runs] → It is handled as unlink + add, so discovery repeats and the page fully reloads.
- [Dev HMR sends whole file contents over the websocket] → Locale files are small, and this happens only in dev.
- [The `i18next` peer floor depends on `ResourceNamespaceMap` availability] → Verified at implementation, as noted in decision 6.
- [An isolated instance means `import i18next from "i18next"` elsewhere is not the configured one] → The guide documents it in the FAQ and in example G (outside React, import from `src/i18n.ts`).

## Migration Plan

- This is a new package, so nothing existing changes.
- **Release:**
  1. merge with a `minor` changeset;
  2. before the first publish, the owner creates `@aureus-core/i18n` on npm and adds `release.yml` as its trusted publisher;
  3. the release workflow publishes it.
- **Adoption** is a later, app-side change. Each app:
  1. installs the package;
  2. replaces its hand-written setup file with `src/i18n.ts`;
  3. adds the plugin and the tsconfig entry;
  4. deletes its manual namespace registry;
  5. commits the generated `.d.ts`.
- **Rollback** is per app: revert to the previous setup file. A bad release is deprecated on npm and fixed in a patch.

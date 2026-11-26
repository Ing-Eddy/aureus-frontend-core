## Purpose

Defines how the `aureusI18n` Vite plugin discovers an app's translation namespaces and languages from its folder layout, exposes them as lazy-loaded resources, generates the types that make `t()` checked and autocompleted, and keeps the languages' keys in sync.

## ADDED Requirements

### Requirement: Namespace discovery without configuration
With no discovery option, the plugin SHALL treat every folder named `locales` under `src/` (relative to the Vite root, at any depth) as one namespace. The namespace is named after the folder that contains it. The plugin MUST NOT look inside `node_modules`, `dist` or any folder whose name starts with `.`. Discovery MUST be repeated whenever the plugin starts, so folders created later are found without changing the configuration.

#### Scenario: Typical project
- **WHEN** the project has `src/common/locales/`, `src/features/auth/locales/` and `src/features/companies/locales/`, each with `es.json` and `en.json`, and the plugin is configured with only `typesFrom: "es"`
- **THEN** the discovered namespaces are `common`, `auth` and `companies`

#### Scenario: Ignored folders
- **WHEN** a `locales` folder exists under `src/vendor/node_modules/lib/` or under `src/.cache/`
- **THEN** it is not a namespace

#### Scenario: Module added later
- **WHEN** `src/features/payments/locales/es.json` is created and the plugin starts again
- **THEN** `payments` is a discovered namespace, with no configuration change

### Requirement: Narrowing and naming discovery
The plugin SHALL accept these optional discovery options:
- `include`: a list of folder globs, default `["src/**/locales"]`;
- `exclude`: a list of folder globs removed from the search;
- `namespaces`: a map from a folder path to an explicit namespace name.

Globs and paths are relative to the Vite root; `*` matches one path segment and `**` matches any number of segments. A folder listed in `namespaces` is a namespace with that name even when it is not called `locales` or is not matched by `include`. The built-in exclusions always apply.

#### Scenario: Exclude a legacy folder
- **WHEN** the plugin is configured with `exclude: ["src/legacy/**"]` and `src/legacy/old/locales/` exists
- **THEN** `old` is not a discovered namespace

#### Scenario: Only features
- **WHEN** the plugin is configured with `include: ["src/features/*/locales"]`
- **THEN** `src/common/locales/` is not a namespace and every `src/features/<module>/locales/` is

#### Scenario: Explicit name
- **WHEN** the plugin is configured with `namespaces: { "src/shared/i18n": "shared" }`
- **THEN** the JSON files of `src/shared/i18n/` form the namespace `shared`

### Requirement: Language discovery
The languages SHALL be the base names of the `.json` files directly inside the namespace folders (`es.json` → `es`), across all namespaces. Files with another extension MUST be ignored. Each JSON file MUST contain an object. A file that is not valid JSON, or that does not contain an object, MUST fail the build with an error naming the file. In development it MUST be reported as an error message, and the server must keep running.

#### Scenario: Languages from file names
- **WHEN** the namespaces contain `es.json` and `en.json`
- **THEN** the discovered languages are `en` and `es`

#### Scenario: Invalid JSON
- **WHEN** `src/features/auth/locales/en.json` contains invalid JSON and `vite build` runs
- **THEN** the build fails and the error names that file

### Requirement: Invalid configuration
The plugin SHALL fail with an error that names the problem in these cases:
- two folders resolve to the same namespace name (the error names both folders);
- `typesFrom` is not one of the discovered languages;
- `defaultNamespace` is given but is not one of the discovered namespaces;
- no namespace is found.

#### Scenario: Name collision
- **WHEN** both `src/common/locales/` and `src/features/common/locales/` exist with the default discovery
- **THEN** the plugin fails with an error naming `common` and both folders

#### Scenario: Unknown reference language
- **WHEN** the plugin is configured with `typesFrom: "fr"` and no `fr.json` exists
- **THEN** the plugin fails with an error naming `fr` and the discovered languages

### Requirement: Virtual module contract
The plugin SHALL serve a module `virtual:aureus-i18n` whose default export describes the discovered resources:
- the list of languages;
- the list of namespaces;
- the default namespace, if configured;
- a function that loads the content of one language and namespace on demand, and resolves to an empty object when that file does not exist;
- a way to subscribe to text updates during development.

Each language/namespace file MUST be loaded as a separate chunk, only when it is requested.

#### Scenario: Lazy file loading
- **WHEN** the app requests the content of language `es` and namespace `auth` from the virtual module
- **THEN** only `src/features/auth/locales/es.json` is fetched, and no other locale file

#### Scenario: Missing file
- **WHEN** the app requests language `en` and namespace `auth`, and `en.json` does not exist there
- **THEN** the request resolves to an empty object

### Requirement: Generated types for `t()`
The plugin SHALL write a TypeScript declaration file, by default `src/types/i18next.d.ts` or the path given in `typesFile`. The file augments i18next's type options so that:
- every discovered namespace is a valid namespace, and any other name is a type error;
- the keys of each namespace are those of its `typesFrom` file, nested keys included, and any other key is a type error;
- string values are literal types, so interpolation placeholders are type-checked;
- the configured `defaultNamespace`, if any, is i18next's default namespace.

The file MUST be regenerated on every plugin start and build, and it MUST be rewritten only when its content changes. Its output MUST be deterministic: the same inputs produce byte-identical content, with namespaces and keys sorted. It MUST start with a comment saying it is generated and must not be edited by hand.

#### Scenario: Valid key
- **WHEN** `src/features/auth/locales/es.json` contains `{ "login": { "title": "Entrar" } }`, `typesFrom` is `es` and a component calls `useTranslation("auth")` and then `t("login.title")`
- **THEN** the call type-checks, and the editor offers `login.title` as a completion

#### Scenario: Unknown key or namespace
- **WHEN** a component calls `t("login.titel")` after `useTranslation("auth")`, or calls `useTranslation("nope")`
- **THEN** TypeScript reports an error

#### Scenario: Typed interpolation
- **WHEN** the `typesFrom` value of `welcome` is `"Hola, {{name}}"` and a component calls `t("welcome")` without `name`
- **THEN** TypeScript reports an error, and `t("welcome", { name: "Ana" })` type-checks

#### Scenario: Unchanged content is not rewritten
- **WHEN** the plugin starts twice with the same locale files
- **THEN** the second start does not modify the declaration file

### Requirement: Key parity between languages
For each namespace, the plugin SHALL compare every language's flattened keys with the `typesFrom` language. It SHALL report:
- each key missing in a language;
- each key present in a language but not in `typesFrom`;
- each language file missing in a namespace.

Plural forms MUST be compared by their base key, because languages use different plural categories. Plural keys are those ending in `_zero`, `_one`, `_two`, `_few`, `_many` or `_other`, including the `_ordinal_` variants. A plural key counts as present when the language has at least one plural form of that base key.

During development the report MUST be a warning in the terminal, logged again only when the locale files change. During `vite build` any finding MUST fail the build with an error that lists every finding, grouped by namespace and language.

#### Scenario: Missing key in development
- **WHEN** the dev server is running and the key `login.title` is removed from `src/features/auth/locales/en.json`
- **THEN** a warning in the terminal names the namespace `auth`, the language `en` and the key `login.title`, and the server keeps running

#### Scenario: Missing key in build
- **WHEN** `vite build` runs while `en.json` of `auth` lacks `login.title`
- **THEN** the build fails and its error lists `auth`, `en` and `login.title`

#### Scenario: Missing language file
- **WHEN** `src/features/payments/locales/` contains `es.json` but not `en.json`
- **THEN** the report says that `payments` has no `en` file

#### Scenario: Different plural categories
- **WHEN** `typesFrom` is `en` with `items_one` and `items_other`, and `ar.json` has `items_zero`, `items_one`, `items_two`, `items_few`, `items_many` and `items_other`
- **THEN** no finding is reported for `items`

#### Scenario: Languages in sync
- **WHEN** every language has exactly the keys of `typesFrom` in every namespace
- **THEN** no warning is logged and the build succeeds

### Requirement: Development update loop
While the Vite dev server runs, the plugin SHALL watch the discovered namespace folders and the places where new ones can appear:
- when a namespace folder or a language file is added or removed, it repeats discovery, regenerates the declaration file, reruns the parity check and fully reloads the page;
- when the content of a language file changes, it regenerates the declaration file, reruns the parity check and sends the change to the page without a full reload. The page then shows the new texts.

#### Scenario: New module while developing
- **WHEN** the dev server is running and `src/features/payments/locales/es.json` and `en.json` are created
- **THEN** the page reloads, `useTranslation("payments")` returns the new texts, and the declaration file includes `payments`

#### Scenario: Text edited while developing
- **WHEN** the dev server is running and the value of `login.title` in `src/features/auth/locales/es.json` is changed while the page shows it in Spanish
- **THEN** the page shows the new value without a full reload

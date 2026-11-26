## Purpose

Defines the public contract of `@aureus-core/i18n`: how consumers import its Vite plugin, its browser runtime and its virtual-module types, which peers each entry point needs, and the rules all its code follows.

## ADDED Requirements

### Requirement: Entry points
`@aureus-core/i18n` SHALL be published as an ESM-only package with exactly three public entry points:
- `@aureus-core/i18n/vite`, the build-time plugin, with JavaScript and type declarations;
- `@aureus-core/i18n/runtime`, the browser runtime, with JavaScript and type declarations;
- `@aureus-core/i18n/client`, type declarations only, which declare the virtual module `virtual:aureus-i18n`.

The package MUST NOT expose a root entry point, and it MUST NOT expose its private shared code. The runtime entry point MUST NOT import any Node built-in module, so an app bundle never contains build-time code.

#### Scenario: Importing the plugin
- **WHEN** a consumer writes `import { aureusI18n } from "@aureus-core/i18n/vite"` in a `vite.config.ts` resolving with `bundler` or `node16`
- **THEN** the import resolves to ESM code and its type declarations

#### Scenario: Importing the runtime
- **WHEN** a consumer writes `import { createI18n } from "@aureus-core/i18n/runtime"` in browser code
- **THEN** the import resolves to ESM code and its type declarations, and the bundled output contains no Node built-in module

#### Scenario: Virtual module types
- **WHEN** a consumer adds `@aureus-core/i18n/client` to the `types` of its tsconfig and writes `import resources from "virtual:aureus-i18n"`
- **THEN** TypeScript types `resources` as the runtime's resources contract, without errors

#### Scenario: No root import
- **WHEN** a consumer writes `import { createI18n } from "@aureus-core/i18n"`
- **THEN** module resolution fails, because the package has no root entry point

#### Scenario: Private code stays private
- **WHEN** a consumer tries to import `@aureus-core/i18n/internal/utils`
- **THEN** module resolution fails

### Requirement: Peer dependencies
The package SHALL declare these required peer dependencies:
- `i18next`;
- `react-i18next`;
- `react` version 19.

It SHALL declare `vite` as an optional peer dependency, needed only by the `vite` entry point. The package MUST NOT have runtime dependencies.

#### Scenario: Installing the package
- **WHEN** `@aureus-core/i18n` is installed with `i18next`, `react-i18next` and React 19
- **THEN** no other package is installed with it, and the package manager does not report a missing required peer

#### Scenario: Runtime without Vite at runtime
- **WHEN** an app bundle imports only `@aureus-core/i18n/runtime`
- **THEN** the bundle contains no code from `vite`

### Requirement: No default texts
The package SHALL NOT produce user-facing text of its own in any language. Every text an app shows MUST come from the app's own locale files. Only messages addressed to developers MAY be hard-coded, in English. These are development warnings, plugin warnings and errors, and errors thrown for invalid configuration.

#### Scenario: Missing translation
- **WHEN** a key is missing in every language
- **THEN** the package shows no text of its own in its place; i18next's own fallback behavior applies

### Requirement: Development-only runtime warnings
When the runtime detects a misuse, it SHALL log a `console.warn` that starts with the function's name in brackets (for example `[createI18n]`), only outside production builds. The same warning MUST be logged only once per process. Production builds MUST NOT log these warnings.

#### Scenario: Repeated misuse warns once
- **WHEN** the same runtime misuse happens twice in development
- **THEN** one warning is logged

#### Scenario: Production build
- **WHEN** the consumer's bundle is built with `NODE_ENV=production` and a runtime misuse happens
- **THEN** nothing is logged

### Requirement: Published contents are build output only
The packed package SHALL contain only the build output, the static client type declarations and the package metadata files. It MUST NOT contain sources, tests, or test helpers. The package's output check MUST verify:
- the JavaScript entry points have JavaScript and type declarations, and the client entry point has its type declarations;
- no internal path alias is left in the output;
- the package passes packaging lint and type-resolution checks for ESM consumers;
- the private layer and the root do not resolve;
- the tarball contents.

#### Scenario: Missing entry point output fails the check
- **WHEN** the `runtime` source exists but its compiled `index.js` is missing from the output
- **THEN** the package output check fails and names the entry point

#### Scenario: Tests are not published
- **WHEN** the package is packed
- **THEN** no `*-tests` file and no `tests/` folder is in the tarball

## Purpose

Defines the public contract of `@aureus-core/hooks`: reusable React hooks shared by every Aureus project, how consumers import each module, which peers each module needs, and the rules all modules follow.

## ADDED Requirements

### Requirement: One entry point per module
`@aureus-core/hooks` SHALL be published as an ESM-only package. Each public module MUST be importable as `@aureus-core/hooks/<module>`, with JavaScript and type declarations. The package MUST NOT expose a root entry point or a root barrel, and it MUST NOT expose its private shared code. The first release SHALL contain the module `schema-form`. Adding a module MUST NOT require editing the package's export configuration.

#### Scenario: Importing a module
- **WHEN** a consumer writes `import { createFormHook } from "@aureus-core/hooks/schema-form"` in a TypeScript project resolving with `bundler` or `node16`
- **THEN** the import resolves to ESM code and its type declarations

#### Scenario: No root import
- **WHEN** a consumer writes `import { createFormHook } from "@aureus-core/hooks"`
- **THEN** module resolution fails, because the package has no root entry point

#### Scenario: Private code stays private
- **WHEN** a consumer tries to import `@aureus-core/hooks/internal/utils/helpers`
- **THEN** module resolution fails

### Requirement: Peer dependencies per module
The package SHALL declare `react` (version 19) as a required peer dependency and MUST NOT have runtime dependencies. Libraries needed only by some modules MUST be declared as optional peer dependencies. The `schema-form` module needs `react-hook-form` 7, `zod` 4 and `@hookform/resolvers` 7. A consumer that does not import a module MUST NOT need that module's peers.

#### Scenario: Installing the package
- **WHEN** `@aureus-core/hooks` is installed in a React 19 project
- **THEN** no other package is installed with it, and the package manager does not report `react-hook-form`, `zod` or `@hookform/resolvers` as missing required peers

#### Scenario: Using schema-form
- **WHEN** a consumer imports `@aureus-core/hooks/schema-form` with `react-hook-form`, `zod` and `@hookform/resolvers` installed
- **THEN** the module works without any other dependency

### Requirement: No default texts
No module SHALL produce user-facing text of its own in any language. Every text a hook shows or stores (such as validation messages) MUST come from the consumer, for example from the schema. Only messages addressed to developers (development warnings) MAY be hard-coded, in English.

#### Scenario: Messages come from the schema
- **WHEN** a form built with `schema-form` fails validation
- **THEN** every error message is the one written in the consumer's schema or server errors, never a text from the package

### Requirement: Development-only warnings
A module that detects a misuse at runtime SHALL log a `console.warn` that starts with the hook's name in brackets (for example `[useSchemaForm]`), only outside production builds. The same warning MUST be logged only once per process. Production builds MUST NOT log these warnings.

#### Scenario: Repeated misuse warns once
- **WHEN** the same misuse happens twice in development
- **THEN** one warning is logged

#### Scenario: Production build
- **WHEN** the consumer's bundle is built with `NODE_ENV=production` and a misuse happens
- **THEN** nothing is logged

### Requirement: Published contents are build output only
The packed package SHALL contain only the build output and the package metadata files. It MUST NOT contain sources, tests, or test helpers. The package's output check MUST verify:
- every public module has JavaScript and type declarations;
- no internal path alias is left in the output;
- the package passes packaging lint and type-resolution checks for ESM consumers;
- the private layer does not resolve;
- the tarball contents.

#### Scenario: Missing module output fails the check
- **WHEN** a public module folder exists in the source but its compiled `index.js` is missing from the output
- **THEN** the package output check fails and names the module

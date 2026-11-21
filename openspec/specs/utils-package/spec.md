# utils-package Specification

## Purpose
Defines the public contract of `@aureus-core/utils`: framework-free functions shared by every Aureus project, how consumers import each module, and the locale and time-zone rules that all modules follow.

## Requirements

### Requirement: One entry point per module
`@aureus-core/utils` SHALL be published as an ESM-only package. Each public module MUST be importable as `@aureus-core/utils/<module>`, with JavaScript and type declarations. The package MUST NOT expose a root entry point or a root barrel, and it MUST NOT expose its private shared code. The first release SHALL contain the modules `date-formats` and `display`.

#### Scenario: Importing a module
- **WHEN** a consumer writes `import { createDisplay } from "@aureus-core/utils/display"` in a TypeScript project resolving with `bundler` or `node16`
- **THEN** the import resolves to ESM code and its type declarations

#### Scenario: No root import
- **WHEN** a consumer writes `import { createDisplay } from "@aureus-core/utils"`
- **THEN** module resolution fails, because the package has no root entry point

#### Scenario: Private code stays private
- **WHEN** a consumer tries to import `@aureus-core/utils/internal`
- **THEN** module resolution fails

### Requirement: Framework-free and dependency-free
The package SHALL have no runtime dependencies and no peer dependencies, and it MUST NOT import React or any other UI framework. It MUST rely only on standard JavaScript and the `Intl` API, so it runs in browsers and in Node.js 24 or later.

#### Scenario: Installing the package
- **WHEN** `@aureus-core/utils` is installed in an empty project
- **THEN** no other package is installed with it

#### Scenario: Running outside a browser
- **WHEN** a module is imported and called in Node.js 24 with no DOM
- **THEN** it returns the same results it returns in a browser for the same locale and time zone

### Requirement: Locale and time zone are never fixed
No module SHALL hard-code a locale or a time zone. Every function that depends on the language MUST accept a `locale` that is a BCP 47 tag, a list of tags, or a function returning either of those (or `undefined`). A function locale MUST be evaluated on every call, not when the formatter is created. When no locale is given, or the function returns `undefined`, the runtime's default locale MUST be used. Every function that depends on the time zone MUST accept an optional IANA `timeZone`. When none is given, the runtime's time zone MUST be used.

#### Scenario: Locale follows the app's language at runtime
- **WHEN** a formatter is created with `locale: () => current`, a value is formatted while `current` is `"es"`, and then again after `current` becomes `"en"`
- **THEN** the first result is in Spanish and the second is in English, without creating a new formatter

#### Scenario: No locale given
- **WHEN** a formatter is created without `locale`
- **THEN** its results use the runtime's default locale

#### Scenario: No time zone given
- **WHEN** a `Date` is formatted without `timeZone`
- **THEN** it is shown in the runtime's time zone

### Requirement: No default texts
No module SHALL produce visible text of its own in any language. Every text a function needs, such as the text shown for a missing value or the labels of a boolean, MUST be supplied by the consumer, and TypeScript MUST reject a call or a configuration that omits a required text. Only messages addressed to developers (development warnings) MAY be hard-coded, in English.

#### Scenario: Missing required text
- **WHEN** a consumer creates a display without `empty`
- **THEN** TypeScript reports an error

### Requirement: Development-only warnings
A module that detects a misuse at runtime (an invalid value, an unknown option) SHALL log a `console.warn` that starts with the module name, only outside production builds. The same warning MUST be logged only once per process. Production builds MUST NOT log these warnings.

#### Scenario: Repeated misuse warns once
- **WHEN** the same invalid value is formatted twice in development
- **THEN** one warning is logged

#### Scenario: Production build
- **WHEN** the consumer's bundle is built with `NODE_ENV=production` and an invalid value is formatted
- **THEN** nothing is logged

### Requirement: Published contents are build output only
The packed package SHALL contain only the build output and the package metadata files. It MUST NOT contain sources, tests, or test helpers. The package's output check MUST verify:
- every public module has JavaScript and type declarations;
- no internal path alias is left in the output;
- the package passes packaging lint and type-resolution checks for ESM consumers;
- the tarball contents.

#### Scenario: Missing module output fails the check
- **WHEN** a public module folder exists in the source but its compiled `index.js` is missing from the output
- **THEN** the package output check fails and names the module

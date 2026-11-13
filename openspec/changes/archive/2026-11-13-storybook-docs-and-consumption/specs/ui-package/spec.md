## ADDED Requirements

### Requirement: Verified package output
After every build, the package SHALL be checked automatically. The check fails unless all of the following hold:
- every installed shadcn component and hook has both a compiled ES module and a type declaration at the path its public import resolves to;
- no output file contains an unresolved internal alias;
- packaging metadata passes a package linter;
- every public import path resolves with types under ESM consumer resolution;
- the packed tarball contains only build output and package metadata files.

The check MUST run locally through a single package command and in CI.

#### Scenario: Missing component output fails the check
- **WHEN** an installed shadcn component has no compiled module or no type declaration in the build output
- **THEN** the package-output check fails and names the component

#### Scenario: Leaked alias fails the check
- **WHEN** a build output file contains an import starting with `@/`
- **THEN** the package-output check fails and names the file

#### Scenario: Every installed component is importable by a consumer
- **WHEN** the packed tarball is installed in a fresh Vite + React + Tailwind v4 project
- **THEN** each `@aureus-core/ui/shadcn/<name>` path for an installed component and each `@aureus-core/ui/hooks/<name>` path for an installed hook resolves with types, and the project's production build succeeds

### Requirement: Runtime dependencies are used and documented
Every entry in the package's runtime `dependencies` SHALL be imported by at least one file in the build output, or referenced by the shipped stylesheet. Libraries that only examples or stories use MUST NOT be runtime dependencies. The package documentation MUST list consumer requirements: peer dependencies, the stylesheet import, the providers some components require (tooltip, sidebar and direction providers), dark-mode activation and theme overrides.

#### Scenario: Example-only library is not shipped
- **WHEN** a library is used only by playground stories (for example, a date-formatting or table-state library)
- **THEN** it is a development dependency of the playground and does not appear in the package's runtime `dependencies`

#### Scenario: Consumer learns provider requirements
- **WHEN** a consumer reads the package documentation before using the tooltip or sidebar components
- **THEN** the documentation states which provider must wrap them and shows the import for that provider

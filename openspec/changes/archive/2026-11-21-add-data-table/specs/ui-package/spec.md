## MODIFIED Requirements

### Requirement: Runtime dependencies are used and documented
Every entry in the package's runtime `dependencies` SHALL be imported by at least one file in the build output, or referenced by the shipped stylesheet. Libraries that only examples or stories use MUST NOT be runtime dependencies.

A library that only some shipped components import, and that the consumer's own code also uses with those components, MUST be an **optional peer dependency** (`peerDependencies` plus `peerDependenciesMeta.optional`), not a runtime dependency. That way it is installed only by consumers of those components, and the app and the package share one copy. `@tanstack/react-table` (`^9`) is such a dependency, for `DataTable`.

The package documentation MUST list consumer requirements:
- peer dependencies, saying which are optional and which components need them;
- the stylesheet import;
- the providers some components require: the tooltip, sidebar and direction providers, and the react-hook-form `FormProvider` around form controls;
- dark-mode activation and theme overrides.

#### Scenario: Example-only library is not shipped
- **WHEN** a library is used only by playground stories (for example, a date-formatting library)
- **THEN** it is a development dependency of the playground and does not appear in the package's runtime `dependencies` or `peerDependencies`

#### Scenario: Optional peer for one component
- **WHEN** a consumer installs `@aureus-core/ui` without `@tanstack/react-table` and never imports `DataTable`
- **THEN** the package manager reports no missing peer dependency, and the app builds and runs

#### Scenario: Consumer of the data table installs its peer
- **WHEN** a consumer reads the package documentation before using `DataTable`
- **THEN** the documentation states that `@tanstack/react-table` `^9` must be installed for it

#### Scenario: Consumer learns provider requirements
- **WHEN** a consumer reads the package documentation before using the tooltip or sidebar components
- **THEN** the documentation states which provider must wrap them and shows the import for that provider

#### Scenario: Consumer learns form control requirements
- **WHEN** a consumer reads the package documentation before using a form control
- **THEN** the documentation states that `react-hook-form` must be installed and that controls must be rendered inside its `FormProvider`

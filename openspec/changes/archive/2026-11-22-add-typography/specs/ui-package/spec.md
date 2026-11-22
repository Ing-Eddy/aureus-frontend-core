## MODIFIED Requirements

### Requirement: Consumer stylesheet
The package SHALL ship one stylesheet entry, `@aureus-core/ui/styles.css`. It loads Tailwind CSS v4, the shadcn base tokens, the author's theme overrides and the typography tokens and classes. It also makes the consumer's Tailwind build generate every utility class the package's components use, including classes used only by the private shared layer. Theme overrides MUST be applied after the shadcn base tokens, and the typography layer MUST be applied after the theme overrides. React, React DOM, Tailwind CSS and react-hook-form MUST be peer dependencies.

#### Scenario: Consumer renders styled components
- **WHEN** a fresh Vite + React + Tailwind v4 app imports `@aureus-core/ui/styles.css` in place of its own Tailwind import and renders a shadcn `Button` from the package
- **THEN** the button is styled correctly in both the dev server and the production build

#### Scenario: Theme override wins
- **WHEN** a CSS variable is redefined in the package's theme overrides
- **THEN** components render with the overridden value, not the shadcn default

#### Scenario: Form library is required from the consumer
- **WHEN** a consumer installs `@aureus-core/ui` without `react-hook-form`
- **THEN** the package manager reports `react-hook-form` as a missing peer dependency

#### Scenario: Typography classes are available
- **WHEN** a consumer imports only `@aureus-core/ui/styles.css` and renders `<p class="typography-h1">`
- **THEN** the paragraph has the `h1` typography style in both the dev server and the production build

#### Scenario: App typography file overrides the package
- **WHEN** an app imports a stylesheet that redefines typography variables after `@aureus-core/ui/styles.css`
- **THEN** the package's typography classes and font utilities use the app's values

### Requirement: Runtime dependencies are used and documented
Every entry in the package's runtime `dependencies` SHALL be imported by at least one file in the build output, or referenced by the shipped stylesheet. Libraries that only examples or stories use MUST NOT be runtime dependencies. The bundled font packages, `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`, are referenced by the shipped stylesheet.

A library that only some shipped components import, and that the consumer's own code also uses with those components, MUST be an **optional peer dependency** (`peerDependencies` plus `peerDependenciesMeta.optional`), not a runtime dependency. That way it is installed only by consumers of those components, and the app and the package share one copy. `@tanstack/react-table` (`^9`) is such a dependency, for `DataTable`.

The package documentation MUST list consumer requirements:
- peer dependencies, saying which are optional and which components need them;
- the stylesheet import;
- the providers some components require: the tooltip, sidebar and direction providers, and the react-hook-form `FormProvider` around form controls;
- dark-mode activation and theme overrides;
- how to replace the bundled fonts: install the font package and override the typography font variables.

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

#### Scenario: Consumer replaces the bundled fonts
- **WHEN** a consumer reads the package documentation before changing the fonts
- **THEN** the documentation shows the font package install and the font variables to override, after the package stylesheet

# ui-package Specification

## Purpose
Defines the public contract of `@aureus-core/ui`: a shadcn-based component layer kept updatable by the shadcn CLI, the author's own components layered on top, and how consumers import code and styles.

## Requirements

### Requirement: CLI-owned shadcn layer
Everything the shadcn CLI generates (components, hooks, utilities and the base stylesheet) SHALL be written only inside `packages/ui/src/shadcn/` and `packages/ui/src/styles/shadcn.css`. These files MUST NOT be edited by hand. A notice inside `src/shadcn/` MUST state this rule.

#### Scenario: Adding a component stays inside the boundary
- **WHEN** a shadcn component is added through the package's add script
- **THEN** the only files created or changed are under `src/shadcn/` or `src/styles/shadcn.css`, plus dependency entries in the package manifest

#### Scenario: Updating installed components
- **WHEN** the package's update script runs
- **THEN** every installed shadcn component is regenerated from upstream with overwrite enabled, and the resulting diff shows only upstream changes on a tree with no hand edits

### Requirement: Custom components compose the shadcn layer
The author's components SHALL live in `packages/ui/src/components/` and MAY import from the shadcn layer and from the private shared layer (`packages/ui/src/internal/`). Code in the shadcn layer MUST NOT import from `src/components/` or `src/internal/`. Code in `src/internal/` MAY import from the shadcn layer and MUST NOT import from `src/components/`. To customise a shadcn component, the author MUST use, in order of preference: overriding theme tokens, wrapping the component, or forking it into `src/components/` under a new name.

#### Scenario: Customisation survives a shadcn update
- **WHEN** a custom component wraps a shadcn primitive and the update script regenerates that primitive
- **THEN** the custom component's source file is unchanged

#### Scenario: Layers depend in one direction
- **WHEN** the package source is inspected
- **THEN** no file under `src/shadcn/` imports from `src/internal/` or `src/components/`, and no file under `src/internal/` imports from `src/components/`

### Requirement: Per-folder component barrels
Each custom component SHALL live in its own kebab-case folder under `src/components/` with an `index.ts` that is its only public entry point. Within the package, a component MUST be imported through its folder's `index.ts`. There MUST NOT be a root barrel that re-exports every component.

#### Scenario: Importing a component and its types
- **WHEN** a consumer imports from `@aureus-core/ui/components/<name>`
- **THEN** they receive the runtime exports and type exports that the folder's `index.ts` re-exports, and nothing else from that folder

### Requirement: Pure kebab-case file naming
All source files written by hand SHALL use pure kebab-case names, with role suffixes joined by a hyphen: `<name>-types.ts`, `<name>-tests.tsx` (or `.ts`), `<name>-stories.tsx`. Dot-separated role suffixes such as `.types.ts`, `.test.tsx` or `.stories.tsx` MUST NOT be used.

#### Scenario: Test files are discovered
- **WHEN** a file named `<name>-tests.tsx` exists under `src/`
- **THEN** the test command runs it

#### Scenario: Test files are not published
- **WHEN** the package is built
- **THEN** no `*-tests.*` file is in the build output

### Requirement: Public import paths
The package SHALL expose these import paths and no others: `@aureus-core/ui/shadcn/<name>` for each shadcn component, `@aureus-core/ui/components/<name>` for each custom component, `@aureus-core/ui/hooks/<name>` for shadcn-installed hooks, `@aureus-core/ui/lib/utils` for the class-merge utility, and `@aureus-core/ui/styles.css`. Each path MUST resolve to compiled ES modules with TypeScript declarations. A newly added component MUST be importable without editing the export configuration.

#### Scenario: Newly added component is importable
- **WHEN** a shadcn component named `card` is added and the package is rebuilt
- **THEN** `import { Card } from "@aureus-core/ui/shadcn/card"` resolves, with types, in a consumer project

#### Scenario: Internal aliases do not leak
- **WHEN** the package is built
- **THEN** no output file contains an unresolved internal path alias such as `@/`

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

### Requirement: Private shared layer
Building blocks shared by several custom components SHALL live in `packages/ui/src/internal/`. This layer MUST NOT be reachable through any public import path: it is compiled with the package so that public components can use it, but consumers cannot import it. It MUST be organized by category: `components/`, `hooks/`, `types/` and `utils/`. `utils/` is split into `constants/`, `helpers/` and `libs/`. Each category and sub-category folder MUST have an `index.ts`, and other code MUST import internal resources through those `index.ts` files. Empty category folders MUST NOT be created.

#### Scenario: Internal code is not importable
- **WHEN** a consumer tries to import `@aureus-core/ui/internal/components`
- **THEN** module resolution fails because the path is not exported

#### Scenario: Public component works with internal code
- **WHEN** a consumer imports `TextField` from `@aureus-core/ui/components/text-field` in a production build
- **THEN** the build succeeds and the component renders, with the internal code it uses resolved through relative imports inside the package

### Requirement: Component folder structure
Every component folder, public (`src/components/<name>/`) or internal (`src/internal/components/<name>/`), SHALL have only `index.ts` and `<name>.tsx` at its root, with these exceptions:
- a `<name>-types.ts` file MAY stay at the root while it is simple;
- a single `<name>-tests.tsx` (or `.ts`) file MAY stay at the root while it is simple.

Any other code the component needs MUST go in category subfolders: `components/`, `hooks/`, `types/` and `utils/`, each with its own `index.ts`. When tests are split across several files, they MUST go in a `tests/` subfolder.

#### Scenario: Growing component gets subfolders
- **WHEN** a component needs a private sub-component and a private hook
- **THEN** they are placed in its `components/` and `hooks/` subfolders, each with an `index.ts`, and the folder root still holds only `index.ts`, `<name>.tsx` and, if simple, `<name>-types.ts`

#### Scenario: Split tests
- **WHEN** a component's tests are split into several files
- **THEN** all of them live in its `tests/` subfolder, are run by the test command, and none of them is in the build output

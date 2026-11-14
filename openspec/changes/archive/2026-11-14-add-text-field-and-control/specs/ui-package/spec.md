## MODIFIED Requirements

### Requirement: Custom components compose the shadcn layer
The author's components SHALL live in `packages/ui/src/components/` and MAY import from the shadcn layer and from the private shared layer (`packages/ui/src/internal/`). Code in the shadcn layer MUST NOT import from `src/components/` or `src/internal/`. Code in `src/internal/` MAY import from the shadcn layer and MUST NOT import from `src/components/`. To customise a shadcn component, the author MUST use, in order of preference: overriding theme tokens, wrapping the component, or forking it into `src/components/` under a new name.

#### Scenario: Customisation survives a shadcn update
- **WHEN** a custom component wraps a shadcn primitive and the update script regenerates that primitive
- **THEN** the custom component's source file is unchanged

#### Scenario: Layers depend in one direction
- **WHEN** the package source is inspected
- **THEN** no file under `src/shadcn/` imports from `src/internal/` or `src/components/`, and no file under `src/internal/` imports from `src/components/`

### Requirement: Consumer stylesheet
The package SHALL ship one stylesheet entry, `@aureus-core/ui/styles.css`. It loads Tailwind CSS v4, the shadcn base tokens and the author's theme overrides, and it makes the consumer's Tailwind build generate every utility class the package's components use, including classes used only by the private shared layer. Theme overrides MUST be applied after the shadcn base tokens. React, React DOM, Tailwind CSS and react-hook-form MUST be peer dependencies.

#### Scenario: Consumer renders styled components
- **WHEN** a fresh Vite + React + Tailwind v4 app imports `@aureus-core/ui/styles.css` in place of its own Tailwind import and renders a shadcn `Button` from the package
- **THEN** the button is styled correctly in both the dev server and the production build

#### Scenario: Theme override wins
- **WHEN** a CSS variable is redefined in the package's theme overrides
- **THEN** components render with the overridden value, not the shadcn default

#### Scenario: Form library is required from the consumer
- **WHEN** a consumer installs `@aureus-core/ui` without `react-hook-form`
- **THEN** the package manager reports `react-hook-form` as a missing peer dependency

### Requirement: Runtime dependencies are used and documented
Every entry in the package's runtime `dependencies` SHALL be imported by at least one file in the build output, or referenced by the shipped stylesheet. Libraries that only examples or stories use MUST NOT be runtime dependencies. The package documentation MUST list consumer requirements: peer dependencies, the stylesheet import, the providers some components require (tooltip, sidebar and direction providers, and the react-hook-form `FormProvider` around form controls), dark-mode activation and theme overrides.

#### Scenario: Example-only library is not shipped
- **WHEN** a library is used only by playground stories (for example, a date-formatting or table-state library)
- **THEN** it is a development dependency of the playground and does not appear in the package's runtime `dependencies`

#### Scenario: Consumer learns provider requirements
- **WHEN** a consumer reads the package documentation before using the tooltip or sidebar components
- **THEN** the documentation states which provider must wrap them and shows the import for that provider

#### Scenario: Consumer learns form control requirements
- **WHEN** a consumer reads the package documentation before using a form control
- **THEN** the documentation states that `react-hook-form` must be installed and that controls must be rendered inside its `FormProvider`

## ADDED Requirements

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

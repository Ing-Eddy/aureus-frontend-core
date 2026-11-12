# component-playground Specification

## Purpose
Provides an isolated, private environment for browsing, documenting and developing both shadcn base components and custom components, rendered with the package's real stylesheet.

## Requirements

### Requirement: Playground renders the built package
The playground SHALL consume `@aureus-core/ui` through its public import paths and its published stylesheet, exactly as a consumer would. It MUST NOT import the package's internal source files.

#### Scenario: Story uses public paths
- **WHEN** a story renders the shadcn `Button`
- **THEN** it imports from `@aureus-core/ui/shadcn/button` and the button shows the package's theme tokens

### Requirement: Live development loop
Running the root `dev` command SHALL rebuild the UI package on change and refresh the playground, without manual rebuilds.

#### Scenario: Edit reflects in playground
- **WHEN** a theme token in the package's theme overrides is changed while `dev` is running
- **THEN** the playground shows the new value without the developer running another command

### Requirement: Story organisation
Stories SHALL live in the playground app, not in the UI package. They are grouped into `shadcn/` and `components/` sections that mirror the package layers, and named `<name>-stories.tsx`.

#### Scenario: Stories never enter the CLI-owned layer
- **WHEN** a story is written for a shadcn component
- **THEN** it is created under the playground's `shadcn/` stories folder and nothing is added to `packages/ui/src/shadcn/`

### Requirement: Accessibility feedback
The playground SHALL report accessibility violations for every rendered story.

#### Scenario: Violation is surfaced
- **WHEN** a story renders an interactive element without an accessible name
- **THEN** the playground's accessibility panel lists the violation

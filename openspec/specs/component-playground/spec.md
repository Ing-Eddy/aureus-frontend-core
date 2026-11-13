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

### Requirement: Every installed component is documented
Every component installed in the package's shadcn layer SHALL have, in the playground:
- at least one story file;
- a documentation page placed under one of these categories: Actions, Forms, Overlays, Navigation, Data display, Feedback, Layout, AI/Chat.

An automated test MUST fail when an installed component lacks stories or documentation content.

#### Scenario: New component without stories fails the tests
- **WHEN** a shadcn component is added to the package and no story or documentation exists for it in the playground
- **THEN** the playground's test command fails and names the component

### Requirement: Component stories cover the component's surface
Each component's stories SHALL include a playground story whose controls change every public prop that the component's variants and states depend on. They MUST also include stories showing each visual variant and size, the disabled and invalid states where the component supports them, and at least one composition with other components that reflects real usage. Callback props MUST be observable from the playground's actions panel.

#### Scenario: Trying a variant from controls
- **WHEN** a user opens a component's playground story and changes its variant or size control
- **THEN** the rendered component updates to that variant or size without a reload

#### Scenario: Observing a callback
- **WHEN** a user interacts with a component whose story wires a callback prop
- **THEN** the call and its arguments appear in the actions panel

### Requirement: Component documentation content
Each component's documentation page SHALL present:
- a summary;
- when to use it and when not to;
- a copyable import snippet using the public import path;
- any required provider;
- the anatomy, listing its sub-components;
- an interactive playground;
- an API table for each sub-component (prop, type, default, description), with a link to the underlying primitive's documentation for inherited props;
- usage examples;
- an accessibility section with keyboard interactions and ARIA notes;
- theming notes naming the tokens the component uses.

#### Scenario: Developer finds how to import a component
- **WHEN** a developer opens the documentation page for the dialog component
- **THEN** the page shows an import snippet from `@aureus-core/ui/shadcn/dialog` naming the exported sub-components, and a control to copy it

### Requirement: Bilingual documentation with a locale switcher
All documentation prose (component pages, guides and foundations) SHALL be available in English and Spanish. The playground MUST offer a locale switcher in its toolbar. Switching locale MUST update the documentation currently shown without a page reload. English MUST be the default locale. A missing translation for any documentation entry MUST fail the playground's test command.

#### Scenario: Switching to Spanish
- **WHEN** a user viewing a component's documentation page selects "Español" in the locale switcher
- **THEN** the summary, guidance, API descriptions, accessibility notes and example descriptions are shown in Spanish without reloading the page

#### Scenario: Incomplete translation fails the tests
- **WHEN** a component's documentation defines an English entry with no Spanish counterpart
- **THEN** the playground's test command fails and names the component and entry

### Requirement: Theme, direction and viewport toolbars
The playground SHALL let users switch every story and documentation example between light and dark themes, between left-to-right and right-to-left direction, and between desktop and mobile viewports. It MUST do so by applying the same mechanisms a consumer uses: the `dark` class and the package's direction provider.

#### Scenario: Previewing dark mode
- **WHEN** a user selects the dark theme in the toolbar
- **THEN** stories render with the package's dark tokens

#### Scenario: Previewing right-to-left
- **WHEN** a user selects right-to-left direction in the toolbar
- **THEN** stories render mirrored, as they would inside the package's direction provider set to RTL

### Requirement: Stories run as automated tests
Every story SHALL be executed as an automated test in a real browser by the playground's test command. A test fails if:
- the story throws while rendering;
- its interaction script fails;
- an accessibility violation is reported.

Every interactive component MUST have an interaction script that checks its keyboard behaviour and its main state change. For overlays, the script MUST also check focus moving into the overlay and returning after it closes.

#### Scenario: Keyboard regression is caught
- **WHEN** a change makes a dialog no longer close on Escape
- **THEN** the dialog's story test fails

#### Scenario: Accessibility regression is caught
- **WHEN** a change makes a story render an interactive element without an accessible name
- **THEN** the story's test fails with the accessibility violation

### Requirement: Published documentation site
The playground SHALL be built and published as a static site on every push to the main branch. The package documentation MUST link to it.

#### Scenario: Docs update after merge
- **WHEN** a change to a story or documentation page is merged to main
- **THEN** the published site shows the change once the publishing workflow finishes

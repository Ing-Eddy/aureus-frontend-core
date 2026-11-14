## MODIFIED Requirements

### Requirement: Every installed component is documented
Every component installed in the package's shadcn layer, and every custom component in the package's `src/components/` folder, SHALL have, in the playground:
- at least one story file;
- a documentation page placed under one of these categories: Actions, Forms, Overlays, Navigation, Data display, Feedback, Layout, AI/Chat.

shadcn components are documented under the `shadcn/` section with their `@aureus-core/ui/shadcn/<name>` import path. Custom components are documented under the `components/` section with their `@aureus-core/ui/components/<name>` import path. Code in the package's private shared layer is not a component and is not documented. An automated test MUST fail when an installed or custom component lacks stories or documentation content.

#### Scenario: New component without stories fails the tests
- **WHEN** a shadcn component is added to the package and no story or documentation exists for it in the playground
- **THEN** the playground's test command fails and names the component

#### Scenario: New custom component without docs fails the tests
- **WHEN** a folder with an `index.ts` is added under `src/components/` and the playground has no story file or documentation for it under the `components/` section
- **THEN** the playground's test command fails and names the component

#### Scenario: Custom component docs use the public path
- **WHEN** the documentation of `text-field` is checked
- **THEN** its import path is `@aureus-core/ui/components/text-field`

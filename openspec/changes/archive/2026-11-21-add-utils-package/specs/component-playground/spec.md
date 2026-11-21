## MODIFIED Requirements

### Requirement: Playground renders the built package
The playground SHALL consume `@aureus-core/ui` through its public import paths and its published stylesheet, and `@aureus-core/utils` through its public module paths, exactly as a consumer would. It MUST NOT import either package's internal source files.

#### Scenario: Story uses public paths
- **WHEN** a story renders the shadcn `Button`
- **THEN** it imports from `@aureus-core/ui/shadcn/button` and the button shows the package's theme tokens

#### Scenario: Utils page uses public paths
- **WHEN** a story shows the date-format catalog
- **THEN** it imports from `@aureus-core/utils/date-formats`, not from the package's `src/`

### Requirement: Story organisation
Stories SHALL live in the playground app, not in the UI package. Component stories are grouped into `shadcn/` and `components/` sections that mirror the package layers. The documentation of `@aureus-core/utils` lives in a `utils/` section, with one page per public module, shown after the component sections. Interactive tools that are not package documentation live in a `tools/` section, shown last in the sidebar. Story files are named `<name>-stories.tsx`.

#### Scenario: Stories never enter the CLI-owned layer
- **WHEN** a story is written for a shadcn component
- **THEN** it is created under the playground's `shadcn/` stories folder and nothing is added to `packages/ui/src/shadcn/`

#### Scenario: Tools are separate from component docs
- **WHEN** a user browses the playground sidebar
- **THEN** a "Tools" section appears after the component sections and contains the theme builder

#### Scenario: Utils section
- **WHEN** a user browses the playground sidebar
- **THEN** a "utils" section appears after the component sections and before "Tools", with a page for `date-formats` and a page for `display`

### Requirement: Bilingual documentation with a locale switcher
All documentation prose (component pages, utils pages, guides and foundations) SHALL be available in English and Spanish. The playground MUST offer a locale switcher in its toolbar. Switching locale MUST update the documentation currently shown without a page reload. English MUST be the default locale. A missing translation for any documentation entry MUST fail the playground's test command.

#### Scenario: Switching to Spanish
- **WHEN** a user viewing a component's documentation page selects "Español" in the locale switcher
- **THEN** the summary, guidance, API descriptions, accessibility notes and example descriptions are shown in Spanish without reloading the page

#### Scenario: Incomplete translation fails the tests
- **WHEN** a component's documentation defines an English entry with no Spanish counterpart
- **THEN** the playground's test command fails and names the component and entry

#### Scenario: Utils page missing a translation
- **WHEN** a utils page has a section in English with no Spanish counterpart
- **THEN** the playground's test command fails and names the page

#### Scenario: Live catalog follows the locale
- **WHEN** a user viewing the date-formats catalog story switches the toolbar to "Español"
- **THEN** every example in the table is shown in Spanish without reloading the page

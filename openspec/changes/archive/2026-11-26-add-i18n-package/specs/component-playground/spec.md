## MODIFIED Requirements

### Requirement: Playground renders the built package
The playground SHALL consume `@aureus-core/ui` through its public import paths and its published stylesheet, and `@aureus-core/utils`, `@aureus-core/hooks` and `@aureus-core/i18n` through their public module paths, exactly as a consumer would. It MUST NOT import any package's internal source files.

#### Scenario: Story uses public paths
- **WHEN** a story renders the shadcn `Button`
- **THEN** it imports from `@aureus-core/ui/shadcn/button` and the button shows the package's theme tokens

#### Scenario: Utils page uses public paths
- **WHEN** a story shows the date-format catalog
- **THEN** it imports from `@aureus-core/utils/date-formats`, not from the package's `src/`

#### Scenario: Hooks page uses public paths
- **WHEN** a story renders a form built with `createFormHook`
- **THEN** it imports from `@aureus-core/hooks/schema-form` and renders `@aureus-core/ui` controls through their public paths

#### Scenario: I18n page uses public paths
- **WHEN** a story demonstrates `createI18n`
- **THEN** it imports from `@aureus-core/i18n/runtime`, not from the package's `src/`

### Requirement: Story organisation
Stories SHALL live in the playground app, not in the UI package. Component stories are grouped into `shadcn/` and `components/` sections that mirror the package layers. Package documentation lives in its own sections, each with one page per public module, shown after the component sections in this order:
- `utils/`, for `@aureus-core/utils`;
- `hooks/`, for `@aureus-core/hooks`;
- `i18n/`, for `@aureus-core/i18n`. Its guide covers the plugin and the runtime together.

Interactive tools that are not package documentation live in a `tools/` section, shown last in the sidebar. Code shared by several tools lives in `tools/shared/` and contains no story. Story files are named `<name>-stories.tsx`.

#### Scenario: Stories never enter the CLI-owned layer
- **WHEN** a story is written for a shadcn component
- **THEN** it is created under the playground's `shadcn/` stories folder and nothing is added to `packages/ui/src/shadcn/`

#### Scenario: Tools are separate from component docs
- **WHEN** a user browses the playground sidebar
- **THEN** a "Tools" section appears after the component sections and contains the theme builder and the typography builder

#### Scenario: Utils section
- **WHEN** a user browses the playground sidebar
- **THEN** a "utils" section appears after the component sections and before "Tools", with a page for `date-formats` and a page for `display`

#### Scenario: Hooks section
- **WHEN** a user browses the playground sidebar
- **THEN** a "hooks" section appears after "utils" and before "Tools", with a page for `schema-form` (a guide and its live examples)

#### Scenario: I18n section
- **WHEN** a user browses the playground sidebar
- **THEN** an "i18n" section appears after "hooks" and before "Tools", with a guide and a live runtime demo

### Requirement: Bilingual documentation with a locale switcher
All documentation prose (component pages, utils pages, hooks pages, i18n pages, guides and foundations) SHALL be available in English and Spanish. The playground MUST offer a locale switcher in its toolbar. Switching locale MUST update the documentation currently shown without a page reload. English MUST be the default locale. A missing translation for any documentation entry MUST fail the playground's test command.

#### Scenario: Switching to Spanish
- **WHEN** a user viewing a component's documentation page selects "Español" in the locale switcher
- **THEN** the summary, guidance, API descriptions, accessibility notes and example descriptions are shown in Spanish without reloading the page

#### Scenario: Incomplete translation fails the tests
- **WHEN** a component's documentation defines an English entry with no Spanish counterpart
- **THEN** the playground's test command fails and names the component and entry

#### Scenario: Utils page missing a translation
- **WHEN** a utils, hooks or i18n page has a section in English with no Spanish counterpart
- **THEN** the playground's test command fails and names the page

#### Scenario: Live catalog follows the locale
- **WHEN** a user viewing the date-formats catalog story switches the toolbar to "Español"
- **THEN** every example in the table is shown in Spanish without reloading the page

#### Scenario: Form example follows the locale
- **WHEN** a user viewing the schema-form multilanguage story has submitted the form with errors and switches the toolbar to "Español"
- **THEN** the labels and the visible validation messages are shown in Spanish without reloading the page

#### Scenario: I18n demo labels follow the locale
- **WHEN** a user viewing the i18n runtime demo switches the toolbar to "Español"
- **THEN** the demo's own labels and help text are shown in Spanish without reloading the page

## MODIFIED Requirements

### Requirement: Story organisation
Stories SHALL live in the playground app, not in the UI package. Component stories are grouped into `shadcn/` and `components/` sections that mirror the package layers. Interactive tools that are not component documentation live in a `tools/` section, shown after them in the sidebar. Story files are named `<name>-stories.tsx`.

#### Scenario: Stories never enter the CLI-owned layer
- **WHEN** a story is written for a shadcn component
- **THEN** it is created under the playground's `shadcn/` stories folder and nothing is added to `packages/ui/src/shadcn/`

#### Scenario: Tools are separate from component docs
- **WHEN** a user browses the playground sidebar
- **THEN** a "Tools" section appears after the component sections and contains the theme builder

## ADDED Requirements

### Requirement: Bilingual interactive tools
Every interactive tool in the playground SHALL show its labels, help text, messages and reports in English and Spanish, following the toolbar's locale switcher without a page reload. A tool's UI string that is missing in one locale MUST fail the playground's test command.

#### Scenario: Switching the theme builder to Spanish
- **WHEN** a user viewing the theme builder selects "Español" in the locale switcher
- **THEN** the form labels, contrast summary, import report and export actions are shown in Spanish, and the edited theme is kept

#### Scenario: Missing tool translation fails the tests
- **WHEN** a theme builder UI string has an English entry with no Spanish counterpart
- **THEN** the playground's test command fails and names the string

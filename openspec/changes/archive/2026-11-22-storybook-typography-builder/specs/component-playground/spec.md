## MODIFIED Requirements

### Requirement: Story organisation
Stories SHALL live in the playground app, not in the UI package. Component stories are grouped into `shadcn/` and `components/` sections that mirror the package layers. The documentation of `@aureus-core/utils` lives in a `utils/` section, with one page per public module, shown after the component sections. Interactive tools that are not package documentation live in a `tools/` section, shown last in the sidebar. Code shared by several tools lives in `tools/shared/` and contains no story. Story files are named `<name>-stories.tsx`.

#### Scenario: Stories never enter the CLI-owned layer
- **WHEN** a story is written for a shadcn component
- **THEN** it is created under the playground's `shadcn/` stories folder and nothing is added to `packages/ui/src/shadcn/`

#### Scenario: Tools are separate from component docs
- **WHEN** a user browses the playground sidebar
- **THEN** a "Tools" section appears after the component sections and contains the theme builder and the typography builder

#### Scenario: Utils section
- **WHEN** a user browses the playground sidebar
- **THEN** a "utils" section appears after the component sections and before "Tools", with a page for `date-formats` and a page for `display`

## MODIFIED Requirements

### Requirement: Workspace layout
The repository SHALL organise code into three workspace groups: `packages/*` for publishable packages, `apps/*` for private applications, and `tooling/*` for private shared configuration and development tools. All internal dependencies MUST use the workspace protocol, so local packages are linked rather than downloaded.

#### Scenario: Internal package is linked locally
- **WHEN** an app in `apps/` declares a dependency on `@aureus-core/ui`
- **THEN** installing dependencies at the root links the local `packages/ui` and does not fetch it from the registry

## ADDED Requirements

### Requirement: Documented public API
Every publishable package SHALL document its public API with doc comments:
- every symbol exported by a public entry point and declared in the package's own source;
- every property of those exported types, including properties inherited from the package's own private types, and properties of object types written inline.

The package's test command MUST fail when one of them has no doc comment, naming the file, the line and the symbol or property. The check MUST NOT require comments for:
- properties typed `never`, which only exclude a property from a union;
- code owned by the shadcn CLI;
- declarations that come from third-party packages.

A property that several members of one union declare counts as documented when any of those declarations has a doc comment. The check MUST find new modules of a package without being configured for each one, and MUST fail when it finds no public entry point at all.

#### Scenario: Undocumented export
- **WHEN** a public module exports a new function without a doc comment and the package's tests run
- **THEN** the test command fails and names the file, the line and the function

#### Scenario: Undocumented property
- **WHEN** an exported props type gains a property without a doc comment
- **THEN** the test command fails and names the type and the property

#### Scenario: Inherited property
- **WHEN** an exported props type extends a private type of the same package that has an undocumented property
- **THEN** the test command fails and names that property

#### Scenario: Union filler
- **WHEN** one branch of an exported union declares `infoLabel?: never` without a comment, and another branch declares `infoLabel: string` with one
- **THEN** the check passes

#### Scenario: Third-party and generated code
- **WHEN** an exported props type extends the HTML attributes of React or a shadcn component's props
- **THEN** the check requires no comment for the inherited third-party or shadcn properties

#### Scenario: New module
- **WHEN** a new component folder with a public entry point is added to a package
- **THEN** the check covers it with no configuration change

#### Scenario: Comments reach consumers
- **WHEN** a consumer hovers a documented export or property in an editor, using the published package
- **THEN** the editor shows its comment, because the published type declarations keep it

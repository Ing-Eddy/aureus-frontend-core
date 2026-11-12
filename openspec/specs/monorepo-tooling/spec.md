# monorepo-tooling Specification

## Purpose
Defines the shape of the monorepo and its shared developer workflow, so that every package is built, checked and tested in the same way from the repository root.

## Requirements

### Requirement: Workspace layout
The repository SHALL organise code into three workspace groups: `packages/*` for publishable packages, `apps/*` for private applications, and `tooling/*` for private shared configuration. All internal dependencies MUST use the workspace protocol, so local packages are linked rather than downloaded.

#### Scenario: Internal package is linked locally
- **WHEN** an app in `apps/` declares a dependency on `@aureus-core/ui`
- **THEN** installing dependencies at the root links the local `packages/ui` and does not fetch it from the registry

### Requirement: Root task pipeline
The repository SHALL expose `build`, `dev`, `lint`, `typecheck` and `test` as root-level commands that run across all workspaces. A workspace's `build` MUST run only after the builds of the workspaces it depends on.

#### Scenario: Dependent build ordering
- **WHEN** `build` runs from the root
- **THEN** `packages/ui` finishes building before `apps/storybook` starts building

#### Scenario: Unchanged work is cached
- **WHEN** `build` runs twice with no source changes
- **THEN** the second run reuses cached results instead of rebuilding

### Requirement: Shared TypeScript configuration
All workspaces SHALL extend shared strict TypeScript base configs from `tooling/`, instead of each defining compiler options on its own.

#### Scenario: Strictness applies everywhere
- **WHEN** code in any workspace accesses an indexed value without a check for an undefined result
- **THEN** `typecheck` reports an error

### Requirement: Single lint and format configuration
The repository SHALL use one root lint/format configuration that applies to every workspace. Files owned by the shadcn CLI MUST be excluded from linting and formatting, so regenerating them produces clean diffs.

#### Scenario: Generated files untouched by formatter
- **WHEN** the format command runs across the repository
- **THEN** no file under `packages/ui/src/shadcn/` is modified

### Requirement: Pull request checks
Every pull request SHALL run install, lint, typecheck, test and build in CI. A failure in any step MUST mark the pull request check as failed.

#### Scenario: Type error blocks the pull request
- **WHEN** a pull request introduces a type error
- **THEN** the CI check fails at the typecheck step

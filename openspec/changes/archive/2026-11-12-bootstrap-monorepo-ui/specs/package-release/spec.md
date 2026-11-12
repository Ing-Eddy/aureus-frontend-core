## Purpose

Defines how publishable packages in the monorepo are versioned, given changelogs and released to public npm, so consumers get predictable semver releases with verifiable provenance.

## ADDED Requirements

### Requirement: Change-driven versioning
Each publishable package SHALL be versioned independently with semver. Contributors MUST declare a package's version bump and a changelog entry together with the change itself. Private workspaces (`apps/*`, `tooling/*`) MUST never be versioned or published.

#### Scenario: Release pull request is prepared
- **WHEN** changes that declare a bump for `@aureus-core/ui` are merged to `main`
- **THEN** CI opens or updates a release pull request that bumps the package version and updates its changelog

### Requirement: Automated public publishing
Merging the release pull request SHALL publish the bumped packages to the public npm registry under the `@aureus-core` scope, with public access and provenance. Publishing MUST NOT depend on a long-lived registry token stored in CI.

#### Scenario: Package is published with provenance
- **WHEN** the release pull request is merged
- **THEN** the new version of `@aureus-core/ui` appears on npmjs.com with a provenance attestation that links it to the GitHub workflow run

### Requirement: Published contents are minimal
A published package SHALL contain only its build output and its package metadata files (manifest, readme, changelog, license). Source, tests and stories MUST NOT be included.

#### Scenario: Inspecting the tarball
- **WHEN** the package is packed for publishing
- **THEN** the tarball contains no `src/` directory and no `*-tests.*` or `*-stories.*` files

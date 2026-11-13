## MODIFIED Requirements

### Requirement: Pull request checks
Every pull request SHALL run install, lint, typecheck, test, build and the package-output check in CI. The test step MUST include the playground's stories executed in a real browser. A failure in any step MUST mark the pull request check as failed.

#### Scenario: Type error blocks the pull request
- **WHEN** a pull request introduces a type error
- **THEN** the CI check fails at the typecheck step

#### Scenario: Broken story blocks the pull request
- **WHEN** a pull request makes a story's interaction test or accessibility check fail
- **THEN** the CI check fails at the test step

#### Scenario: Broken package output blocks the pull request
- **WHEN** a pull request causes an installed component to be missing from the build output
- **THEN** the CI check fails at the package-output check step

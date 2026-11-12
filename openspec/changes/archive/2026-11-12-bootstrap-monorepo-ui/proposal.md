## Why

My frontend projects each keep their own copy of the same UI primitives, hooks and utilities, and those copies drift apart. A single monorepo that publishes versioned packages to public npm gives every project one source for shared resources. The first package needs a stable base: shadcn/ui components that stay updatable through the shadcn CLI and are never edited by hand, so that `shadcn add --overwrite` can never destroy custom work.

## What Changes

- Create a pnpm-workspace monorepo with Turborepo task orchestration, one Biome lint/format config, shared TypeScript configs (`tooling/typescript`), and a GitHub Actions CI pipeline.
- Add the public package `@aureus-core/ui` (React 19 + TypeScript + Tailwind v4):
  - `src/shadcn/` is **owned by the CLI**. The shadcn CLI writes every component, hook, util and the base stylesheet there, and nothing in it is edited by hand.
  - `src/components/` holds the author's own components. They compose shadcn primitives, each in its own folder with an `index.ts` barrel.
  - Pure kebab-case file names everywhere: `-types.ts`, `-tests.tsx`, `-stories.tsx`.
  - Subpath exports (`@aureus-core/ui/shadcn/<name>`, `@aureus-core/ui/components/<name>`, `@aureus-core/ui/styles.css`), with no root barrel.
  - The `shadcn:add` and `shadcn:update` scripts manage the CLI-owned layer.
- Add `apps/storybook` (private) as the playground and documentation for both layers.
- Add Changesets-based versioning and a release workflow that publishes to public npm with trusted publishing (OIDC) and provenance.
- Record the stack and conventions in `openspec/config.yaml` context.

Non-goals: no custom components are created in this change (`components/` starts empty). No `hooks`, `utils` or `plugins` packages yet. No visual regression testing. No support for Next.js/RSC consumers.

## Capabilities

### New Capabilities
- `monorepo-tooling`: workspace layout, shared task pipeline (build, dev, lint, typecheck, test), shared TS config, and CI checks on pull requests.
- `ui-package`: the published `@aureus-core/ui` contract. It covers the CLI-owned shadcn layer, how custom components are laid out and named, public import paths, and how consumers load styles.
- `package-release`: how packages are versioned, changelogged and published to public npm under the `@aureus-core` scope.
- `component-playground`: an isolated environment for browsing and developing UI components with the package's real styles.

### Modified Capabilities

None. There are no existing specs.

## Impact

- **New code**: repo root config files, `tooling/typescript`, `packages/ui`, `apps/storybook`, `.github/workflows/`, `.changeset/`.
- **Dependencies**: pnpm, turbo, @biomejs/biome, typescript, tsdown, vitest, @testing-library/react, jsdom, react/react-dom 19, tailwindcss v4, shadcn CLI and the Radix/Base UI deps it pulls in, storybook (react-vite), @changesets/cli.
- **External systems**: an npm org `aureus-core` must exist. The first publish is manual, after which a trusted publisher is configured for the GitHub repo.
- **Consumers**: Vite + React SPAs on Tailwind v4 add `@aureus-core/ui` and replace their own `@import "tailwindcss"` with `@import "@aureus-core/ui/styles.css"`.

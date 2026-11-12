## Context

The repository is empty apart from OpenSpec scaffolding. Node 24 and pnpm are available. See proposal.md (Why) for motivation and `specs/` for the behaviour contract. Constraints that shape the design:
- Consumers are external Vite + React SPAs that install from **public npm**, so the package must ship compiled JS and types, not TS source.
- The shadcn CLI writes files to the paths given by `components.json` aliases and overwrites them on update. The boundary between generated code and the author's code must therefore be a filesystem boundary.
- Tailwind v4 generates classes by scanning sources, so a consumer's build has to scan the package's output.

## Goals / Non-Goals

**Goals:**
- A boundary for the CLI-owned layer that is enforced by folder layout and tooling, not just by convention.
- Zero-maintenance exports: adding a component never requires editing `package.json`.
- One pipeline (`build`/`dev`/`lint`/`typecheck`/`test`) that later packages (`hooks`, `utils`) reuse unchanged.

**Non-Goals:**
- Keeping `"use client"` directives or supporting RSC (consumers are Vite-only).
- A CI job that detects hand edits in `src/shadcn/`. Review of the `shadcn:update` diff covers this for now.
- Bundling CSS or a CSS-in-JS runtime. The consumer's Tailwind compiles the styles.

## Architecture

```
aureus-frontend-core/
├─ package.json  pnpm-workspace.yaml  turbo.json  biome.json  .nvmrc
├─ .changeset/config.json
├─ .github/workflows/{ci.yml,release.yml}
├─ tooling/typescript/            # @aureus-core/tsconfig (private): base, react-library, vite-app
├─ packages/ui/                   # @aureus-core/ui (public)
│  ├─ components.json  package.json  tsconfig.json  tsdown.config.ts  vitest.config.ts
│  └─ src/
│     ├─ shadcn/                  # ⛔ CLI-owned: ui/, hooks/, lib/utils.ts, README.md
│     ├─ components/              # ✅ the author's: <name>/{<name>.tsx,<name>-types.ts,<name>-tests.tsx,index.ts}
│     └─ styles/{shadcn.css ⛔, theme.css ✅, index.css}
└─ apps/storybook/                # private: src/stories/{shadcn,components}/<name>-stories.tsx
```
Dependency direction: apps/consumers → `components/` → `shadcn/`. Future `hooks`/`utils` packages must not depend on `ui`, while `ui` may depend on them.

## Decisions

### D1. Every shadcn alias points inside `src/shadcn`
`components.json` aliases: `components → @/shadcn`, `ui → @/shadcn/ui`, `lib → @/shadcn/lib`, `utils → @/shadcn/lib/utils`, `hooks → @/shadcn/hooks`. `tailwind.css → src/styles/shadcn.css`, and `rsc: false`. `@/*` is a tsconfig path to `./src/*`. Style, base colour and icon library are chosen interactively at `init`.
*Alternative:* a separate `@aureus-core/shadcn` package. It gives a harder boundary but means two packages to version and publish, and consumers would juggle two dependencies. Rejected for now. The folder can be extracted into its own package later without changing consumer import paths, as long as `ui` re-exports it.

### D2. Customisation ladder (documented in CONTRIBUTING.md)
1. Tokens: override CSS variables in `styles/theme.css`, which `index.css` imports after `shadcn.css`.
2. Wrap: a component in `components/` that composes the primitive with `cva` + `cn()`.
3. Fork: copy the file into `components/` under a new name. From then on the author owns it.

### D3. Build with tsdown in unbundled mode
ESM only, `.d.ts` output, one output file per source file. Entries are `src/**/*.{ts,tsx}`, excluding `**/*-tests.*`. `src/styles/` is copied to `dist/styles/` unchanged. The bundler resolves `@/` aliases into relative paths, and a verification step greps `dist/` for leftover `@/`.
*Alternatives:* tsup (its `.d.ts` handling of path aliases is fragile) and Vite library mode with a dts plugin (more config for the same output).

### D4. Wildcard subpath exports plus a barrel per folder
```json
"exports": {
  "./shadcn/*":     { "types": "./dist/shadcn/ui/*.d.ts",       "default": "./dist/shadcn/ui/*.js" },
  "./components/*": { "types": "./dist/components/*/index.d.ts", "default": "./dist/components/*/index.js" },
  "./hooks/*":      { "types": "./dist/shadcn/hooks/*.d.ts",    "default": "./dist/shadcn/hooks/*.js" },
  "./lib/utils":    { "types": "./dist/shadcn/lib/utils.d.ts",  "default": "./dist/shadcn/lib/utils.js" },
  "./styles.css":   "./dist/styles/index.css"
},
"files": ["dist"], "sideEffects": ["**/*.css"],
"publishConfig": { "access": "public", "provenance": true }
```
Barrels exist only per folder (`components/<name>/index.ts`, which re-exports types with `export type`). There is no root barrel, because it would load the whole library in dev and tests and invites import cycles.

### D5. Kebab-case role suffixes
Files are named `-types.ts`, `-tests.tsx` and `-stories.tsx`. The tools' default globs expect dot suffixes, so: Vitest `include: ["src/**/*-tests.{ts,tsx}"]`, the tsdown entry exclusion above, and Storybook `stories: ["../src/stories/**/*-stories.tsx"]`. Files in the CLI-owned folder keep shadcn's own names.

### D6. One stylesheet entry for consumers
`index.css` contains `@import "./shadcn.css"; @import "./theme.css"; @source "../";`. Because `shadcn.css` already contains `@import "tailwindcss"`, consumers **replace** their own Tailwind import with `@import "@aureus-core/ui/styles.css"`. `@source "../"`, resolved from `dist/styles/`, makes their Tailwind scan the package's `dist/`. Peer dependencies: `react`, `react-dom`, `tailwindcss@^4`.

### D7. Tooling
pnpm workspaces + Turborepo (`build` dependsOn `^build`; `dev` is persistent and uncached), Biome at the root (ignoring `packages/ui/src/shadcn/**` and `packages/ui/src/styles/shadcn.css`), Vitest + Testing Library + jsdom in `packages/ui` (`passWithNoTests` until the first component exists), and Storybook `@storybook/react-vite` + `@tailwindcss/vite` + the a11y addon.

### D8. Storybook consumes the built package
`apps/storybook` depends on `@aureus-core/ui@workspace:*` and imports `@aureus-core/ui/styles.css` in `preview.ts`. `turbo dev` runs `tsdown --watch` and Storybook in parallel. This uses the exact paths consumers use (see the component-playground spec) and avoids alias and source-condition configuration.

### D9. Release with Changesets + trusted publishing
`.changeset/config.json` with `access: public` and private workspaces ignored. `ci.yml` runs on PRs. `release.yml` runs on `main` with `changesets/action` (version PR → publish) and `permissions: id-token: write`, so npm trusted publishing works through OIDC without an `NPM_TOKEN`.

## Risks / Trade-offs

- [`tsdown --watch` may not re-copy `styles/*.css`, because they are not in the module graph] → include `src/styles` in the watch paths. If that is not enough, run a small parallel copy-on-change script in `dev`.
- [Consumer installs a different Tailwind major] → `tailwindcss` is a peer dependency, so pnpm/npm warn on a mismatch.
- [`shadcn add` changes `shadcn.css`, for example by appending sidebar tokens] → this is expected, because the file is CLI-owned. Overrides live in `theme.css`, so they survive.
- [`shadcn:update` pulls upstream changes that break wrappers] → run the update only on a branch, review the diff, and run tests and Storybook before merging. A Changeset documents the bump.
- [The shadcn CLI does not resolve the tsconfig `@/` alias inside a workspace package] → run the CLI with `-c packages/ui`, so it reads that package's `tsconfig.json`. Check the location of the first `add` output (task 3.3).
- [The radix-nova `shadcn.css` imports `shadcn/tailwind.css` and `@fontsource-variable/geist`, and the consumer's Tailwind resolves those imports] → `shadcn` (the CLI package, about 0.4 MB) and the Geist font are runtime `dependencies` of `@aureus-core/ui`. Revisit this if install size matters, for example by vendoring `tailwind.css` at build time.
- [`shadcn init` fails in a library package ("could not detect a supported framework")] → `components.json`, `lib/utils.ts` and `shadcn.css` were generated by running `init` in a throwaway Vite app and copied over with the package's aliases. `shadcn add` and `shadcn:update` work normally afterwards.
- [Trusted publishing requires the package to already exist on npm] → do the first publish manually, then configure the trusted publisher (Migration Plan).

## Migration Plan

This is a greenfield change with no existing consumers. To roll out:
1. Merge the scaffold.
2. Create the npm org `aureus-core` and run `npm publish --access public` locally once for `@aureus-core/ui`.
3. Add the GitHub repo/workflow as a trusted publisher on npmjs.com.
4. From then on, all releases go through the Changesets release PR.

Rollback: `npm deprecate` the bad version and publish a patch. Never unpublish.

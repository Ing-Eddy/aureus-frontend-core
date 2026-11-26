## Why

The code in `packages/` is documented unevenly. `hooks` and `i18n` describe their exports, but a consumer's editor shows nothing for 59 of the 314 public exports of `ui` and about 130 of its public props, mostly in `data-table`, `app-layout` and `modal`. `utils` lacks 8 of its 21 exports. Most private helpers have no comment, so the reasons behind them live only in people's heads. Nothing stops new public API from shipping undocumented.

Reviewing all of our own code once, documenting it, and guarding the public API keeps the packages understandable for the people who use and maintain them.

## What Changes

- **Review and document all of our own code in `packages/`,** public and internal, with English TSDoc comments:
  - `utils`, `hooks`, `i18n` (including `client.d.ts`) and `ui` (`src/components`, `src/internal`);
  - the library's own CSS, `scripts/*.mjs` and the package config files.

  Existing comments are checked against the code, and wrong or stale ones are corrected.
- **A comment standard** in a new "Doc comments" section of `CONTRIBUTING.md`.
- **A guard test for the public API.** A new private workspace package, `tooling/doc-guard` (`@aureus-core/doc-guard`), finds exports and props of a package's public entry points that have no doc comment. Each of the four published packages runs it in its test command, which fails and names each missing item.
- **A findings report.** Code problems found during the review (bugs, risks, improvements) are listed in `review-notes.md` of this change, with file, line, severity and a proposed fix.
- **A `patch` changeset** for the four published packages, because the comments ship in their type declarations.

Non-goals:
- Changing any runtime or type behavior. Findings are reported, not fixed.
- `packages/ui/src/shadcn/**` and `src/styles/shadcn.css`, which the shadcn CLI owns.
- Comments in test files and test helpers.
- READMEs, Storybook guides and `*-docs.ts` pages (including the missing `packages/ui/README.md`, which is only reported).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `monorepo-tooling`:
  - **Workspace layout:** `tooling/*` also holds private development tools, not only shared configuration.
  - New requirement: every public export and prop of a published package is documented, and the test command enforces it.

## Impact

- **New code:** `tooling/doc-guard/` (private, never published), with its own tests.
- **Each of `packages/{utils,hooks,i18n,ui}`:**
  - comments across the source;
  - `src/documentation-tests.ts`;
  - a devDependency on `@aureus-core/doc-guard`;
  - in `i18n`, a `vitest.config.ts` include for that test.
- **Docs:** `CONTRIBUTING.md`, `.changeset/document-packages-api.md`.
- **Dependencies:** TypeScript 5 as `typescript-api` (an npm alias), used only by `doc-guard`. Builds and type checks keep using TypeScript 7.
- **Published output:** type declarations and JavaScript gain comments; no export or behavior changes.
- **CI:** no workflow changes; the root `test` already runs every workspace.

## Context

See proposal.md (Why) for the motivation, and the `monorepo-tooling` delta for the requirement. Facts that shape the approach:

- **Size.** Our own source, without tests and shadcn, is about 27,000 lines: `utils` 940, `hooks` 550, `i18n` 1,180, `ui/src/internal` 4,070, `ui` fields and controls 12,460, `app-layout` 2,940, `data-table` 3,240, `modal` and `typography` 1,410, plus CSS (520) and scripts (690).
- **Current comments** are English TSDoc. Where they exist they state defaults and behavior that the types do not show.
- **Published output keeps comments:** tsdown writes them into `dist/**/*.d.ts`.
- **Tailwind scans the published `ui` output** (`@source "../"` in `styles/index.css`), so literal class names in comments can add CSS to consumers' builds.
- **TypeScript 7.0** only offers an unstable programmatic API (`typescript/unstable/*`).
- **Existing guard tests** (`ui/src/no-default-texts-tests.ts`, `theme-css-tests.ts`) are Vitest files under `src/` that read the source in a Node environment and strip comments before matching, so new comments do not affect them.
- **i18n's Vitest config** has two projects whose `include` does not match a test at `src/` root.

## Goals / Non-Goals

**Goals:**
- Comments that explain what a signature cannot: defaults, edge cases, side effects, warnings, accessibility, and the reason behind internal code.
- Proof that the documentation pass changed no code.
- A public-API guard that is exact (it resolves barrels and inheritance), needs no allowlist, and adds no runtime dependency to any published package.

**Non-Goals:**
- Enforcing comment quality or documenting internal code automatically.
- Generating an API reference site from the comments.

## Decisions

### 1. Comment standard (written into CONTRIBUTING.md first)
- Every module-level declaration, exported or not, and every type member gets a `/** */` comment. Barrels do not.
- The first sentence says what it is. Then, only what the signature does not show: the default (`Defaults to …` / `No default.`), edge cases, side effects, development warnings and thrown errors, accessibility and RTL; for internal code, why it exists or why it works that way.
- `@example` on each public entry component, hook or function. `@param` and `@returns` only when name and type are not enough.
- No restating names or types. `//` only for non-obvious decisions.
- CSS and scripts: a header per file and a comment per block or check.
- Hazards: `*/` ends a comment (write `src/**\/locales`); in `ui`, no literal Tailwind class names in new comments.

This keeps the style the repo already has. Alternative: TSDoc tags everywhere — rejected as noise that repeats the types.

### 2. `tooling/doc-guard`: one shared check
```
tooling/doc-guard/
├─ package.json     @aureus-core/doc-guard, private; exports "." → ./src/index.ts
├─ tsconfig.json
├─ vitest.config.ts
└─ src/
   ├─ index.ts      findUndocumented, types
   ├─ doc-guard.ts  findUndocumented({ packageDir, entries })
   ├─ types/        doc-guard-types.ts
   └─ tests/        doc-guard-tests.ts + fixtures built in a temp folder
```
- Source-only package: no build. Consumers are Vitest tests, which compile TypeScript.
- It lives in `tooling/` because it is never published. Alternatives: a copy of the logic in four test files (drifts); a root-level script (the root has no test runner, and failures would not belong to a package).

### 3. Analysis with TypeScript 5's compiler API
- Dependency `"typescript-api": "npm:typescript@^5.9"` of `doc-guard` (a `dependency`, since the package is private and its source imports it). The alias keeps `typescript` meaning TypeScript 7 everywhere else.
- Alternatives: TypeScript 7's `unstable/*` API (may change on any release); `oxc-parser` (no type information, so barrels, unions and inheritance would be resolved by hand); regular expressions (cannot resolve exports).

### 4. What the check walks
- `entries` are globs relative to `packageDir`, expanded with `node:fs` `globSync`; paths under `internal/` are dropped; zero matches is an error.
- The program uses the package's `tsconfig.json` options.
- For each export of each entry (aliases resolved), only symbols declared under `<packageDir>/src`, excluding `src/shadcn`, are checked, once.
- A symbol is documented when the checker returns a non-empty documentation comment.
- For exported interfaces and type aliases: the properties of the declared type, taking every member of a union (and `boolean`-style unions are skipped), so inherited and intersected properties are included. A property is checked only if it has a declaration in own source whose type is not `never`; it is documented if any of its declarations has a comment. Object type literals nested in a property's type are walked the same way.
- Public class members are checked like properties.
- Output: a sorted list of `"<relative file>:<line> → <Name> has no doc comment"`, so an empty array means success and the Vitest diff is the report.

### 5. Wiring per package
Each package adds `src/documentation-tests.ts` (`// @vitest-environment node`) with its entries:

| Package | `entries` |
|---|---|
| `utils`, `hooks` | `src/*/index.ts` |
| `i18n` | `src/vite/index.ts`, `src/runtime/index.ts` |
| `ui` | `src/components/*/index.ts` |

The test is added only when that package is fully documented, so the tree stays green after every batch. `i18n` adds `src/*-tests.ts` to its `vite` Vitest project. `*-tests` files are already excluded from builds.

### 6. Review process, batch by batch
Order: `utils`, `hooks`, `i18n`, `ui/internal` (non-visual, then components), `ui` fields and controls (text and number; choice; date, file and avatar), `app-layout`, `data-table`, `modal` and `typography`, then CSS, scripts and configs. Smallest first, so the standard is settled on little code.

Per batch: read every file; check each existing comment against the code, and the spec in `openspec/specs/` and tests when in doubt; write what is missing; record findings; verify. When a comment contradicts the code: if tests or spec back the code, fix the comment; if they back the comment, record a bug.

### 7. Proof that only comments changed
A temporary script in the session scratchpad compares every modified source file with `HEAD`: TypeScript and `.mjs` files by printing both syntax trees with comments removed (TypeScript 5 printer), CSS by removing `/* */` and whitespace. Any difference fails the batch. Files that are new or intentionally changed (tests added, `package.json`, Vitest config) are listed explicitly. It is not committed: it only protects this change.

## Risks / Trade-offs

- [A large diff is hard to review] → One batch at a time, with the code-identity proof, so review can focus on wording.
- [Comments can be wrong even when present] → Each is written after reading the code and checked against specs and tests; the guard only proves presence.
- [The guard may demand trivial comments] → The standard asks for meaning (default, behavior), and the guard covers only public API.
- [Two TypeScript versions in the repo] → The alias is confined to a private test tool; if TypeScript 7 ships a stable API, only `doc-guard.ts` changes.
- [The guard builds a program per package and slows tests] → It runs once per package; `ui` is a few seconds.
- [Comments could add Tailwind utilities to consumers' CSS] → The standard forbids literal class names in new `ui` comments; the built CSS size is compared before and after.

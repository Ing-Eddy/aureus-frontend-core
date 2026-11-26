## 1. Standard and baseline

- [x] 1.1 Add the "Doc comments" section to `CONTRIBUTING.md` (design decision 1), with one example each for a public prop, an internal helper and a CSS block, and the two hazards. Verify that `pnpm lint` passes.
- [x] 1.2 Write the temporary code-identity script in the session scratchpad (design decision 7). Verify that it reports no difference on an untouched tree, reports no difference after adding only a comment to a `.ts`, a `.tsx`, a `.mjs` and a `.css` copy, and reports one after changing a value.
- [x] 1.3 Record the baseline: public and internal documentation coverage per package, and the size of the CSS built by the playground. Write both to `openspec/changes/document-packages-api/review-notes.md`.

## 2. Guard tool

- [x] 2.1 Create `tooling/doc-guard` (design decisions 2 and 3): `package.json` with `typescript-api` and scripts `test` and `typecheck`, `tsconfig.json`, `vitest.config.ts`. Verify that `pnpm install` links it without changing `pnpm-workspace.yaml`, and that `pnpm --filter @aureus-core/doc-guard typecheck` runs.
- [x] 2.2 Implement `findUndocumented` (design decision 4) with tests on temporary fixture packages covering every scenario of the "Documented public API" requirement: undocumented export; undocumented, inherited and nested property; `never` filler and union rule; third-party and shadcn exclusion; `internal/` entries dropped; new module picked up; no entry found is an error; sorted `file:line` output. Verify with `pnpm --filter @aureus-core/doc-guard test`.

## 3. `utils`

- [x] 3.1 Review and document `packages/utils/src`, `scripts` and configs; record findings. Verify with the code-identity script, `biome check`, and the package's `typecheck` and `test`.
- [x] 3.2 Add `src/documentation-tests.ts` and the devDependency. Verify that it passes, and that it fails naming the file and symbol when one comment is removed on purpose.

## 4. `hooks`

- [x] 4.1 Review and document `packages/hooks/src`, `scripts` and configs; record findings. Verify as in 3.1.
- [x] 4.2 Add `src/documentation-tests.ts` and the devDependency. Verify as in 3.2.

## 5. `i18n`

- [x] 5.1 Review and document `packages/i18n/src`, `client.d.ts`, `scripts` and configs; record findings. Verify as in 3.1, and that the generated-types fixture test still passes.
- [x] 5.2 Add `src/documentation-tests.ts`, the devDependency and the `src/*-tests.ts` include in the `vite` Vitest project. Verify as in 3.2, and that the test appears in the run.

## 6. `ui`

Each task: review and document the folder, record findings, and verify with the code-identity script, `biome check`, `pnpm --filter @aureus-core/ui typecheck` and that batch's tests.

- [x] 6.1 `src/internal/types`, `src/internal/utils`, `src/internal/hooks`.
- [x] 6.2 `src/internal/components`.
- [x] 6.3 Text and number fields and controls: `text`, `text-area`, `password`, `number`, `otp`.
- [x] 6.4 Choice fields and controls: `select`, `radio-group`, `checkbox`, `checkbox-group`, `switch`, `slider`.
- [x] 6.5 Date, file and avatar fields and controls: `date-time`, `date-selection`, `file`, `avatar`.
- [x] 6.6 `components/app-layout`.
- [x] 6.7 `components/data-table`.
- [x] 6.8 `components/modal` and `components/typography`.
- [x] 6.9 The library's CSS (`styles/` except `shadcn.css`), `scripts/*.mjs` and configs. Report the missing `packages/ui/README.md` as a finding.
- [x] 6.10 Add `src/documentation-tests.ts` and the devDependency. Verify as in 3.2.

## 7. Release notes and final verification

- [x] 7.1 Add `.changeset/document-packages-api.md` (`patch` for the four published packages). Verify that `pnpm changeset status` lists it.
- [x] 7.2 From the root, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm check:package`; run the code-identity script over every modified file; spot-check comments in `dist/**/*.d.ts` of each package; compare the built CSS size with the baseline. Verify that all pass and explain any size difference.
- [x] 7.3 Complete `review-notes.md`: coverage before and after (public API at 100 %, no undocumented module declaration or member in our source), and findings ordered by severity, each with file, line, description and proposed fix. Run `openspec validate document-packages-api --strict`.

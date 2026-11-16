## 1. Audit

- [x] 1.1 Build the evidence for `audit.md` (design D7):
  - greps for literal user-facing texts, `fieldStrings`, `as unknown as`/`as never`, and duplicated helpers;
  - the folder-rule check of the 20 components and `src/internal`;
  - the story-set matrix per family;
  - the docs `api` keys against the exported props;
  - EN/ES section parity;
  - the warning message formats;
  - a full Chromium story run with axe.

  Verify that every component has a section with its findings, or with "no findings".
- [x] 1.2 Write `openspec/changes/review-form-fields-consistency/audit.md` (a table per component: area, severity, finding, location, fix), and publish it as an artifact page for review. Verify that the user has reviewed it, and record which findings are accepted, deferred or rejected.
- [x] 1.3 Turn accepted findings that change observable behaviour beyond this delta into spec and task updates (artifact update). Verify that `openspec validate review-form-fields-consistency --strict` passes.

## 2. Shared types and internals

- [x] 2.1 Add `src/internal/types/field-text-types.ts` (`FieldLoadingTexts`, `FieldInfoTexts`, `FieldTexts`, `DistributiveOmit`; design D1). Remove `loading`, `loadingLabel`, `info` and `infoLabel` from `FieldBaseProps`. Replace the duplicated `DistributiveOmit` in `select-field` and `select-control`. Verify with `typecheck`, which is expected to fail only in the fields updated in section 3.
- [x] 2.2 Make `FieldLoading`'s, `FieldInfo`'s and `FieldStepper`'s labels required, and delete `field-strings.ts` and its export (design D3). Adapt the internal tests. Verify that the internal tests pass.
- [x] 2.3 Add `src/internal/hooks/use-missing-texts.ts` with tests (design D4), and migrate Select's warnings onto it. Verify the message format and the once-per-problem behaviour.
- [x] 2.4 Add `src/internal/testing/parity.ts` (design D6), exclude it from the build entries, and switch the 10 parity tests to it. Verify that the parity tests pass and that `dist` has no `testing` folder.

## 3. Fields and controls

- [x] 3.1 Text, Password and Text area:
  - `FieldTexts`;
  - Password's required toggle labels;
  - Text area's `showCount`/`countLabel` union with the new signature;
  - `useMissingTexts`;
  - type tests (`@ts-expect-error` per required text).

  Update their controls (`DistributiveOmit`). Verify that their unit tests pass.
- [x] 3.2 Number:
  - `FieldTexts`;
  - the stepper labels union;
  - the expressions texts union;
  - `minusLabel` removed, with `aria-valuetext` from the `Intl` signed format;
  - `useMissingTexts`;
  - type tests.

  Update the control. Verify the unit tests, including a new test for the negative `aria-valuetext`.
- [x] 3.3 Select, Checkbox, Checkbox group, Radio group, Switch (`FieldInfoTexts` only) and OTP: intersect `FieldTexts` into their public props (and into both overloads where present), pass the labels to `FieldLoading`/`FieldInfo`, call `useMissingTexts`, and add type tests. Update the controls. Verify that `pnpm --filter @aureus-core/ui test` and `typecheck` pass.
- [x] 3.4 Add the guard test `src/no-default-texts-tests.ts` (design D5) with its allowlist. Verify that it passes, and that it fails when a sample literal `aria-label` is added temporarily.

## 4. Audit fixes

- [x] 4.1 Apply the accepted high-severity findings. Verify each one with a test or story assertion.
- [x] 4.2 Apply the accepted medium-severity findings (naming, `data-slot`, warning formats, folder rule, JSDoc). Verify with `lint`, `typecheck` and tests.
- [x] 4.3 Apply the cheap low-severity findings, and record the rest as deferred in `audit.md`.

## 5. Storybook

- [x] 5.1 Update every story that uses `loading`, `info`, password, number stepper or expressions, or a counter, to pass the required texts. Add the corresponding Playground controls (empty by default, where empty is allowed). Verify with `pnpm --filter @aureus-core/storybook exec tsc --noEmit`.
- [x] 5.2 Complete the minimum story sets (design D8): `Rtl` with a computed-layout assertion for every field family that lacks it, and `Keyboard` for Text, Password and Text area. Verify that they pass in Chromium, axe included.
- [x] 5.3 Update the 20 docs pages (EN/ES):
  - required texts in `api`;
  - no "defaults to" text;
  - descriptions of new stories;
  - keyboard tables checked against behaviour.

  Verify that the coverage test passes.

## 6. Repository docs and release

- [x] 6.1 Update the guide `fields-and-controls.mdx` (EN/ES): the family-wide "messages are the developer's" section, with a full feature → required texts table. Verify that the bilingual guide test passes.
- [x] 6.2 Update CONTRIBUTING (the rule applies to the whole library, the developer-message exemption and the guard test) and README examples. Verify with `pnpm lint`.
- [x] 6.3 Add a `minor` changeset with the breaking-change note and the migration table (design Migration Plan). Verify that `pnpm changeset status` lists it.

## 7. Final verification

- [x] 7.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify:
  - all pass, and the full test suite passes twice in a row;
  - `dist` has no `field-strings` and no `testing` folder.
- [x] 7.2 Take screenshots of the static Storybook build: one per family in light and dark, touch, and RTL, plus the guide in ES. Update `audit.md` with the final status of every finding (fixed, deferred with a reason, or rejected), republish it, and record the findings in `design.md`.

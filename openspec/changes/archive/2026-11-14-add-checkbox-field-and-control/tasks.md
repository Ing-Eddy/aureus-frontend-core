## 1. Shared field shell

- [x] 1.1 Add `labelFor` (default `true`) to `FieldHeader` and `FieldShell`, and `labelledByRoot` (default `false`) to `FieldShell`, as in design D4. Export `RequiredMark` from `internal/components/field-shell`. Add shell tests:
  - with `labelFor={false}`, the label has no `for`;
  - with `labelledByRoot`, the root has `aria-labelledby` set to the label id.

  Verify that every existing family test still passes (`pnpm --filter @aureus-core/ui test`).

## 2. Types and hooks

- [x] 2.1 Write `checkbox-field/checkbox-field-types.ts`:
  - the both-or-neither value union (design D3);
  - `CheckboxFieldProps<V>`, including `checkboxLabel`, `indeterminate`, `checkboxPosition`, `appearance`, `classNames` (`checkbox`, `checkboxLabel`, `row`) and the family props;
  - JSDoc on every prop, stating there is no default text.

  Verify with `typecheck`.
- [x] 2.2 Write `hooks/use-checkbox-value.ts` (design D2) with tests. Verify:
  - boolean by default;
  - custom values;
  - controlled and uncontrolled;
  - from indeterminate, the checked value is emitted;
  - an unknown controlled value renders unchecked with one development warning.
- [x] 2.3 Write `hooks/use-checkbox-warnings.ts` (design D7) with tests. Verify the warning when there is no `label`, `checkboxLabel`, `aria-label` or `aria-labelledby`, and no warning when any of them is set.

## 3. Components

- [x] 3.1 Write `components/checkbox-box.tsx` (design D1): it wraps shadcn's `Checkbox`, maps `indeterminate` to Radix, and adds the mixed-state classes with arbitrary `data-[state=…]` variants. Verify with `typecheck`, and with a test that the box has `aria-checked="mixed"`.
- [x] 3.2 Write `components/checkbox-row.tsx` (design D5):
  - box, `checkboxLabel` as `<label htmlFor>`, spinner and action;
  - `checkboxPosition` with logical ordering;
  - `appearance="card"` with checked and error styles, and pointer-click forwarding that skips interactive descendants;
  - the required mark after the text when there is no header label.

  Verify with `typecheck` and `lint`.
- [x] 3.3 Write `checkbox-field.tsx` and `index.ts`:
  - `FieldShell` with `labelFor` and `labelledByRoot` chosen by the D4 table;
  - `useFieldA11y` wired to the box;
  - `loading` and `disabled` lock it;
  - the helper indented in plain/start;
  - Radix `name` and `value` for native forms;
  - `ref` to the box.

  Verify with `typecheck` and `lint`.

## 4. CheckboxField tests

- [x] 4.1 Write `tests/checkbox-field-value-tests.tsx`. Verify:
  - clicking the box and clicking the text toggle it;
  - `onValueChange` with boolean and custom values;
  - controlled and uncontrolled;
  - the hidden input carries `name`, and `value` when custom values are used.
- [x] 4.2 Write `tests/checkbox-field-a11y-tests.tsx`. Verify:
  - each row of the D4 table: the group named by the label, and the box named by `checkboxLabel` or by the label;
  - `aria-describedby` with helper and info;
  - `aria-invalid` and `aria-required`;
  - the required mark placement;
  - a link inside `checkboxLabel` does not toggle;
  - Space toggles and Enter does not.
- [x] 4.3 Write `tests/checkbox-field-extras-tests.tsx` and `checkbox-field-states-tests.tsx`. Verify:
  - indeterminate (`mixed`, and activation emits the checked value);
  - `checkboxPosition="end"` order;
  - a card click toggles, and clicks on its link or action do not;
  - `loading` (spinner, `aria-busy`, no change) and `disabled` (no change);
  - each extra leaves the other defaults unchanged.
- [x] 4.4 Write `tests/checkbox-field-types-tests.tsx`. Verify:
  - `@ts-expect-error` for only one custom value;
  - `@ts-expect-error` for `value={true}` with string custom values;
  - `onValueChange` is inferred as `"S" | "N"`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 5. CheckboxControl

- [x] 5.1 Write `checkbox-control-types.ts`, `checkbox-control.tsx` and `index.ts` (design D8). Verify with `typecheck`.
- [x] 5.2 Write `tests/render-in-form.tsx` and `checkbox-control-form-tests.tsx`. The schemas are `terms: z.literal(true, { error })`, `newsletter: z.boolean()` and `active: z.enum(["S","N"])`. Verify:
  - a boolean and a custom value are submitted;
  - the schema message;
  - focus on error;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 5.3 Write `checkbox-control-parity-tests.tsx` (plain, card, end and label+text, ids normalised) and `checkbox-control-types-tests.tsx` (no `control`, `rules`, `value`, `defaultValue` or `error`, and the value union still enforced). Verify that the tests pass.

## 6. Package verification

- [x] 6.1 Run `pnpm build && pnpm check:package`. Verify:
  - 12 custom components;
  - `dist/components/checkbox-{field,control}` exist;
  - no test files in `dist`.

## 7. Stories and docs

- [x] 7.1 Write `checkbox-field-docs.ts` (EN/ES):
  - `label` versus `checkboxLabel` and how the box is named;
  - custom values with schema examples;
  - indeterminate;
  - position and card;
  - the keyboard table, `aria` notes and theming.
- [x] 7.2 Write `checkbox-field-stories.tsx`:
  - a `Playground`, including a value-mode selector (boolean, `"S"`/`"N"`, `1`/`0`) and the Action group;
  - `Boolean`, `LabelAndText`, `TextOnly`;
  - `RichText`, where clicking the link does not toggle;
  - `CustomValues`;
  - `Indeterminate`, a "select all" with three children, with computed-style assertions for the fill and the dash;
  - `PositionEnd`;
  - `Card`, a settings list with a computed-style assertion for the checked highlight;
  - `Keyboard`;
  - `States` and `Responsive`.

  Verify that they pass in Chromium, axe included.
- [x] 7.3 Write `checkbox-control-docs.ts` (EN/ES) and `checkbox-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`, with terms and a free boolean;
  - `CustomValues`;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 7.4 Update the guide `fields-and-controls.mdx` (EN/ES) with a "Checkbox" row and a short section (two texts, custom values, extras). Verify that the bilingual guide test passes.

## 8. Repository docs and release

- [x] 8.1 Update `README.md` with the Checkbox pair in the forms paragraph and the example. Verify with `pnpm lint`.
- [x] 8.2 Add a `minor` changeset for `CheckboxField` and `CheckboxControl`. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify that all pass, and that the full test suite passes twice in a row.
- [x] 9.2 Take screenshots of the static Storybook build:
  - plain, end and card in light and dark;
  - indeterminate;
  - error;
  - a mobile viewport with touch emulated;
  - RTL;
  - the CheckboxField docs in ES.

  Verify the layout, fix any issue, and record the findings in `design.md`.

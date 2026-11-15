## 1. Shared internals

- [x] 1.1 Move `checkbox-box.tsx`, `checkbox-row.tsx` and `styles.ts` (renamed `checkbox-styles.ts`) from `components/checkbox-field/components/` to `src/internal/components/checkbox-row/` (design D1). Add `index.ts` and export them from `internal/components`. Update `CheckboxField` to import from there and remove the empty folder. Verify that the `CheckboxField`/`CheckboxControl` unit tests and parity pass unchanged.
- [x] 1.2 Add the optional `description` and `descriptionId` to `CheckboxRow`: a muted second line under the text, with the box aligned to the first line. Verify with a row test, and check that the `CheckboxField` tests still pass.
- [x] 1.3 Add `rootAria` and `headerEnd` to `FieldShell`, and `headerEnd` to `FieldHeader` (design D5). Write shell tests:
  - the root gets the ARIA attributes;
  - the header renders with only `headerEnd`.

  Verify that every family's tests pass (`pnpm --filter @aureus-core/ui test`).

## 2. Types and hooks

- [x] 2.1 Write `checkbox-group-field/types/`: `CheckboxGroupOption`, `CheckboxGroupFieldProps` and `CheckboxGroupFieldClassNames` (design D6), with JSDoc stating there is no default text. Verify with `typecheck`.
- [x] 2.2 Write `hooks/use-checkbox-group-value.ts` (design D2) with tests. Verify:
  - canonical order whatever the click order;
  - controlled and uncontrolled;
  - unknown values kept at the end, with one warning;
  - `atLimit` and `isLocked`;
  - `selectAllState` all/some/none;
  - `toggleAll` with disabled options, with a limit (adds in order) and at the limit (clears enabled, keeps disabled).
- [x] 2.3 Write `hooks/use-checkbox-group-warnings.ts` with tests. Verify the warning without `label`, `aria-label` or `aria-labelledby`, and silence when one is set.

## 3. Components

- [x] 3.1 Write `components/checkbox-group-options.tsx` (design D3):
  - vertical, horizontal and columns containers, with container queries;
  - the select-all row before the options, with the options indented in vertical plain layout;
  - an option row per option, using the shared `CheckboxRow` and `CheckboxBox` with description;
  - the limit message in a status region, only while at the limit and only when provided.

  Verify with `typecheck` and `lint`.
- [x] 3.2 Write `checkbox-group-field.tsx` and `index.ts`:
  - `FieldShell` with `labelFor={false}`, `labelledByRoot`, `rootAria` (described by, busy, aria-label and labelledby without a label) and `headerEnd` (the spinner while `loading`);
  - ids and names per design D4: each box named by its option and described by its description, `aria-invalid` and no `aria-required`;
  - `name`/`value` per box;
  - `loading` and `disabled` lock every box;
  - the group `ref` and `onBlur` when focus leaves the group (design D7).

  Verify with `typecheck` and `lint`.

## 4. CheckboxGroupField tests

- [x] 4.1 Write `tests/checkbox-group-field-value-tests.tsx`. Verify:
  - checking out of order reports the options order;
  - unchecking;
  - controlled and uncontrolled;
  - unknown values;
  - `FormData.getAll(name)` inside a form.
- [x] 4.2 Write `tests/checkbox-group-field-a11y-tests.tsx`. Verify:
  - the group is named by the label and described by helper and info;
  - each box is named by its option and described by its description;
  - `aria-invalid` on every box with `error`;
  - no `aria-required` on the boxes, and the required mark on the label;
  - the warning without a group name;
  - a link in an option label does not toggle;
  - Tab skips disabled boxes, and Space toggles.
- [x] 4.3 Write `tests/checkbox-group-field-extras-tests.tsx` and `checkbox-group-field-layout-tests.tsx`. Verify:
  - select all: state, respect for disabled options and the limit;
  - `maxSelected` disables the unchecked options, and the message is shown only when provided;
  - `data-orientation` and `data-columns`;
  - cards toggle from their empty area;
  - `checkboxPosition="end"` reaches every option;
  - each extra leaves the other defaults unchanged.
- [x] 4.4 Write `tests/checkbox-group-field-states-tests.tsx` and `checkbox-group-field-types-tests.tsx`. Verify:
  - `loading` (every box disabled, spinner, `aria-busy` on the group) and `disabled`;
  - `onBlur` only when focus leaves the group;
  - the `ref` reaches the container;
  - `@ts-expect-error` for `selectAll={{}}`, for a non-array `value` and for `columns={5}`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 5. CheckboxGroupControl

- [x] 5.1 Write `checkbox-group-control-types.ts`, `checkbox-group-control.tsx` (design D7: an object ref whose `focus()` focuses the first enabled box) and `index.ts`. Verify with `typecheck`.
- [x] 5.2 Write `tests/render-in-form.tsx` (`channels: z.array(z.string()).min(1, …)`, `permissions: z.array(z.string()).max(3, …)` and a lenient schema) and `checkbox-group-control-form-tests.tsx`. Verify:
  - it submits a `string[]` in options order;
  - the schema messages;
  - focus on the first enabled box after a failed submit;
  - a missing form value behaves as `[]`;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 5.3 Write `checkbox-group-control-parity-tests.tsx` (plain with select all, cards, columns, ids normalised, inside a form) and `checkbox-group-control-types-tests.tsx` (no `control`, `rules`, `value`, `defaultValue` or `error`, and `selectAll` still needs its label). Verify that the tests pass.

## 6. Package verification

- [x] 6.1 Run `pnpm build && pnpm check:package`. Verify:
  - 14 custom components;
  - `dist/components/checkbox-group-{field,control}` and `dist/internal/components/checkbox-row` exist;
  - no test files in `dist`.

## 7. Stories and docs

- [x] 7.1 Write `checkbox-group-field-docs.ts` (EN/ES):
  - the API of the field and `CheckboxGroupOption`;
  - the value order;
  - select all and the limit;
  - layout (`columns` takes precedence over `orientation`);
  - why `required` does not set `aria-required` on every box;
  - the keyboard table, `aria` notes and theming.
- [x] 7.2 Write `checkbox-group-field-stories.tsx`:
  - a `Playground` with every extra, `maxSelectedMessage` empty by default, and the states;
  - `Basic` and `WithDescriptions` (with a disabled option);
  - `SelectAll`, with a computed-style assertion for the mixed state;
  - `MaxSelected`, with and without the message;
  - `Horizontal`;
  - `Columns`, wide and narrow containers, asserting the computed `grid-template-columns`;
  - `Cards`, asserting the checked highlight;
  - `Keyboard`;
  - `States` and `Responsive`.

  Demo links must not navigate. Verify that they pass in Chromium, axe included.
- [x] 7.3 Write `checkbox-group-control-docs.ts` (EN/ES) and `checkbox-group-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`, with `min(1)` and `max(3)`;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 7.4 Update the guide `fields-and-controls.mdx` (EN/ES) with a "Checkbox group" row and a short section. Verify that the bilingual guide test passes.

## 8. Repository docs and release

- [x] 8.1 Update `README.md` with the pair and an example line. Verify with `pnpm lint`.
- [x] 8.2 Add a `minor` changeset for `CheckboxGroupField` and `CheckboxGroupControl`. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify that all pass, and that the full test suite passes twice in a row.
- [x] 9.2 Take screenshots of the static Storybook build:
  - vertical with select all (mixed);
  - horizontal;
  - columns in a wide and in a narrow container;
  - cards, light and dark;
  - a mobile viewport with touch emulated;
  - RTL;
  - the docs in ES.

  Verify the layout, fix any issue, and record the findings in `design.md`.

## 1. Types and utilities

- [x] 1.1 Write `select-field/types/`: `select-option-types.ts` (`SelectOption`) and `select-field-types.ts` (the D7 unions, `SelectFieldProps` and a `DistributiveOmit` helper), with JSDoc on every prop. State in each JSDoc that there is no default text. Verify with `typecheck`.
- [x] 1.2 Write `select-field/utils/normalize-text.ts` and `group-options.ts`, with tests. Verify:
  - case and diacritics ("España" ≈ "espana");
  - groups keep their order of first appearance;
  - ungrouped options come first;
  - a value is resolved to its label.

## 2. Hooks

- [x] 2.1 Write `hooks/use-select-value.ts` (design D6) with tests. Verify:
  - single and multiple, controlled and uncontrolled;
  - toggle, clear, removeLast;
  - `maxSelected` and `canSelectMore`;
  - select all respects disabled options and the limit, and reports a mixed state;
  - sentinels never reach `onValueChange`.
- [x] 2.2 Write `hooks/use-select-options.ts` (design D5) with tests. Verify:
  - the local filter ignores case and accents;
  - `filter={false}` does not filter;
  - the creatable item appears only without an exact match;
  - options are disabled at the limit;
  - an orphan-value warning is emitted once.
- [x] 2.3 Write `hooks/use-missing-text-warnings.ts` (design D8) with tests: one warning per missing feature text, naming the prop, plus `creatable` without `searchable`.

## 3. Components

- [x] 3.1 Write `components/parts.ts`, the adapter of Base UI Select and Combobox parts (design D1). Verify with `typecheck`.
- [x] 3.2 Write `components/select-frame.tsx` and `select-chips.tsx` (design D3):
  - no nested interactive elements;
  - an sr-only list of the selected labels in chips mode;
  - Backspace removes the last chip;
  - the chevron forwards clicks to the trigger;
  - chevron, clear and chips use logical properties.

  Verify with `typecheck` and `lint`.
- [x] 3.3 Write `components/select-popup-content.tsx` and `select-option-item.tsx` (design D4):
  - the search header;
  - the status region, with messages in priority order and only when their prop is set;
  - the limit message;
  - groups;
  - items with indicator, icon, label, description and touch height;
  - the select-all item (mixed state);
  - the create item.

  Verify with `typecheck`.
- [x] 3.4 Write `select-field.tsx` and `index.ts`:
  - pick the root by `searchable`;
  - `FieldShell` + `useFieldA11y` wired to the trigger;
  - `loading` and `disabled` keep the popup closed;
  - the hidden input `name` for native forms;
  - controlled `open` for `closeOnSelect`.

  Verify with `typecheck` and `lint`.

## 4. SelectField tests

- [x] 4.1 Write `tests/select-field-single-tests.tsx` and `select-field-multiple-tests.tsx`. Verify:
  - open with the keyboard, select, close, focus back on the trigger;
  - controlled and uncontrolled;
  - in multiple, toggling keeps the popup open;
  - chips: remove with ✕ and with Backspace;
  - summary text;
  - clear;
  - `closeOnSelect` overrides.
- [x] 4.2 Write `tests/select-field-messages-tests.tsx`. For each message (`placeholder`, `emptyMessage`, `noResultsMessage`, `optionsLoadingMessage`, `maxSelectedMessage`), verify that it is absent without its prop, and present in its situation with the prop, inside the status region where applicable.
- [x] 4.3 Write `tests/select-field-search-tests.tsx` and `select-field-extras-tests.tsx`. Verify:
  - the search box is labelled and focused on open, and the filter ignores accents;
  - `onSearchChange`;
  - `filter={false}` with `optionsLoading`;
  - groups and descriptions;
  - disabled options;
  - `maxSelected`;
  - `selectAll`;
  - `creatable` calls `onCreate`.
- [x] 4.4 Write `tests/select-field-a11y-tests.tsx`, `select-field-states-tests.tsx` and `select-field-types-tests.tsx`. Verify:
  - the trigger has `role="combobox"` and `aria-expanded`;
  - it is labelled by the label, with `aria-describedby`, `aria-invalid` and `aria-required`;
  - the names of clear and of each chip button;
  - `loading` and `disabled` do not open, and the `ref` reaches the trigger;
  - the hidden input carries `name`;
  - type errors for each missing required text, `creatable` without `searchable`, and `multiple` without `multipleDisplay`;
  - the development warnings in untyped usage.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 5. SelectControl

- [x] 5.1 Write `select-control-types.ts`, `select-control.tsx` and `index.ts` (design D9). Verify with `typecheck`.
- [x] 5.2 Write `tests/render-in-form.tsx` (single `country: z.string({ error })` with nullable handling, multiple `tags: z.array(z.string()).min(1)`, and a lenient schema) and `select-control-form-tests.tsx`. Verify:
  - single submits a string, and multiple submits an array;
  - schema messages;
  - `null` and `[]` when cleared;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 5.3 Write `select-control-parity-tests.tsx` (closed field, ids normalised, in single, chips and summary) and `select-control-types-tests.tsx` (no `control`, `rules`, `value`, `defaultValue` or `error`, and the unions still enforce the required texts). Verify that the tests pass.

## 6. Package verification

- [x] 6.1 Run `pnpm build && pnpm check:package`. Verify:
  - 10 custom components;
  - `dist/components/select-{field,control}` exist;
  - no test files in `dist`.

## 7. Stories and docs

- [x] 7.1 Write `select-field-docs.ts` (EN/ES):
  - `api` grouped by Options and value, Messages, Feature texts (required when enabled), Search, Multiple, Extras and Family;
  - every message is documented as "no default";
  - the keyboard table, `aria` notes and theming.
- [x] 7.2 Write `select-field-stories.tsx`:
  - a `Playground`, with messages as empty text controls and the Action group;
  - `Single`, `Multiple`, `MultipleSummary`, `Searchable`, `GroupsAndDescriptions`;
  - `Messages`, showing each situation with and without its text;
  - `ServerSearch` (local simulated delay), `LimitAndSelectAll`, `Creatable`;
  - `Keyboard`, whose play opens, navigates, uses typeahead, selects and checks that Escape returns focus;
  - `States` and `Responsive`.

  Verify that they pass in Chromium, axe included.
- [x] 7.3 Write `select-control-docs.ts` (EN/ES) and `select-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`, single and multiple;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 7.4 Update the guide `fields-and-controls.mdx` (EN/ES): a "Select" row and a section on developer-provided messages and the feature texts each option requires. Verify that the bilingual guide test passes.

## 8. Repository docs and release

- [x] 8.1 Update `README.md` (the Select pair) and `CONTRIBUTING.md` (the "no default messages" rule: visible messages render nothing when omitted, and feature texts are required by TypeScript when the feature is on). Verify with `pnpm lint`.
- [x] 8.2 Add a `minor` changeset for `SelectField` and `SelectControl`. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass.
- [x] 9.2 Take screenshots of the static Storybook build:
  - single, chips and summary in light and dark;
  - the popup open with groups and search;
  - a mobile viewport with touch emulated;
  - RTL;
  - the SelectField docs in ES.

  Verify the layout and record any issue as a follow-up task before archiving.

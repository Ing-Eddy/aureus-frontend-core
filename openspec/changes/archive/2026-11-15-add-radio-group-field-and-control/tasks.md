## 1. Shared internals

- [x] 1.1 Rename `src/internal/components/checkbox-row` to `choice-row` (design D1):
  - `ChoiceRow`, `choiceStyles` and `CheckboxBox`;
  - add the `slot` prop (default `"checkbox"`), which keeps the current `data-slot` names;
  - generic card selectors on the box slot;
  - `[role=radio]` in the interactive skip list;
  - the `after` slot.

  Update `CheckboxField` and `CheckboxGroupField`. Verify that the Checkbox and Checkbox group unit tests and parity pass unchanged, and that the row tests cover `slot="radio"` and `after`.
- [x] 1.2 Add `internal/types/choice-option-types.ts` (`ChoiceOption`) and make `CheckboxGroupOption` an alias of it (design D2). Verify with `typecheck`.
- [x] 1.3 Move the column and orientation classes to `choice-row/choice-layout.ts` (design D3) and switch `CheckboxGroupOptions` to it. Verify that the checkbox group layout tests pass, with the same classes.

## 2. Types and hooks

- [x] 2.1 Write `radio-group-field/types/radio-group-field-types.ts`:
  - `RadioGroupOption`, an alias of `ChoiceOption`;
  - `RadioGroupFieldClassNames` (`options`, `option`, `radio`, `optionLabel`, `other`);
  - `RadioGroupFieldProps`, with `otherOption: { label; inputLabel; placeholder? }`, `deselectable`, `appearance: "plain" | "card" | "segmented"`, `radioPosition`, `orientation`, `columns`, the value props and the family props, plus JSDoc stating there is no default text.

  Verify with `typecheck`.
- [x] 2.2 Write `hooks/use-radio-group-value.ts` (design D5) with tests. Verify:
  - `null` by default;
  - controlled and uncontrolled;
  - the Radix id mapping (option, other, none);
  - an unknown value is kept and warned once;
  - with `otherOption`, an unknown value is the other text, without a warning;
  - choosing other reports the previous custom text or `""`;
  - deselect reports `null`.
- [x] 2.3 Write `hooks/use-radio-group-warnings.ts` with tests. Verify the warning without a group name and for an empty `otherOption.inputLabel`, and silence otherwise.

## 3. Components

- [x] 3.1 Write `components/radio-group-options.tsx` (design D4):
  - the shadcn `RadioGroup` root with the radiogroup ARIA, `orientation` mapping and the shared layout classes;
  - a `ChoiceRow slot="radio"` per option, with shadcn's `RadioGroupItem`;
  - the other option row with its input in `after`;
  - the deselect `onClick` when `deselectable`.

  Verify with `typecheck` and `lint`.
- [x] 3.2 Write `components/radio-other-input.tsx` (design D6): focus when chosen by the user, locked with the group. Then write `components/radio-segmented.tsx` (design D7): a track and segments on Radix `RadioGroup.Item` with arbitrary `data-[state=checked]` styles, touch heights, and the other input below the track. Verify with `typecheck` and `lint`.
- [x] 3.3 Write `radio-group-field.tsx` and `index.ts`:
  - `FieldShell` with `labelFor={false}` and `headerEnd` (the spinner);
  - the outer `data-slot="radio-group"` wrapper (`@container`, `onBlur` when focus leaves);
  - the `ref` to the radiogroup;
  - `name` for native forms;
  - `loading` and `disabled` lock every radio and set `aria-disabled`, and `loading` also sets `aria-busy`.

  Verify with `typecheck` and `lint`.

## 4. RadioGroupField tests

- [x] 4.1 Write `tests/radio-group-field-value-tests.tsx`. Verify:
  - exclusive selection;
  - `null` by default;
  - controlled and uncontrolled;
  - an unknown value checks nothing;
  - `FormData.get(name)` inside a form.
- [x] 4.2 Write `tests/radio-group-field-a11y-tests.tsx` and `radio-group-field-keyboard-tests.tsx`. Verify:
  - the radiogroup is named and described, with `aria-required` and `aria-invalid`;
  - each radio is named and described by its option;
  - the warning without a name;
  - a link in a label does not select;
  - Tab enters on the checked or first enabled radio and the next Tab leaves;
  - Space checks.

  Arrow navigation is asserted in the Chromium story.
- [x] 4.3 Write `tests/radio-group-field-extras-tests.tsx`, `-layout-tests.tsx`, `-segmented-tests.tsx` and `-other-tests.tsx`. Verify:
  - cards select from their empty area;
  - `radioPosition="end"`;
  - orientation, columns and the Radix `orientation` attribute;
  - segmented: a radio per segment, named by its label, with no description rendered;
  - other: it appears, takes focus, its text is the value, its clicks do not change the selection, and choosing another option hides it;
  - `deselectable`, and the default keeping the selection;
  - each extra leaves the other defaults unchanged.
- [x] 4.4 Write `tests/radio-group-field-states-tests.tsx` and `-types-tests.tsx`. Verify:
  - `loading` (every radio disabled, spinner, `aria-busy` and `aria-disabled`) and `disabled`;
  - `onBlur` only when focus leaves the group;
  - the `ref` reaches the radiogroup;
  - `@ts-expect-error` for `otherOption` without `inputLabel`, for a non-string `value` and for `columns={5}`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 5. RadioGroupControl

- [x] 5.1 Write `radio-group-control-types.ts`, `radio-group-control.tsx` (design D8: an object ref that focuses the checked radio or the first enabled one) and `index.ts`. Verify with `typecheck`.
- [x] 5.2 Write `tests/render-in-form.tsx` (`plan: z.string({ error })`, `source: z.string().min(1, …)` with an other option, and a lenient schema) and `radio-group-control-form-tests.tsx`. Verify:
  - it submits a string;
  - it submits the other option's text;
  - the schema messages, and `aria-invalid` on the radiogroup;
  - focus on the first enabled radio after a failed submit, and on the checked one when there is one;
  - a missing form value behaves as `null`;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 5.3 Write `radio-group-control-parity-tests.tsx` (plain, card, segmented and other, ids normalised, inside a form) and `radio-group-control-types-tests.tsx` (no `control`, `rules`, `value`, `defaultValue` or `error`, and `otherOption` still needs `inputLabel`). Verify that the tests pass.

## 6. Package verification

- [x] 6.1 Run `pnpm build && pnpm check:package`. Verify:
  - 16 custom components;
  - `dist/components/radio-group-{field,control}` and `dist/internal/components/choice-row` exist;
  - no `checkbox-row` leftovers;
  - no test files in `dist`.

## 7. Stories and docs

- [x] 7.1 Write `radio-group-field-docs.ts` (EN/ES):
  - the API and the option type;
  - the keyboard table (Tab, arrows by orientation, Space, Home/End where Radix supports them);
  - the `aria` notes;
  - `deselectable` versus the standard;
  - segmented limits;
  - the other option value rules;
  - RTL with shadcn's `DirectionProvider`.
- [x] 7.2 Write `radio-group-field-stories.tsx`:
  - a `Playground` with every extra off by default (empty texts for other);
  - `Basic` and `WithDescriptions`;
  - `Horizontal`;
  - `Columns`, wide and narrow containers, asserting the computed tracks;
  - `Cards`, asserting the computed highlight and the opacity of enabled radios next to a disabled one;
  - `Segmented`, asserting the computed checked segment style and touch height;
  - `OtherOption`;
  - `Deselectable`;
  - `Keyboard`: Tab entry, Down and Right Arrow skipping a disabled option and wrapping, Space;
  - `States` and `Responsive`.

  Demo links must not navigate. Verify that they pass in Chromium, axe included.
- [x] 7.3 Write `radio-group-control-docs.ts` (EN/ES) and `radio-group-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`, with a required plan and an other option with `min(1)`;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 7.4 Update the guide `fields-and-controls.mdx` (EN/ES) with a "Radio group" row and a short section. Verify that the bilingual guide test passes.

## 8. Repository docs and release

- [x] 8.1 Update `README.md` with the pair and an example line. Verify with `pnpm lint`.
- [x] 8.2 Add a `minor` changeset for `RadioGroupField` and `RadioGroupControl`. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify that all pass, and that the full test suite passes twice in a row.
- [x] 9.2 Take screenshots of the static Storybook build:
  - vertical;
  - horizontal;
  - columns, wide and narrow;
  - cards and segmented, light and dark;
  - the other option open;
  - a mobile viewport with touch emulated;
  - RTL;
  - the docs in ES.

  Verify the layout, fix any issue, and record the findings in `design.md`.

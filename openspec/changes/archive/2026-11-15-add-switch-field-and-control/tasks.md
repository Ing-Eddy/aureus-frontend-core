## 1. Shared internals

- [x] 1.1 Move the value types to `internal/types/toggle-value-types.ts` (`ToggleValue`, `ToggleBooleanValueProps`, `ToggleCustomValueProps<V>`), and keep the checkbox type names as aliases (design D1). Verify with `typecheck`, and check that the public exports of `checkbox-field` are unchanged.
- [x] 1.2 Move `use-checkbox-value.ts` and its tests to `internal/hooks/use-toggle-value.ts` (`useToggleValue`), and update `CheckboxField`. Verify that the Checkbox and Checkbox control unit tests and parity pass unchanged.
- [x] 1.3 Add `slot="switch"` and the `${slot}-state-label` text part to `ChoiceRow`, then write `choice-row/switch-box.tsx` (design D2 and D3):
  - the Radix `Switch.Root` and `Switch.Thumb` with shadcn's classes copied and commented;
  - the RTL thumb fix and `motion-reduce`;
  - the thumb slot (spinner while busy, else the `thumbIcons` entry);
  - sizes;
  - the state label with reserved width.

  Write row and box tests (slot names, state label clicks, aria-hidden decorations, spinner while busy). Verify that every package test passes.

## 2. Types and hooks

- [x] 2.1 Write `switch-field/switch-field-types.ts` (design D6), with JSDoc stating there is no default text. Verify with `typecheck`.
- [x] 2.2 Write `hooks/use-switch-change.ts` (design D4) with tests. Verify:
  - immediate without a guard;
  - synchronous `true` and `false`;
  - a pending promise that confirms, resolves `false` or rejects;
  - toggles ignored while pending;
  - no commit after unmount.
- [x] 2.3 Write `hooks/use-switch-warnings.ts` with tests: the warning without a name, and silence with any name source.

## 3. Field

- [x] 3.1 Write `switch-field.tsx` and `index.ts`:
  - overloads (boolean and `const V`);
  - `FieldShell` naming per design D5;
  - `ChoiceRow slot="switch"` with `SwitchBox`;
  - `loading` (Radix disabled, spinner, `aria-busy`) and pending (`aria-disabled`, spinner, `aria-busy`);
  - native `name`/`value`;
  - `ref`, `action`, `onBlur`;
  - the helper indented in a plain start row.

  Verify with `typecheck` and `lint`.

## 4. SwitchField tests

- [x] 4.1 Write `tests/switch-field-value-tests.tsx`. Verify:
  - boolean and custom values;
  - controlled and uncontrolled;
  - an unknown value shows off;
  - text clicks toggle;
  - native `FormData`.
- [x] 4.2 Write `tests/switch-field-a11y-tests.tsx`. Verify:
  - `role="switch"` and `aria-checked`;
  - the naming cases and the warning;
  - `aria-describedby`, `aria-invalid` and `aria-required`;
  - a link in the text does not toggle;
  - Space and Enter toggle;
  - state labels and thumb icons are `aria-hidden` and outside the accessible name.
- [x] 4.3 Write `tests/switch-field-extras-tests.tsx` and `switch-field-async-tests.tsx`. Verify:
  - position, card (empty-area click) and size;
  - state labels and thumb icons follow the state;
  - async confirm, reject and throw, with the switch staying in its state, the spinner and `aria-busy` while pending, and keys and clicks ignored while pending;
  - each extra leaves the other defaults unchanged.
- [x] 4.4 Write `tests/switch-field-states-tests.tsx` and `switch-field-types-tests.tsx`. Verify:
  - `loading` (no change, spinner in the thumb, `aria-busy`) and `disabled`;
  - error message;
  - the `ref` reaches the switch;
  - `@ts-expect-error` for one custom value alone, `stateLabels` without `off` and `thumbIcons` without `on`;
  - the inferred `"public" | "private"` in `onValueChange` and `onBeforeChange`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 5. SwitchControl

- [x] 5.1 Write `switch-control-types.ts`, `switch-control.tsx` (overloads, design D7) and `index.ts`. Verify with `typecheck`.
- [x] 5.2 Write `tests/render-in-form.tsx` (`consent: z.literal(true, …)`, `alerts: z.boolean()`, `visibility: z.enum(["public","private"])` and a lenient schema) and `switch-control-form-tests.tsx`. Verify:
  - a boolean and a custom value are submitted;
  - the schema message and focus;
  - with `onBeforeChange` resolving `false`, the form keeps the old value, and with `true` it stores the new one;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 5.3 Write `switch-control-parity-tests.tsx` (plain, card with state labels, end and small, ids normalised, inside a form) and `switch-control-types-tests.tsx`. Verify that the tests pass.

## 6. Package verification

- [x] 6.1 Run `pnpm build && pnpm check:package`. Verify:
  - 18 custom components;
  - `dist/components/switch-{field,control}` exist;
  - no test files in `dist`.

## 7. Stories and docs

- [x] 7.1 Write `switch-field-docs.ts` (EN/ES):
  - the API;
  - switch versus checkbox (immediate effect versus confirming with a button);
  - the asynchronous change contract;
  - decorative state labels and icons;
  - the keyboard table (Space, Enter, Tab), `aria` notes, RTL and theming.
- [x] 7.2 Write `switch-field-stories.tsx`:
  - a `Playground`, with a value mode and an async mode (confirm or reject after 800 ms);
  - `Basic`, `LabelAndText`, `SettingsList` and `Cards`;
  - `StateLabels`, `ThumbIcons` and `CustomValues`;
  - `AsyncChange`: confirm and reject, asserting the spinner and that the value goes back;
  - `Keyboard`, `States` and `Responsive`;
  - `Rtl`, asserting the computed thumb position;
  - `ShadcnParity`, the drift guard comparing the computed sizes and colours of `SwitchBox` and shadcn's `Switch`.

  Demo links must not navigate. Verify that they pass in Chromium, axe included.
- [x] 7.3 Write `switch-control-docs.ts` (EN/ES) and `switch-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`;
  - `CustomValues`;
  - `AsyncSave`, where only confirmed values reach the payload;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 7.4 Update the guide `fields-and-controls.mdx` (EN/ES) with a "Switch" row and a short section. Verify that the bilingual guide test passes.

## 8. Repository docs and release

- [x] 8.1 Update `README.md` with the pair and an example line. Verify with `pnpm lint`.
- [x] 8.2 Add a `minor` changeset for `SwitchField` and `SwitchControl`. Verify that `pnpm changeset status` lists it.

## 9. Final verification

- [x] 9.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify that all pass, and that the full test suite passes twice in a row.
- [x] 9.2 Take screenshots of the static Storybook build:
  - basic;
  - settings list;
  - cards;
  - state labels and thumb icons;
  - the pending spinner;
  - light and dark;
  - a mobile viewport with touch emulated;
  - RTL;
  - the docs in ES.

  Verify the layout, fix any issue, and record the findings in `design.md`.

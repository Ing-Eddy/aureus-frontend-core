## 1. Internal additions

- [x] 1.1 Extend `internal/components/input-field/input-field.tsx` with `startSlot`, `inputEndSlot` and `endSlot` (design D7). Verify that `pnpm --filter @aureus-core/ui test` passes **without editing any Text or Password test**, the parity tests included, and add `input-field-tests` cases for each slot's position.
- [x] 1.2 Add to `fieldStrings`: `increase`, `decrease`, `minus`, `invalidExpression` and `calculatedFrom(source)`. Add the stepper and number-input class constants to `field-styles.ts`. Verify with `typecheck`.
- [x] 1.3 Write `internal/components/field-stepper/` (design D8), including `hooks/use-press-and-hold.ts` and `hooks/use-stepper-layout.ts`, and export it from `internal/components/index.ts`. Write `field-stepper-tests.tsx`, using fake timers and a stubbed `matchMedia`. Verify:
  - the names and `aria-controls`;
  - `tabIndex=-1`;
  - `pointerdown` does not move focus;
  - one immediate step, then repeats every 60 ms after 400 ms, stopping on pointerup and pointerleave and when the button is disabled;
  - the buttons are disabled at the limits;
  - stacked switches to split on a coarse pointer.
- [x] 1.4 Add `mapControllerToValueField` to `internal/utils/helpers` (design D10), with tests: the `null` default, `onValueChange` → `field.onChange(number)`, the composed `onBlur`, the merged ref and the error mapping.

## 2. Number utilities (pure, unit-tested)

- [x] 2.1 `utils/number-locale.ts` + tests: the symbols for `en-US`, `es-ES`, `de-CH` and `fr-FR` (narrow no-break space); the currency symbol in `symbol`, `narrowSymbol` and `code` display; memoisation.
- [x] 2.2 `utils/decimal-math.ts` + tests: `round(1.005, 2) = 1.01`, `round(-1.005, 2) = -1.01`, `addScaled(0.1, 0.2) = 0.3`, `addScaled(1.1, -0.01)`, `clamp`, `maxSafe`.
- [x] 2.3 `utils/parse-number.ts` + tests: plain, grouped, locale decimals, currency and code, spaces, `(500)`, trailing minus, both separators (`1.234,50 €` in `en-US`), `allowNegative: false`, empty → `null`, garbage → `undefined`.
- [x] 2.4 `utils/format-number.ts` + tests:
  - `formatDisplay`: grouping on and off, `decimals` + `padDecimals`, padding ignored without `decimals`, parentheses, `es-ES`;
  - `formatPartial`: a trailing separator, a lone `-`, typed fraction zeros, grouping while typing;
  - `formatEditing`;
  - `sanitize`: decimals cap, one separator, sign rules, shorthand and expression characters only when enabled.
- [x] 2.5 `utils/caret.ts` + tests: insert in the middle with grouping, delete across a separator, caret at the end, after the sign.
- [x] 2.6 `utils/shorthand.ts` and `utils/evaluate-expression.ts` + tests:
  - shorthand: k, m and b, upper case, decimals, negative;
  - expressions: precedence, parentheses, unary minus, leading `=`, locale decimals, division by zero, invalid input;
  - expression detection: `-5` is not an expression, `5-3` is, `=-5` is;
  - a test that the module source contains neither `eval` nor `Function(`.

## 3. NumberField

- [x] 3.1 Write `number-field-types.ts` (design D10), with JSDoc on every prop that states its default and that it is independent. Verify with `typecheck`.
- [x] 3.2 Write the hooks (designs D1 and D6): `use-number-input.ts`, `use-number-keyboard.ts`, `use-wheel-step.ts`, `use-remembered-expression.ts` and `hooks/index.ts`. Verify with `typecheck`.
- [x] 3.3 Write `number-field.tsx` and `index.ts`:
  - `InputField` with the slots;
  - `FieldStepper`;
  - the currency, prefix and suffix addons;
  - the a11y attributes (design D9);
  - the expression error merged with the field error;
  - the sr-only "Calculated from" description;
  - the development warning above `maxSafe`.

  Verify with `typecheck` and `pnpm lint`.
- [x] 3.4 Write the `number-field/tests/` files:
  - `number-field-independence-tests.tsx`:
    - with no props it is plain (`122345`);
    - currency only adds a symbol;
    - `currency` + `decimals={0}` gives integers;
    - grouping on and off with and without currency;
    - `padDecimals` without `decimals` is a no-op;
    - prefix + suffix + currency together.
  - `number-field-typing-tests.tsx`:
    - live grouping and caret;
    - decimals cap;
    - pad on blur;
    - `allowNegative`;
    - paste of formatted text and of garbage;
    - Enter commits;
    - Escape reverts;
    - `onValueChange` with numbers and `null`;
    - controlled and uncontrolled use.
  - `number-field-keyboard-tests.tsx`:
    - arrows, Shift, PageUp and PageDown, Home and End;
    - `clampOnBlur` on and off;
    - `wheel` with and without focus, preventing the page scroll.
  - `number-field-stepper-tests.tsx`:
    - stacked, split and hidden layouts;
    - the buttons step and are disabled at the limits, while loading and while disabled;
    - focus stays in the input.
  - `number-field-extras-tests.tsx`:
    - parentheses and red on blur, minus while editing;
    - shorthand;
    - an expression is committed, remembered, shown on focus, edited and recommitted;
    - the expression is forgotten after a step, an external value or an unmount;
    - an invalid expression shows the error state and keeps the text;
    - `selectOnFocus`.
  - `number-field-a11y-tests.tsx`:
    - `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`;
    - `aria-valuetext` with currency and "minus";
    - the "Calculated from" description;
    - the shared contract (label, required, helper, info, error);
    - `inputMode` and `dir`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 4. NumberControl

- [x] 4.1 Write `number-control-types.ts`, `number-control.tsx` and `index.ts` (design D10). Verify with `typecheck`.
- [x] 4.2 Write `tests/render-in-form.tsx` (`amount: z.number().min(1).max(10000)`, `qty: z.number().nullable()`, plus a lenient schema) and `number-control-form-tests.tsx`. Verify:
  - a number is submitted, and `1,250.5` with grouping reaches the form as `1250.5`;
  - the schema message;
  - `null` when cleared;
  - `disabled` excludes the value and `loading` keeps it;
  - a remembered expression submits its result;
  - it throws outside a `FormProvider`.
- [x] 4.3 Write `number-control-parity-tests.tsx` (ids normalised) and `number-control-types-tests.tsx`. Verify:
  - parity in the default state, with currency + grouping + decimals + stepper split, and in error;
  - `control`, `rules`, `value`, `defaultValue`, `error`, `type` and `step` as a string are type errors.

## 5. Package verification

- [x] 5.1 Run `pnpm build && pnpm check:package`. Verify:
  - 8 custom components;
  - `dist/components/number-{field,control}` and `dist/internal/components/field-stepper` exist;
  - nothing from `tests/` or from the util tests ends up in `dist`.

## 6. Stories and docs

- [x] 6.1 Write `number-field-docs.ts`, complete in EN and ES:
  - `api` grouped by Value, Limits, Steps, Format, Negatives, Stepper, Conveniences and Family, with every default stated;
  - the `action` and `classNames` entries;
  - the full `keyboard` table;
  - `aria` notes: spinbutton, `aria-valuetext`, buttons outside Tab, touch switch to split, remembered expressions;
  - `theming`.
- [x] 6.2 Write `number-field-stories.tsx`:
  - a `Playground` with controls grouped by Format, Stepper, Behavior and Events, plus the Action group;
  - `Basic`, `Grouping`, `Decimals` and `PrefixSuffixCurrency`;
  - `Accounting`;
  - `Expressions`, whose play goes through `=3+3` → 6 → `=3+3` → `=3+4` → 7;
  - `StepperLayouts`;
  - `Keyboard`;
  - `LiveFormatting`, whose play checks the caret in Chromium;
  - `Paste`, `States` and `Responsive`.

  Verify that the stories pass in Chromium, axe included.
- [x] 6.3 Write `number-control-docs.ts` (EN/ES) and `number-control-stories.tsx`, with a `DemoForm` decorator:
  - `Playground`;
  - `WithSchema`;
  - `DisabledVsLoading`, with the payload showing numbers;
  - `Parity`.

  Verify that the stories and `coverage-tests.ts` pass.
- [x] 6.4 Update the guide `fields-and-controls.mdx` (EN/ES): a "Number" row, and a section on independent formatting, stepper layouts, keyboard, and shorthand and expressions. Verify that the bilingual guide test passes.

## 7. Repository docs and release

- [x] 7.1 Update `README.md` (the Number pair) and `CONTRIBUTING.md` (the `InputField` slots, `FieldStepper`, `mapControllerToValueField` for value-based controls, and the multipurpose rule: independent opt-in props). Verify with `pnpm lint`.
- [x] 7.2 Add a `minor` changeset for `NumberField` and `NumberControl`. Verify that `pnpm changeset status` lists it.

## 8. Final verification

- [x] 8.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass.
- [x] 8.2 Take screenshots of the static Storybook build:
  - PrefixSuffixCurrency and Accounting in light and dark;
  - StepperLayouts;
  - Responsive with a mobile viewport and a coarse pointer emulated (split shown);
  - RTL;
  - the NumberField docs in ES.

  Verify the layout and record any issue as a follow-up task before archiving.

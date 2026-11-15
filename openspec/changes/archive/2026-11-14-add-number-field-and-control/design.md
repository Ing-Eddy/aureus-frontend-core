## Context

The current state relevant to the approach. For motivation, see proposal.md (Why). For requirements, see `specs/form-fields/spec.md`.

- **`InputField`** (`packages/ui/src/internal/components/input-field/input-field.tsx`) renders:
  - `FieldShell` → `InputGroup` (with `fieldFrameClassName`) → `InputGroupInput`, forcing `type` after the spread;
  - one inline-end `InputGroupAddon` (with `fieldAddonClassName`) holding `FieldLoading` and then `FieldAction`.

  `TextField` and `PasswordField` render it, and their tests and parity tests must keep passing untouched.
- **`InputGroup`** (shadcn) lays out addons with `order-first`/`order-last`. `InputGroupText` exists for plain text addons.
- **`useControllableState`**, **`useFieldA11y`** and **`mergeRefs`** are available in `internal/`. `mapControllerToField` maps `onChange(event)` to `field.onChange(event)`. That suits text inputs, but not a value-based field: react-hook-form would store the event's string.
- **Tailwind v4** has the `pointer-coarse:` variant. Duplicating the buttons per pointer type with CSS would put two "Increase" buttons in the DOM, and jsdom ignores CSS when tests query roles.
- **`Intl.NumberFormat`** is available in every target browser. `formatToParts` gives the locale's group, decimal, minus and currency symbols.
- **Playground:**
  - `field-action-args.tsx` provides the Action controls;
  - `coverage-tests.ts` requires stories and docs for every `src/components/*`.

## Goals / Non-Goals

**Goals:**
- Pure, exhaustively unit-tested number utilities: parse, format, caret, decimal math, shorthand and expressions. The component is a thin state machine on top of them.
- Independent props with neutral defaults, proven by tests.
- No change to the markup of Text and Password.

**Non-Goals:**
- Arbitrary precision (big decimals).
- Locale-specific numeral systems other than Latin digits. `Intl` output is normalised to `0-9`.
- A public formatting API.

## Decisions

### D1. Value model: draft text and committed value
`useNumberInput` keeps:
- **`value`** (`useControllableState` over `value`/`defaultValue`/`onValueChange`);
- **`draft`**, the text shown while focused;
- **`snapshot`**, the draft and value at focus or at the last commit, used by Escape;
- **`focused`**.

The display depends on focus:
- **Blurred:** `formatDisplay(value)`, which applies grouping, padding, parentheses and the negative color flag.
- **Focused:** the draft.

The transitions:
- **Focus:**
  - the draft is the remembered expression if `value === remembered.result`, otherwise `formatEditing(value)` (grouping, minus sign, no padding, no parentheses);
  - with `selectOnFocus`, the whole text is selected.
- **Input:**
  - `sanitize` (allowed characters only, at most one decimal separator, fraction limited to `decimals`, the sign if allowed) runs first, then the live format and the caret restore (D3);
  - if the draft parses, `setValue(parsed)`; unfinished drafts (`-`, `1,234.`, or an expression) do not report.
- **Commit** (blur or Enter):
  1. the expression or shorthand is resolved;
  2. `parse`, `round(decimals)` and `clamp` (if `clampOnBlur`) run;
  3. `setValue`, the draft becomes `formatEditing`, and the snapshot is updated;
  4. if an expression was used, it is remembered.
  - Enter calls `preventDefault` only if the text changed on commit; otherwise the form submits as usual.
- **Escape:** restores the draft and value from the snapshot.
- **Step** (keys, buttons, wheel): `addScaled(value ?? clamp(0), ±step)`, then clamp, `setValue`, draft update, and the expression is forgotten.

### D2. Locale symbols (`utils/number-locale.ts`)
- `getNumberSymbols(locale)` uses `Intl.NumberFormat(locale).formatToParts(-12345.6)` to read `group`, `decimal` and `minusSign`.
- `getCurrencySymbol(locale, currency, display)` reads the `currency` part.
- Both are memoised by key.
- Narrow no-break and no-break spaces used as group separators are normalised: a typed space or ` ` is accepted in parsing.

### D3. Live format and caret (`utils/format-number.ts`, `utils/caret.ts`)
- **`formatPartial(text, options)`:**
  - groups the integer part when `grouping` is on;
  - keeps a trailing decimal separator, a lone `-` and the zeros typed in the fraction;
  - never pads.
- **Caret:**
  - `countSignificant(text, caret)` counts the digits, the decimal separator and the minus sign left of the caret;
  - `caretFromCount(formatted, count)` returns the index just after the same count in the new text;
  - the caret is applied in a `useLayoutEffect` after the controlled value renders.
- **Deleting a separator:** Backspace right after a group separator (`1,|234`) deletes the digit before it. This avoids the "stuck caret" problem.

### D4. Parsing (`utils/parse-number.ts`)
`parseNumber(text, symbols, { allowNegative })`:
1. Trim the text and detect accounting parentheses or a leading or trailing minus.
2. Strip the currency symbols, codes and spaces, and the group separator.
3. Map the locale decimal separator to `.`.
4. Accept only `^\d*\.?\d*$`.

It returns `number | null`, or `undefined` for unparseable text, which leaves the value unchanged. Paste reuses it before sanitising. When the pasted text has both `,` and `.`, the last one is the decimal separator, so `1.234,50 €` pastes correctly in `en-US` too.

### D5. Decimal math (`utils/decimal-math.ts`)
- **`round(value, decimals)`:** `Number(Math.round(Number(\`${abs}e${d}\`)) + \`e-${d}\`)` with the sign restored. This rounds half away from zero without the binary floating-point artefacts.
- **`addScaled(a, b)`:** scales both numbers to the larger number of decimals, adds integers and scales back.
- **`clamp`.**
- **`maxSafe(decimals)`:** `Number.MAX_SAFE_INTEGER / 10^decimals`, used by the development warning.

### D6. Shorthand and expressions
- **`applyShorthand(text)`** matches `^(-?[\d.,\s]+)\s*([kmb])$`, case-insensitive, and multiplies by 1e3, 1e6 or 1e9.
- **`evaluateExpression(text, symbols)`** is a tokenizer plus shunting-yard plus RPN evaluation:
  - it supports numbers in the locale format, `+ - * /`, parentheses, unary minus and an optional leading `=`;
  - it returns `{ ok: true, value }` or `{ ok: false }`, and division by zero is invalid;
  - there is no `eval` and no `Function`.
- **When a text is treated as an expression:** when it starts with `=`, or when it contains an operator after its first character.
- **`useRememberedExpression`** stores `{ source, result }` in `useRef` state.
  - The number field calls `forget()` on any step, and on a commit of plain text.
  - An effect forgets the expression when `value !== result`, which covers changes from outside.
  - While remembered, the description gets `fieldStrings.calculatedFrom(source)` through an sr-only span id added to `aria-describedby`.
  - An invalid expression sets an internal `expressionError`, which is OR-ed with `props.error`. Its message is `fieldStrings.invalidExpression`, overridable with `invalidExpressionLabel`.

### D7. `InputField` addon slots
`InputFieldProps` gains three optional props:
- `startSlot?: ReactNode`, rendered before the input with `order-first`;
- `inputEndSlot?: ReactNode`, rendered first inside the inline-end addon, before the spinner and the action;
- `endSlot?: ReactNode`, rendered after the inline-end addon with `order-last`.

The inline-end addon renders when `loading || action || inputEndSlot`. Text and Password pass none of them, so their markup is unchanged; their existing tests prove it.

Number field mapping:
- `startSlot`: the split decrease button, then the currency and prefix (`InputGroupAddon align="inline-start"` with `InputGroupText`);
- `inputEndSlot`: the suffix (`InputGroupText`);
- `endSlot`: the stacked stepper or the split increase button.

### D8. `FieldStepper` (`internal/components/field-stepper/`)
Its props: `layout`, `onStep(direction, large)`, `canIncrement`, `canDecrement`, `disabled`, `controls` (the input id), `incrementLabel` and `decrementLabel`.

It exposes three parts:
- `<FieldStepper.Stacked>`: a full-height column, separated by `border-s`, with two half-height buttons (ChevronUp and ChevronDown);
- `<FieldStepperButton direction>`: the split buttons, separated by `border-e` or `border-s`;
- `useStepperLayout(layout)`.

**Layout:** `useStepperLayout` returns `split` when `layout === "split"`, or when `matchMedia("(pointer: coarse)")` matches. It subscribes to changes. A JS media query keeps a single DOM instance of each button, unlike CSS duplication.

**Button behaviour:**
- `tabIndex={-1}`, `aria-controls` and `aria-label`;
- `onPointerDown` calls `preventDefault`, so focus stays in the input;
- `usePressAndHold` steps once immediately, then repeats after 400 ms every 60 ms, and stops on `pointerup`, `pointerleave` or `pointercancel`, or when the button becomes disabled;
- split buttons are `size-8` (32 px), and on coarse pointers the frame stays `h-8`, which meets the 24 px minimum;
- each button is disabled when it cannot step in its direction, or when the field is disabled or loading.

### D9. Accessibility attributes
The input gets:
- `role="spinbutton"`, `aria-valuenow={value ?? undefined}`, `aria-valuemin` and `aria-valuemax`;
- `aria-valuetext`: the formatted display with the currency symbol, where a negative value is spelled with `fieldStrings.minus` ("minus"), never with parentheses;
- `dir="ltr"` and `inputMode`;
- `autoComplete="off"` and `spellCheck={false}`;
- a `text-end` class when `align="end"`, and `text-destructive` when `negativeColor` is on and the value is negative.

### D10. `NumberControl` and `mapControllerToValueField`
- **`mapControllerToValueField<E, V>(context, { onBlur, ref })`** returns `{ name, value: field.value ?? null, onValueChange: field.onChange, onBlur (composed), ref (merged), disabled, error, errorMessage }`. It is added to `internal/utils/helpers`.
- **`NumberControl`** = `ControlField componentName="NumberControl"` → `mapControllerToValueField` → `<NumberField {...rest} {...mapped} />`. The user's `onValueChange` is composed after `field.onChange`.
- **Types:**
  - `NumberFieldProps = FieldBaseProps & Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "min" | "max" | "step" | "inputMode" | "size" | "disabled" | "required" | "className" | "children"> & NumberOptions & { action? }`;
  - `NumberControlProps = ControlBaseProps & Omit<NumberFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">`.

### D11. Folder layout
```
internal/components/field-stepper/  index.ts, field-stepper.tsx, field-stepper-tests.tsx,
                                     hooks/{index.ts, use-press-and-hold.ts, use-stepper-layout.ts}
components/number-field/            index.ts, number-field.tsx, number-field-types.ts,
                                     hooks/{index.ts, use-number-input.ts, use-number-keyboard.ts,
                                            use-wheel-step.ts, use-remembered-expression.ts},
                                     utils/{index.ts, number-locale.ts, format-number.ts, parse-number.ts,
                                            caret.ts, decimal-math.ts, shorthand.ts, evaluate-expression.ts}
                                            + one -tests.ts per util,
                                     tests/{number-field-*-tests.tsx}
components/number-control/          index.ts, number-control.tsx, number-control-types.ts,
                                     tests/{render-in-form.tsx, …-form-tests.tsx, …-parity-tests.tsx, …-types-tests.tsx}
```
- The util tests sit next to each util in `utils/`, as the folder rule allows simple single test files.
- The component tests are split across `tests/`.

## Risks / Trade-offs

- **[Caret behaviour differs across input methods (IME, mobile autocorrect)]** → `inputMode` and `spellCheck={false}` limit autocorrect. Caret logic runs only on `input` events, and Chromium stories check typing in the middle of the number.
- **[`matchMedia` is absent in jsdom]** → `useStepperLayout` treats a missing `matchMedia` as a fine pointer. Tests stub `matchMedia` to cover the coarse branch.
- **[Large values lose precision]** → A development warning above `maxSafe(decimals)`. Big decimals are a documented non-goal.
- **[Expression detection could misread a negative number]** → A leading `-` alone is not an operator. Only an operator after the first character, or a leading `=`, makes an expression, and the tests cover `-5`, `5-3` and `=-5`.
- **[Enter commits and may also submit]** → `preventDefault` only when the text changed on commit, so a committed number plus Enter still submits the form as users expect.
- **[Commit running twice (Enter, then blur)]** → Found during implementation: the blur re-committed the already formatted result as a plain number and forgot the remembered expression. `committedText` makes committing the same text a no-op, and a test covers Enter followed by blur.
- **[Two sources of error (form and expression)]** → They are OR-ed. The expression message takes precedence while its error is active, because it describes the text currently in the input.

## Migration Plan

Purely additive. `InputField` gains optional slots, and Text and Password are unchanged. Release in a `minor` changeset.

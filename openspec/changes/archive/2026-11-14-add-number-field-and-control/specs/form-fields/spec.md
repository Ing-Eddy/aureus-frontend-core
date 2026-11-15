## ADDED Requirements

### Requirement: Number value and precision
A number field SHALL hold a value of type `number | null`, where `null` means empty. It MUST work controlled (`value`) and uncontrolled (`defaultValue`), and report changes through `onValueChange(value)`. It reports while typing whenever the text parses to a number, and again on commit. Text that does not parse, such as an unfinished expression, MUST NOT report a value until it is committed.

Stepping MUST be exact for decimal steps (scaled-integer arithmetic). Rounding to `decimals` MUST round half away from zero, without binary floating-point artefacts. In development, a warning MUST be logged when a value exceeds the range where `number` keeps the configured decimals exact.

#### Scenario: Exact decimal steps
- **WHEN** a `NumberField` with `step={0.1}` and value `0.2` is incremented once
- **THEN** its value is exactly `0.3`

#### Scenario: Rounding on commit
- **WHEN** a `NumberField` with `decimals={2}` receives "1.005" and loses focus
- **THEN** its value is `1.01`

#### Scenario: Empty value
- **WHEN** the user clears a `NumberField`
- **THEN** `onValueChange` is called with `null`

### Requirement: Number formatting
Formatting SHALL be configured by independent props. None of them may change another prop's default, and without any of them the field shows the digits as typed (for example `122345`).

- `locale` (default `en-US`) selects the group and decimal separator symbols.
- `grouping` (default off) adds thousands separators while typing and when blurred.
- `decimals` (default unlimited) caps the number of fraction digits that can be typed; `0` allows only integers.
- `padDecimals` (default off) pads the fraction with zeros up to `decimals` on blur, and does nothing without `decimals`.
- `currency` (an ISO 4217 code) only adds the currency's symbol as a fixed addon at the start of the frame, displayed per `currencyDisplay` (`symbol`, `narrowSymbol` or `code`). It MUST NOT change decimals, padding or grouping.
- `prefix` and `suffix` add fixed text addons, combinable with `currency`.
- `align` (`start` or `end`) aligns the number inside the input.

While the user types with `grouping` on, separators MUST be inserted live, and the caret MUST stay after the same digit it followed before the reformat. The number MUST render left-to-right inside the input, even in right-to-left layouts.

#### Scenario: Plain by default
- **WHEN** a `NumberField` without formatting props receives "122345"
- **THEN** it shows "122345"

#### Scenario: Grouping is independent
- **WHEN** two `NumberField`s with value `123345` are rendered, one with `grouping` and one without, both with `currency="USD"`
- **THEN** one shows "123,345" and the other "123345", each after a "$" addon

#### Scenario: Currency with no decimals
- **WHEN** a `NumberField` has `currency="USD"` and `decimals={0}` and the user types "12.5"
- **THEN** the decimal separator is ignored and the value is `125`

#### Scenario: Caret kept while grouping
- **WHEN** a grouped `NumberField` shows "1,234" with the caret after "1,2" and the user types "9"
- **THEN** it shows "12,934" with the caret right after the "9"

#### Scenario: Locale symbols
- **WHEN** a `NumberField` with `locale="es-ES"`, `grouping`, `decimals={2}` and `padDecimals` commits `1234.5`
- **THEN** it shows "1.234,50"

### Requirement: Negative numbers
Negative values SHALL be allowed unless `allowNegative` is false; with it false, the minus sign cannot be typed or pasted. `negativeFormat="parentheses"` MUST show a negative value as "(1,234.50)" while the field is not focused, and as "-1,234.50" while it is edited. `negativeColor` MUST show negative values in the destructive color. `aria-valuetext` MUST describe negatives in words, for example "minus $1,234.50", never with parentheses.

#### Scenario: Accounting parentheses
- **WHEN** a blurred `NumberField` with `negativeFormat="parentheses"`, `grouping` and `decimals={2}` holds `-1234.5` and `padDecimals` is on
- **THEN** it shows "(1,234.50)", and on focus it shows "-1,234.50"

### Requirement: Stepper buttons
Unless `stepper` is false, a number field SHALL render its own increment and decrement buttons, never the browser's native spinner.

- **Layouts (`stepperLayout`):**
  - `stacked` (the default) places ▲ and ▼ stacked at the inline end of the frame;
  - `split` places − at the inline start and + at the inline end.
- **Touch screens:** with a coarse pointer, the stacked layout MUST render as split, so that each button's target is at least 24×24 CSS pixels.
- **Behaviour:**
  - a press steps by `step`, and holding a button repeats the step until it is released;
  - each button is disabled when the value is at the limit in its direction, and both are disabled while the field is disabled or loading.
- **Accessibility:**
  - the buttons MUST have accessible names ("Increase" and "Decrease" by default, overridable) and `aria-controls` pointing at the input;
  - they are removed from the Tab order, because the keyboard steps from the input itself.
- **Look:** the buttons are separated from the text by a thin divider.

#### Scenario: Hold to repeat
- **WHEN** a user holds the increase button of a `NumberField` at `0` with `step={1}` for one second
- **THEN** the value has increased several times and stops increasing once the button is released

#### Scenario: Touch fallback
- **WHEN** a `NumberField` with `stepperLayout="stacked"` is shown on a device with a coarse pointer
- **THEN** the decrease button is at the inline start and the increase button at the inline end, each at least 24×24 px

#### Scenario: Limits disable buttons
- **WHEN** a `NumberField` with `max={10}` has value `10`
- **THEN** the increase button is disabled and the decrease button is enabled

### Requirement: Number keyboard and wheel
The input SHALL be a `spinbutton`, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext`. It MUST support these keys:
- ArrowUp and ArrowDown step by `step`;
- Shift with an arrow, PageUp and PageDown step by `largeStep` (default ten times `step`);
- Home and End go to `min` and `max` when they are set;
- Enter commits the text (format, shorthand, expression, clamp);
- Escape restores the last committed text.

The input MUST use the `decimal` input mode (`numeric` when only non-negative integers are allowed). With `wheel` on, the mouse wheel MUST step the value only while the input is focused, and MUST prevent the page from scrolling during that step.

#### Scenario: Large step
- **WHEN** a focused `NumberField` with `step={1}` and value `5` receives PageUp
- **THEN** its value is `15`

#### Scenario: Escape reverts
- **WHEN** a user changes "120" to "999" and presses Escape
- **THEN** the field shows "120" again and its value is `120`

### Requirement: Number input conveniences
- **Typing:** only digits, the locale's decimal separator and, when allowed, a minus sign are accepted. The characters needed by `shorthand` or `expressions` are also accepted when those are on. Other characters MUST be ignored, and fraction digits beyond `decimals` MUST be rejected.
- **Pasting:** pasted text MUST be cleaned and parsed per `locale`, accepting currency symbols, group separators, spaces and accounting parentheses. If it cannot be parsed, the value MUST stay unchanged.
- **`clampOnBlur`** (default on) clamps the committed value to `[min, max]`.
- **`selectOnFocus`** selects the whole text when the input gains focus.
- **`shorthand`** turns `k`, `m` and `b` suffixes into thousands, millions and billions on commit.
- **`expressions`:**
  - evaluates arithmetic (`+ - * /`, parentheses, unary minus, an optional leading `=`) on commit, without executing code;
  - an invalid expression puts the field in the error state with the message "Invalid expression" (overridable) and keeps the text for correction;
  - a valid expression is remembered for the component's lifetime:
    - the field shows and reports the result;
    - when focused again while its value still equals that result, the input shows the expression for editing;
    - while remembered, the input's accessible description includes "Calculated from <expression>" (overridable);
  - the expression is forgotten when the value changes by any other means: a plain number typed and committed, the keyboard, the step buttons, the wheel, or a new value from outside;
  - it is also forgotten when the component unmounts.

#### Scenario: Pasting a formatted amount
- **WHEN** a user pastes "$1,234.50" into a `NumberField` with the default locale
- **THEN** its value is `1234.5`

#### Scenario: Shorthand
- **WHEN** a `NumberField` with `shorthand` commits "1.5k"
- **THEN** its value is `1500`

#### Scenario: Remembered expression
- **WHEN** a user types "=3+3" in a `NumberField` with `expressions` and leaves the field
- **THEN** the field shows "6" and reports `6`, and when the user focuses it again the input shows "=3+3"

#### Scenario: Editing the expression
- **WHEN** the user then changes it to "=3+4" and presses Enter
- **THEN** the value is `7`, and focusing again shows "=3+4"

#### Scenario: Forgotten after stepping
- **WHEN** the user presses ArrowUp on a field showing the remembered result `6`
- **THEN** the value is `7`, and focusing again shows "7", not the expression

#### Scenario: Invalid expression
- **WHEN** a `NumberField` with `expressions` commits "=3+*2"
- **THEN** the field is in the error state with "Invalid expression", its value is unchanged and the text is kept

### Requirement: Number field
`NumberField` SHALL be importable from `@aureus-core/ui/components/number-field`. It MUST accept the shared field props, an `action`, every number prop described above, and the remaining native input props (`name`, `placeholder`, `onBlur`, `onFocus`, `aria-*`…), except `type`, `inputMode`, `min`, `max` and `step`, which it defines itself.

Its header, frame, helper and error MUST look like those of every other single-line field. Inside the frame, the addons are ordered:
- `split` layout: decrease button, currency/prefix, input, suffix, spinner, action, increase button;
- `stacked` layout: currency/prefix, input, suffix, spinner, action, stacked buttons.

A `ref` MUST reach the input.

#### Scenario: Simple integer field
- **WHEN** a `NumberField` is rendered with only `label="Quantity"` and `min={0}`
- **THEN** it shows a plain number input with stacked step buttons, and the decrease button is disabled at `0`

### Requirement: Number control bound to the form context
`NumberControl` SHALL be importable from `@aureus-core/ui/components/number-control`. It MUST follow the same form-binding contract as the other controls:
- it is rendered inside a `FormProvider`;
- it takes `name` (a plain string), optional `disabled` and `shouldUnregister`;
- it accepts every `NumberField` prop except `name`, `value`, `defaultValue`, `error`, `errorMessage` and `disabled`;
- the schema message is shown as helper text;
- a disabled control's value is excluded from the submitted data, while a loading control's value is kept.

The form MUST receive `number | null`, never a string. With the same props and state, a `NumberControl` MUST render the same markup as a `NumberField`, apart from generated element ids.

#### Scenario: Numbers reach the schema
- **WHEN** a form with a zod schema `amount: z.number().min(1)` uses a `NumberControl` named "amount" and the user types "1,250.5" with `grouping` and submits
- **THEN** the submitted data contains `amount: 1250.5` as a number

#### Scenario: Schema message
- **WHEN** the user submits `0` for that field
- **THEN** the schema's message is shown below the field with `aria-invalid="true"`

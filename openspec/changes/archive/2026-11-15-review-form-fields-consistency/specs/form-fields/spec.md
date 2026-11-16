## MODIFIED Requirements

### Requirement: Loading state
When `loading` is true, the input SHALL be disabled and a spinner MUST be shown inside the input frame, at its inline-end side. The spinner MUST have the `status` role, and its accessible label MUST be the `loadingLabel` text; there is no default label. The props' TypeScript types MUST require `loadingLabel` whenever `loading` is passed, and a development warning MUST name it when it is missing at runtime.

The input MUST expose `aria-busy="true"`, and the integrated action button, if any, MUST be disabled. For a control, loading MUST NOT remove the field's value from the form submission.

#### Scenario: Loading text field
- **WHEN** a `TextField` is rendered with `loading` and `loadingLabel="Cargando"`
- **THEN** the input is disabled and has `aria-busy="true"`, a status element labelled "Cargando" is visible inside the frame, and the action button is disabled

#### Scenario: Loading without its label does not type-check
- **WHEN** a developer writes `<TextField label="Nombre" loading />` without `loadingLabel`
- **THEN** TypeScript reports an error

#### Scenario: Loading control keeps its value
- **WHEN** a form is submitted while a `TextControl` with value "abc" is `loading`
- **THEN** the submitted data contains that field with value "abc"

### Requirement: Info tooltip
When `info` is given, an info icon button SHALL be shown on the same row as the label, at the far inline-end side of that row (the far right in left-to-right layouts).

- **Tooltip:** hovering, focusing or tapping the button MUST show the `info` content in a tooltip, and pressing Escape MUST close it.
- **Button name:** the button's accessible name MUST be the `infoLabel` text; there is no default name. The props' TypeScript types MUST require `infoLabel` whenever `info` is passed, and a development warning MUST name it when it is missing at runtime.
- **Description:** the `info` content MUST also be part of the input's accessible description, so screen-reader users hear it when they focus the input.

#### Scenario: Tap opens the tooltip on touch devices
- **WHEN** a user taps the info button, named by `infoLabel="Más información"`, of a field whose `info` is "Shown to other users"
- **THEN** a tooltip with "Shown to other users" appears, and pressing Escape closes it

#### Scenario: Info is announced with the input
- **WHEN** a screen-reader user focuses the input of that field
- **THEN** its accessible description includes "Shown to other users"

#### Scenario: Info without its label does not type-check
- **WHEN** a developer writes `<TextField label="Usuario" info="Visible" />` without `infoLabel`
- **THEN** TypeScript reports an error

### Requirement: Password visibility toggle
A password field SHALL always render one show/hide toggle button inside the input frame, at its inline-end side, in the same place and with the same size as an integrated action. The toggle has no tooltip. It MUST:
- have an eye icon while the password is hidden and an eye-off icon while it is visible;
- be named by `showPasswordLabel` while hidden and by `hidePasswordLabel` while visible. There are no default names: both props are always required by the props' TypeScript types, and a development warning names a missing one at runtime;
- expose `aria-pressed` with the current visibility and `aria-controls` pointing at the input.

Pressing the toggle MUST switch the input between `type="password"` and `type="text"`. The toggle MUST be disabled whenever the field is disabled or loading.

When the toggle is pressed with a pointer (mouse or touch), focus MUST stay in the input, and the caret position and selection MUST be kept. From the keyboard, the toggle MUST be reachable with Tab and operable with Enter and Space.

When the form that contains the input is submitted, the password MUST become hidden again. The input MUST always have spell-check, auto-correct and auto-capitalize turned off, so a visible password is never sent to a spell checker.

#### Scenario: Showing the password with a tap
- **WHEN** a user types "secret" in a `PasswordField` with `showPasswordLabel="Mostrar contraseña"` and `hidePasswordLabel="Ocultar contraseña"`, places the caret after "sec" and taps the toggle
- **THEN** the input becomes `type="text"`, the toggle is named "Ocultar contraseña" with `aria-pressed="true"`, and the input still has focus with the caret after "sec"

#### Scenario: Keyboard use
- **WHEN** a keyboard user tabs to the toggle and presses Space
- **THEN** the password becomes visible and focus stays on the toggle

#### Scenario: Hidden again on submit
- **WHEN** the password is visible and the form containing the field is submitted
- **THEN** the input is `type="password"` again and the toggle is named by `showPasswordLabel`

#### Scenario: Toggle unavailable while loading
- **WHEN** a `PasswordField` is `loading`
- **THEN** the input and the toggle are disabled and the spinner is shown before the toggle

#### Scenario: Toggle texts are required
- **WHEN** a developer writes `<PasswordField label="Contraseña" />` without the toggle labels
- **THEN** TypeScript reports an error

### Requirement: Character counter
When `showCount` is true, a multi-line field SHALL show how many characters it contains:
- "count/max" when `maxLength` is set, or the count alone otherwise;
- in the destructive color once the count reaches `maxLength`;
- hidden from assistive technology.

For assistive technology instead:
- The input's accessible description MUST include the text returned by `countLabel(count, maxLength)`. There is no default text: the props' TypeScript types MUST require `countLabel` whenever `showCount` is on, and a development warning MUST name it when it is missing at runtime.
- A polite live region MUST announce that text only after the user pauses typing (about one second), not on every keystroke.

The count MUST follow the value in controlled, uncontrolled and form-bound use.

#### Scenario: Count with a limit
- **WHEN** a `TextAreaField` with `maxLength={500}`, `showCount` and a `countLabel` that returns "Quedan N caracteres" (N being the remaining characters) contains 120 characters
- **THEN** "120/500" is shown, and the input's accessible description includes "Quedan 380 caracteres"

#### Scenario: Limit reached
- **WHEN** the field reaches 500 characters
- **THEN** the counter is shown in the destructive color

#### Scenario: Announced after a pause
- **WHEN** a screen-reader user types five characters quickly and then stops
- **THEN** the counter text is announced once, after the pause

#### Scenario: Counter text is required
- **WHEN** a developer writes `<TextAreaField label="Bio" showCount />` without `countLabel`
- **THEN** TypeScript reports an error

### Requirement: Negative numbers
Negative values SHALL be allowed unless `allowNegative` is false; with it false, the minus sign cannot be typed or pasted.

- **`negativeFormat="parentheses"`:** MUST show a negative value as "(1,234.50)" while the field is not focused, and as "-1,234.50" while it is edited.
- **`negativeColor`:** MUST show negative values in the destructive color.
- **`aria-valuetext`:** MUST describe a negative value with the number formatted by `Intl` for the field's `locale` (with its minus sign and any currency or affixes), never with parentheses and never with a fixed word in one language.

#### Scenario: Accounting parentheses
- **WHEN** a blurred `NumberField` with `negativeFormat="parentheses"`, `grouping` and `decimals={2}` holds `-1234.5` and `padDecimals` is on
- **THEN** it shows "(1,234.50)", and on focus it shows "-1,234.50"

#### Scenario: Negative value text
- **WHEN** a `NumberField` with `currency="USD"` holds `-1234.5`
- **THEN** its `aria-valuetext` is the `Intl`-formatted value with a minus sign (such as "-$1,234.50"), without parentheses or words

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
  - the buttons MUST be named by `incrementLabel` and `decrementLabel`, and have `aria-controls` pointing at the input. There are no default names: the props' TypeScript types MUST require both unless `stepper={false}`, and a development warning MUST name a missing one at runtime;
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

#### Scenario: Stepper texts are required
- **WHEN** a developer writes `<NumberField label="Cantidad" />` without `incrementLabel` and `decrementLabel`
- **THEN** TypeScript reports an error, and `<NumberField label="Cantidad" stepper={false} />` type-checks

### Requirement: Number input conveniences
- **Typing:** only digits, the locale's decimal separator and, when allowed, a minus sign are accepted. The characters needed by `shorthand` or `expressions` are also accepted when those are on. Other characters MUST be ignored, and fraction digits beyond `decimals` MUST be rejected.
- **Pasting:** pasted text MUST be cleaned and parsed per `locale`, accepting currency symbols, group separators, spaces and accounting parentheses. If it cannot be parsed, the value MUST stay unchanged.
- **`clampOnBlur`** (default on) clamps the committed value to `[min, max]`.
- **`selectOnFocus`** selects the whole text when the input gains focus.
- **`shorthand`** turns `k`, `m` and `b` suffixes into thousands, millions and billions on commit.
- **`expressions`:**
  - evaluates arithmetic (`+ - * /`, parentheses, unary minus, an optional leading `=`) on commit, without executing code;
  - an invalid expression puts the field in the error state with the `invalidExpressionLabel` message and keeps the text for correction;
  - a valid expression is remembered for the component's lifetime:
    - the field shows and reports the result;
    - when focused again while its value still equals that result, the input shows the expression for editing;
    - while remembered, the input's accessible description includes the text returned by `calculatedFromLabel(expression)`;
  - there are no default texts: the props' TypeScript types MUST require `invalidExpressionLabel` and `calculatedFromLabel` whenever `expressions` is on, and a development warning MUST name a missing one at runtime;
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
- **WHEN** a `NumberField` with `expressions` and `invalidExpressionLabel="Expresión no válida"` commits "=3+*2"
- **THEN** the field is in the error state with "Expresión no válida", its value is unchanged and the text is kept

#### Scenario: Expression texts are required
- **WHEN** a developer writes `<NumberField label="Total" expressions stepper={false} />` without the expression texts
- **THEN** TypeScript reports an error

## ADDED Requirements

### Requirement: No default texts across the family
No field or control of the family, and none of the shared internal pieces they render, SHALL show a user-facing text that does not come from its props. This covers visible texts and accessible names, descriptions and announcements.

- **Feature texts:** each text a feature needs MUST be required by the props' TypeScript types whenever that feature is enabled, and a development warning MUST name it when it is missing at runtime.
- **Optional visible messages:** when omitted, they MUST render nothing.
- **Exemption:** developer-facing messages (development warnings and errors such as a control used outside its `FormProvider`) are exempt.
- **Guard test:** an automated check over the library source MUST fail when a component or shared internal contains a hard-coded user-facing text.

#### Scenario: Omitted optional message
- **WHEN** a field renders without an optional message prop (for example a select without `emptyMessage` and no options)
- **THEN** no text is shown in its place

#### Scenario: Guard against hard-coded texts
- **WHEN** a contributor adds `aria-label="Close"` inside a component of the family
- **THEN** the guard test fails and names the file

### Requirement: Consistent development warnings across the family
Development warnings of every field and control SHALL use one format: they MUST start with the name of the component that received the prop (`<Component>: …`), MUST only be emitted in development, and MUST be emitted once per problem.

- **Accessible name:** every field MUST warn when its interactive element gets no accessible name from any of the props that can name it. The warning MUST say "has no accessible name" and list those props. This covers text, password, text area, number and select fields as well as the families that already warn.
- **Unknown values:** every field with options MUST word the unknown-value warning as `<Component>: the value "<value>" matches no option; it is kept.`
- **Actions:** the field action's warnings MUST start with the name of the field that renders it. A standalone action keeps a generic prefix.

#### Scenario: Text field without accessible name
- **WHEN** a `TextField` renders in development without `label`, `aria-label` or `aria-labelledby`
- **THEN** a development warning starting with `TextField:` says that the input has no accessible name

#### Scenario: Unknown select value
- **WHEN** a `SelectField` receives the value "pe", which matches no option
- **THEN** the development warning reads `SelectField: the value "pe" matches no option; it is kept.`, once

#### Scenario: Icon-only action without name inside a field
- **WHEN** a `NumberField` renders an icon-only `action` without an accessible name
- **THEN** the development warning starts with `NumberField:`

### Requirement: Right-to-left layout across the family
Every field and control SHALL follow the direction of the page it is rendered in, without a prop.

- **Mirrored layout:** in a right-to-left page, the parts at the inline end (the action, the info button, the select chevron, the stacked step buttons, the password toggle) MUST sit on the left, and choice controls (checkboxes, radios, switches) MUST sit on the inline start, on the right of their text.
- **Reading order of keys:** in a horizontal radio group, ArrowLeft MUST move to the next option in a right-to-left page. No primitive may force a left-to-right direction on its root.
- **Left-to-right content:** numbers and one-time codes keep their left-to-right order.
- **Stories:** every field family MUST have an `Rtl` story that asserts the computed layout.

#### Scenario: Radio group in a right-to-left page
- **WHEN** a horizontal `RadioGroupField` renders inside an element with `dir="rtl"` and the user presses ArrowLeft on the first option
- **THEN** each radio is on the right of its label, and the second option is checked

#### Scenario: Number field in a right-to-left page
- **WHEN** a `NumberField` holding `-1234.5` with `grouping` renders inside `dir="rtl"`
- **THEN** its step buttons are on the left of the input, and the input still shows "-1,234.5" left to right

# form-fields Specification

## Purpose
Defines the shared look, behaviour and accessibility contract of every form field and form control in `@aureus-core/ui`, and the concrete text input components `TextField` and `TextControl` built on it.

## Requirements

### Requirement: Field and control family
Each kind of input SHALL come as a pair:
- a **field** (`<kind>-field`), a general-purpose component usable anywhere, controlled or uncontrolled;
- a **control** (`<kind>-control`), the same input bound to the surrounding react-hook-form form.

Both members of a pair MUST accept the same visual props. Given the same visual props and the same value and error state, a field and its control MUST render identical markup, apart from generated element ids.

#### Scenario: Text field and text control look the same
- **WHEN** a `TextField` and a `TextControl` are rendered with the same label, required, info, helper text, action and class names, the same value, and neither has an error
- **THEN** their rendered markup is identical once generated ids are normalized

#### Scenario: Error state looks the same
- **WHEN** a `TextField` has `error` and an `errorMessage`, and a `TextControl` has a validation error with the same message
- **THEN** both render the same error styling and the same message in the same place

### Requirement: Label
A field or control SHALL accept an optional `label`. When given, the label MUST be rendered above the input with the package's default label styles and MUST be programmatically associated with the input, so clicking it focuses the input and it becomes the input's accessible name. When no label is given, no label element is rendered.

The consumer MUST be able to add classes to the label, and to the other visible parts (root, header row, required mark, info button, input frame, input, helper text, action button), through a `classNames` object; these classes are merged after the defaults so they win. `className` applies to the root.

#### Scenario: Clicking the label focuses the input
- **WHEN** a user clicks the label of a `TextField` labelled "Username"
- **THEN** the input receives focus and its accessible name is "Username"

#### Scenario: Custom label styles
- **WHEN** a `TextField` is rendered with `classNames={{ label: "uppercase" }}`
- **THEN** the label element has the `uppercase` class in addition to the default label classes

### Requirement: Required mark
When `required` is true, a red asterisk SHALL be shown right after the label text. The asterisk MUST be hidden from assistive technology, and the input MUST expose `aria-required="true"`. The input MUST NOT get the native `required` attribute, and `required` MUST NOT add any validation rule. Validation stays with the consumer's form logic or schema.

#### Scenario: Required field
- **WHEN** a `TextField` labelled "Email" is rendered with `required`
- **THEN** a red asterisk is visible next to "Email", the asterisk is `aria-hidden`, the input has `aria-required="true"`, and the input has no `required` attribute

### Requirement: Loading state
When `loading` is true, the input SHALL be disabled and a spinner MUST be shown inside the input frame, at its inline-end side. The spinner MUST have the `status` role and an accessible label ("Loading" by default, overridable). The input MUST expose `aria-busy="true"`, and the integrated action button, if any, MUST be disabled. For a control, loading MUST NOT remove the field's value from the form submission.

#### Scenario: Loading text field
- **WHEN** a `TextField` is rendered with `loading`
- **THEN** the input is disabled and has `aria-busy="true"`, a status element labelled "Loading" is visible inside the frame, and the action button is disabled

#### Scenario: Loading control keeps its value
- **WHEN** a form is submitted while a `TextControl` with value "abc" is `loading`
- **THEN** the submitted data contains that field with value "abc"

### Requirement: Disabled state
When `disabled` is true, the input and the integrated action button SHALL be disabled, and the label MUST be shown dimmed. For a control, a disabled field MUST follow the form library's disabled semantics: its value is excluded from the submitted data.

#### Scenario: Disabled control is excluded from submission
- **WHEN** a form is submitted while a `TextControl` named "nickname" is `disabled`
- **THEN** the submitted data has no value for "nickname"

### Requirement: Info tooltip
When `info` is given, an info icon button SHALL be shown on the same row as the label, at the far inline-end side of that row (the far right in left-to-right layouts). Hovering it, focusing it or tapping it MUST show the `info` content in a tooltip, and pressing Escape MUST close it. The button MUST have an accessible name ("More information" by default, overridable). The `info` content MUST also be part of the input's accessible description, so screen-reader users hear it when they focus the input.

#### Scenario: Tap opens the tooltip on touch devices
- **WHEN** a user taps the info button of a field whose `info` is "Shown to other users"
- **THEN** a tooltip with "Shown to other users" appears, and pressing Escape closes it

#### Scenario: Info is announced with the input
- **WHEN** a screen-reader user focuses the input of that field
- **THEN** its accessible description includes "Shown to other users"

### Requirement: Helper text
When `helperText` is given, it SHALL be shown below the input and MUST be part of the input's accessible description.

#### Scenario: Helper describes the input
- **WHEN** a `TextField` is rendered with `helperText="At least 3 characters"`
- **THEN** that text is shown below the input and is part of the input's accessible description

### Requirement: Error state
When a field is in error, the input SHALL expose `aria-invalid="true"`, and the input frame, the label and the helper text MUST use the destructive color. On a field, `error` is a boolean prop. An optional `errorMessage` MUST replace the helper text while `error` is true, and it MUST be announced to assistive technology when it appears.

#### Scenario: Error without message
- **WHEN** a `TextField` with `helperText="Optional"` is rendered with `error`
- **THEN** the input has `aria-invalid="true"`, the frame, label and "Optional" are shown in the destructive color

#### Scenario: Error message replaces the helper
- **WHEN** a `TextField` with `helperText="Optional"` is rendered with `error` and `errorMessage="Invalid email"`
- **THEN** "Invalid email" is shown below the input in place of "Optional", as an alert

### Requirement: Integrated action button
Unless a field defines a fixed button of its own (the password visibility toggle), a field or control SHALL accept an optional `action` that renders one button inside the input frame, sized so its height fits the frame. In a single-line field the action sits at the inline-end side of the input. In a multi-line field it sits at the inline end of a footer bar along the bottom edge of the frame. A field with a fixed button MUST NOT accept `action`.

The action MUST accept text or an icon as content, an optional tooltip, and the usual button props (click handler, accessible name, variant, size, disabled, type). Its type MUST default to `button`, so it never submits a form by accident. The action MUST be disabled whenever the field is disabled or loading. Disabling only the action MUST NOT dim the rest of the field. An icon-only action without an accessible name MUST produce a development warning.

#### Scenario: Icon action with tooltip
- **WHEN** a `TextField` has `action={{ children: <CopyIcon />, "aria-label": "Copy", tooltip: "Copy to clipboard", onClick }}` and the user hovers then clicks the button
- **THEN** the tooltip "Copy to clipboard" is shown, `onClick` is called once, and no form is submitted

#### Scenario: Only the action is disabled
- **WHEN** a `TextField` is rendered with `action={{ children: "Apply", disabled: true }}` and is itself enabled
- **THEN** the button is disabled while the input and its frame keep their enabled appearance

#### Scenario: Fixed button excludes action
- **WHEN** a `PasswordField` or `PasswordControl` is given an `action` prop
- **THEN** it is a type error, and the only button in the input frame is the visibility toggle

#### Scenario: Multi-line action in the footer bar
- **WHEN** a `TextAreaField` with an `action` grows from 3 to 8 lines
- **THEN** the button stays in the footer bar at the bottom edge of the frame, below the text, and never overlaps it

### Requirement: Responsive and accessible layout
Fields and controls SHALL take the full width of their container and MUST be able to shrink below their content width without overflowing. Their layout MUST mirror in right-to-left direction. On small screens the input text MUST be at least 16px, so mobile browsers do not zoom on focus. The info button and the action button MUST each have a pointer target of at least 24×24 CSS pixels. Every story of these components MUST pass the playground's accessibility checks.

#### Scenario: Right-to-left
- **WHEN** a field with an info icon and an action is rendered inside a right-to-left direction provider
- **THEN** the info icon sits at the far left of the label row and the action at the left end of the input frame

### Requirement: Text field
`TextField` SHALL be importable from `@aureus-core/ui/components/text-field`. It MUST accept the shared field props, an `action`, and every other native text-input prop (`value`, `defaultValue`, `onChange`, `onBlur`, `placeholder`, `name`, `autoComplete`, `maxLength`, `aria-*`…). The input MUST always be `type="text"`: neither `TextField` nor `TextControl` accepts a `type` prop, because other input types (email, password, number…) bring browser behaviour that belongs to dedicated fields. It MUST work controlled and uncontrolled. A `ref` MUST reach the underlying input element.

#### Scenario: Uncontrolled usage
- **WHEN** a `TextField` is rendered with `defaultValue="ada"` and the user types "m"
- **THEN** the input shows "adam" and `onChange` is called with the change event

#### Scenario: Always a text input
- **WHEN** a `TextField` or a `TextControl` is rendered
- **THEN** its input has `type="text"`, and passing a `type` prop is a type error

#### Scenario: Ref reaches the input
- **WHEN** a `TextField` is rendered with a `ref` and the ref's `focus()` is called
- **THEN** the input receives focus

### Requirement: Text control bound to the form context
`TextControl` SHALL be importable from `@aureus-core/ui/components/text-control`. It MUST be rendered inside a react-hook-form `FormProvider`, and it MUST take its form binding from that context. It MUST accept a field `name` (a plain string, no type parameters), optional `disabled` and `shouldUnregister`, and the same visual props as `TextField`. It MUST NOT accept a form `control`, validation `rules`, `value`, `defaultValue`, `error` or `errorMessage`: values, defaults and validation come from the form and its schema.

The control MUST show the form's current value, report changes and blur to the form, and let the form focus the input (for example, focusing the first invalid field on submit). When the form state has an error for the field, the control MUST be in the error state, and the error's message MUST be shown in the helper slot in place of `helperText`. When the error is cleared, `helperText` MUST be shown again.

Rendering a control outside a `FormProvider` MUST throw an error that names the component and says a `FormProvider` is required. In development, a control whose `name` is not among the form's default values MUST log a warning that names the field.

#### Scenario: Schema message shown in the helper
- **WHEN** a form uses a schema that requires `username` to have at least 3 characters, and the user submits it with "ab" in a `TextControl` named "username" with `helperText="Visible to others"`
- **THEN** the input has `aria-invalid="true"` and the schema's message is shown below the input in place of "Visible to others"

#### Scenario: Correcting the value restores the helper
- **WHEN** the user then types a valid username and the form revalidates
- **THEN** the error state is removed and "Visible to others" is shown again

#### Scenario: Focus on first error
- **WHEN** a form with an invalid `TextControl` is submitted
- **THEN** that control's input receives focus

#### Scenario: Used outside a form
- **WHEN** a `TextControl` is rendered without a `FormProvider` above it
- **THEN** rendering throws an error stating that `TextControl` must be rendered inside a react-hook-form `FormProvider`

### Requirement: Password visibility toggle
A password field SHALL always render one show/hide toggle button inside the input frame, at its inline-end side, in the same place and with the same size as an integrated action. The toggle has no tooltip. It MUST:
- have an eye icon while the password is hidden and an eye-off icon while it is visible;
- have the accessible name "Show password" while hidden and "Hide password" while visible, both overridable;
- expose `aria-pressed` with the current visibility and `aria-controls` pointing at the input.

Pressing the toggle MUST switch the input between `type="password"` and `type="text"`. The toggle MUST be disabled whenever the field is disabled or loading.

When the toggle is pressed with a pointer (mouse or touch), focus MUST stay in the input, and the caret position and selection MUST be kept. From the keyboard, the toggle MUST be reachable with Tab and operable with Enter and Space.

When the form that contains the input is submitted, the password MUST become hidden again. The input MUST always have spell-check, auto-correct and auto-capitalize turned off, so a visible password is never sent to a spell checker.

#### Scenario: Showing the password with a tap
- **WHEN** a user types "secret" in a `PasswordField`, places the caret after "sec" and taps the toggle
- **THEN** the input becomes `type="text"`, the toggle is named "Hide password" with `aria-pressed="true"`, and the input still has focus with the caret after "sec"

#### Scenario: Keyboard use
- **WHEN** a keyboard user tabs to the toggle and presses Space
- **THEN** the password becomes visible and focus stays on the toggle

#### Scenario: Hidden again on submit
- **WHEN** the password is visible and the form containing the field is submitted
- **THEN** the input is `type="password"` again and the toggle is named "Show password"

#### Scenario: Toggle unavailable while loading
- **WHEN** a `PasswordField` is `loading`
- **THEN** the input and the toggle are disabled and the spinner is shown before the toggle

### Requirement: Password field
`PasswordField` SHALL be importable from `@aureus-core/ui/components/password-field`.

It MUST accept:
- the shared field props;
- every other native text-input prop except `type`;
- `visible`, `defaultVisible` (default `false`) and `onVisibleChange`, so visibility can be controlled or uncontrolled;
- `showPasswordLabel` and `hidePasswordLabel`, the toggle's accessible names.

It MUST NOT accept `action` or `type`. `autoComplete` MUST default to `current-password` and MAY be set to `new-password` or any other value. In controlled mode, the toggle and the form-submit re-hide MUST call `onVisibleChange` instead of changing visibility directly. It MUST work controlled and uncontrolled for its value. A `ref` MUST reach the underlying input.

Apart from the toggle in place of an action, a `PasswordField` MUST render the same structure as a `TextField` with the same shared props.

#### Scenario: Controlled visibility shared by two fields
- **WHEN** two `PasswordField`s receive the same `visible` state and a checkbox outside them sets it to true
- **THEN** both inputs become `type="text"` and both toggles report `aria-pressed="true"`

#### Scenario: Default autocomplete
- **WHEN** a `PasswordField` is rendered without `autoComplete`
- **THEN** its input has `autocomplete="current-password"`

### Requirement: Password control bound to the form context
`PasswordControl` SHALL be importable from `@aureus-core/ui/components/password-control`. It MUST follow the same form-binding contract as `TextControl`:
- it is rendered inside a react-hook-form `FormProvider`;
- it takes `name` (a plain string, no type parameters), optional `disabled` and `shouldUnregister`;
- it accepts every visual and visibility prop of `PasswordField`;
- it accepts no `control`, `rules`, `value`, `defaultValue`, `error`, `errorMessage`, `type` or `action`;
- the form state's validation message is shown in place of `helperText`;
- a disabled control's value is excluded from the submitted data, while a loading control's value is kept.

With the same visual props and the same value and error state, a `PasswordControl` MUST render the same markup as a `PasswordField`, apart from generated element ids.

#### Scenario: Confirmation mismatch from the schema
- **WHEN** a form's schema requires `confirm` to equal `password`, and the user submits "secret-1" and "secret-2"
- **THEN** the `PasswordControl` named "confirm" shows the schema's mismatch message below its input, with `aria-invalid="true"`

#### Scenario: Submitted value stays a password
- **WHEN** the user shows the password in a `PasswordControl` and submits the form
- **THEN** the submitted data contains the typed value and the input is hidden again

### Requirement: Text area sizing
A text area field SHALL grow with its content, from `minRows` lines (default 3) up to `maxRows` lines (default 10). Past `maxRows` its content MUST scroll. `maxRows` MAY be `Infinity` for no limit. Sizing MUST work in every evergreen browser and MUST NOT depend on CSS `field-sizing`.

When `resize` is true (the default), the user MUST be able to drag the text area taller or shorter, within `minRows` and `maxRows`. A height the user drags to MUST become the new minimum: content may still grow it, but it does not shrink below that height. When `resize` is false, there MUST be no drag handle. Resizing is vertical only.

#### Scenario: Growing and capping
- **WHEN** a user types 15 lines into a `TextAreaField` with `minRows={3}` and `maxRows={8}`
- **THEN** the field starts 3 lines tall, grows line by line to 8 lines, and then scrolls

#### Scenario: Manual height is kept
- **WHEN** a user drags an empty `TextAreaField` to 6 lines tall and then types one line
- **THEN** the field stays 6 lines tall

#### Scenario: No resize handle
- **WHEN** a `TextAreaField` is rendered with `resize={false}`
- **THEN** it has no drag handle but still grows with its content

### Requirement: Text area footer bar
A multi-line field SHALL render a footer bar inside its frame, along the bottom edge, separated from the text by a thin divider, whenever it has a loading spinner, an action or a character counter to show. Without any of those it MUST NOT render the bar.

The spinner and the counter sit at the inline start of the bar, and the action at its inline end. The bar MUST stay attached to the bottom edge of the frame whatever the field's height. It MUST mirror in right-to-left layouts, and MUST accept extra classes through `classNames.footer`.

#### Scenario: Bar only when needed
- **WHEN** a `TextAreaField` has no `action`, no `loading` and no `showCount`
- **THEN** no footer bar is rendered

#### Scenario: Order inside the bar
- **WHEN** a `TextAreaField` is `loading`, has `showCount` and an `action`
- **THEN** the bar shows the spinner, then the counter, then the action at the far inline end, and the action is disabled

### Requirement: Character counter
When `showCount` is true, a multi-line field SHALL show how many characters it contains:
- "count/max" when `maxLength` is set, or the count alone otherwise;
- in the destructive color once the count reaches `maxLength`;
- hidden from assistive technology.

For assistive technology instead:
- The input's accessible description MUST include the remaining characters ("380 characters remaining" by default, overridable with `countLabel`), or the count when there is no `maxLength`.
- A polite live region MUST announce that text only after the user pauses typing (about one second), not on every keystroke.

The count MUST follow the value in controlled, uncontrolled and form-bound use.

#### Scenario: Count with a limit
- **WHEN** a `TextAreaField` with `maxLength={500}` and `showCount` contains 120 characters
- **THEN** "120/500" is shown, and the input's accessible description includes "380 characters remaining"

#### Scenario: Limit reached
- **WHEN** the field reaches 500 characters
- **THEN** the counter is shown in the destructive color

#### Scenario: Announced after a pause
- **WHEN** a screen-reader user types five characters quickly and then stops
- **THEN** the remaining characters are announced once, after the pause

### Requirement: Action keyboard shortcut
When `actionShortcut` is true and the field has an action, pressing Ctrl+Enter or Cmd+Enter inside the text area SHALL press the action exactly as a click would, and MUST NOT insert a new line. A disabled action MUST NOT be pressed. Enter without a modifier MUST still insert a new line. The action MUST expose the shortcut with `aria-keyshortcuts`. Without an action the shortcut does nothing.

#### Scenario: Posting with the keyboard
- **WHEN** a user types a comment in a `TextAreaField` with `actionShortcut` and an action "Post", and presses Ctrl+Enter
- **THEN** the action's `onClick` is called once and no new line is added

#### Scenario: Enter alone
- **WHEN** the same user presses Enter
- **THEN** a new line is inserted and the action is not pressed

### Requirement: Text area field
`TextAreaField` SHALL be importable from `@aureus-core/ui/components/text-area-field`.

It MUST accept:
- the shared field props;
- an `action`;
- `minRows`, `maxRows`, `resize`, `showCount`, `countLabel` and `actionShortcut`;
- every other native `<textarea>` prop (`value`, `defaultValue`, `onChange`, `placeholder`, `name`, `maxLength`…) except `rows`, which `minRows` replaces.

It MUST work controlled and uncontrolled, and a `ref` MUST reach the `<textarea>`. Its header, frame, helper and error MUST look like those of every other field.

#### Scenario: Uncontrolled multi-line value
- **WHEN** a `TextAreaField` with `defaultValue="Hello"` receives Enter and "world"
- **THEN** its value is "Hello\nworld" and `onChange` was called for each change

### Requirement: Text area control bound to the form context
`TextAreaControl` SHALL be importable from `@aureus-core/ui/components/text-area-control`. It MUST follow the same form-binding contract as `TextControl`:
- it is rendered inside a `FormProvider`;
- it takes `name` (a plain string), optional `disabled` and `shouldUnregister`;
- it accepts every visual and text-area prop of `TextAreaField`;
- it accepts no `control`, `rules`, `value`, `defaultValue`, `error` or `errorMessage`;
- the schema message is shown in place of `helperText`;
- a disabled control's value is excluded from the submitted data, while a loading control's value is kept.

With the same visual props and the same value and error state, a `TextAreaControl` MUST render the same markup as a `TextAreaField`, apart from generated element ids.

#### Scenario: Schema length message
- **WHEN** a form's schema requires `bio` to have at least 20 characters and the user submits "Too short"
- **THEN** the `TextAreaControl` named "bio" shows the schema's message below its frame with `aria-invalid="true"`, and its counter shows the form value's length

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

### Requirement: Select options and value
A select field SHALL take `options` as an array of `{ value: string; label: string; description?; icon?; disabled?; group? }`.

- **Single mode** (the default): the value is `string | null`.
- **Multiple mode** (`multiple`): the value is `string[]`.

Both modes MUST work controlled (`value`) and uncontrolled (`defaultValue`), and report changes through `onValueChange`. A value that is not in `options` MUST be kept, not dropped, so that options loaded later still match. In development, a warning MUST name such a value. The selected values MUST be submitted with native forms when `name` is set.

#### Scenario: Single selection
- **WHEN** a user opens a `SelectField` and picks "España" (value `es`)
- **THEN** the field shows "España" and `onValueChange` receives `"es"`

#### Scenario: Multiple selection
- **WHEN** a user picks "Rojo" and then "Azul" in a `SelectField` with `multiple`
- **THEN** `onValueChange` last receives `["rojo", "azul"]` and the popup stays open

#### Scenario: Value not yet in options
- **WHEN** a `SelectField` has `value="pe"` while `options` does not include `pe` yet
- **THEN** the value is kept, a development warning names `pe`, and once `pe` is added to `options` its label is shown

### Requirement: Select messages are provided by the developer
A select field SHALL NOT render any default text.

- **Visible messages** render nothing when their prop is omitted:
  - `placeholder` for an empty field;
  - `emptyMessage` for a popup with no options;
  - `noResultsMessage` for a search with no matches;
  - `optionsLoadingMessage` while `optionsLoading`;
  - `maxSelectedMessage` once `maxSelected` is reached.
- **Texts a feature needs** MUST be required by the props' TypeScript types whenever the feature is enabled:
  - `searchLabel` with `searchable`;
  - `clearLabel` with `clearable`;
  - `removeChipLabel(option)` with `multipleDisplay="chips"`;
  - `renderSummary(selected)` with `multipleDisplay="summary"`;
  - `selectAll.label` with `selectAll`;
  - `createLabel(query)` and `onCreate` with `creatable`.

  When one of them is missing at runtime (untyped code), a development warning MUST name the missing prop.
- **Announced messages:** the no-results and loading messages MUST be rendered in a `status` region, so screen readers announce them.

#### Scenario: No message without its prop
- **WHEN** a searchable `SelectField` without `noResultsMessage` filters to no matches
- **THEN** the popup shows no message text and no default wording

#### Scenario: Message in its situation
- **WHEN** the same field has `noResultsMessage="Ningún país coincide"`
- **THEN** that text is shown in a status region while no option matches, and hidden once options match again

#### Scenario: Feature without its text does not type-check
- **WHEN** a developer writes `<SelectField clearable />` without `clearLabel`
- **THEN** TypeScript reports an error

### Requirement: Select trigger and popup
- **Field:** the select field SHALL look like every other field. It has the same frame, header, helper and error.
- **Trigger:** inside the frame, a trigger button fills the width and shows the selected value, or the `placeholder` in the muted color. The trigger:
  - is the labelled form control (the label's `htmlFor` points at it);
  - carries `aria-describedby` (helper, info), `aria-invalid` and `aria-required`;
  - exposes `aria-expanded`.
- **Frame end:** at the inline end of the frame come the spinner, the action, the clear button (`clearable`, only while there is a value) and a chevron. Interactive elements are never nested inside the trigger button.
- **Popup:**
  - matches the field's width, has a maximum height with scroll, is rendered in a portal and avoids viewport collisions;
  - options show an indicator for the selected state, an optional icon, the label and an optional description on a second line;
  - disabled options are announced as disabled and cannot be chosen;
  - groups render their titles in the order the groups first appear;
  - on touch screens every option is at least 24 px tall (WCAG 2.5.8).
- **Disabled and loading:** a disabled or loading field MUST NOT open its popup.
- **Keyboard:**
  - Enter, Space and ArrowDown open the popup;
  - Up/Down, Home and End move through the options, and Enter selects;
  - without search, typing a letter jumps to the matching option;
  - Escape closes the popup and returns focus to the trigger, and Tab closes it and moves on.
- **RTL:** the layout mirrors in right-to-left documents.

#### Scenario: Opening from the keyboard
- **WHEN** a keyboard user focuses a `SelectField` and presses ArrowDown, ArrowDown, Enter
- **THEN** the popup opens, the second option is selected and the popup closes in single mode

#### Scenario: Escape returns focus
- **WHEN** the popup is open and the user presses Escape
- **THEN** the popup closes and the trigger has focus

#### Scenario: Typeahead
- **WHEN** a non-searchable `SelectField` is open and the user types "m"
- **THEN** the first option whose label starts with "m" is highlighted

### Requirement: Select search
When `searchable` is on, the popup SHALL show a search box above the list, labelled by `searchLabel` and optionally showing `searchPlaceholder`. The search box receives focus when the popup opens, and the arrow keys move through the options from it.

With `filter` on (the default), options are filtered locally by label, ignoring case and diacritics. With `filter={false}`, options are not filtered, so that the developer can provide them, for example from a server. `onSearchChange(query)` MUST be called whenever the search text changes, in both modes.

#### Scenario: Accent-insensitive filter
- **WHEN** a user types "espana" in a searchable `SelectField`
- **THEN** the option "España" is shown

### Requirement: Multiple selection display
In multiple mode, `multipleDisplay` SHALL be required.

- **`"chips"`:**
  - each selected option is a chip with a remove button named by `removeChipLabel(option)`;
  - the frame grows in height to fit the chips;
  - Backspace on the focused trigger removes the last chip;
  - chips and their buttons are siblings of the trigger, never inside it.
- **`"summary"`:**
  - the trigger shows, on one line and truncated, the content returned by `renderSummary(selectedOptions)`.

Both displays keep the popup open after each pick unless `closeOnSelect` is set.

#### Scenario: Removing a chip
- **WHEN** a user presses the remove button named "Quitar Azul" in a chips `SelectField` holding Rojo and Azul
- **THEN** the value becomes `["rojo"]` and focus stays in the field

#### Scenario: Developer-provided summary
- **WHEN** a summary `SelectField` with `renderSummary={(s) => \`${s.length} seleccionadas\`}` has three values
- **THEN** the trigger shows "3 seleccionadas"

### Requirement: Selection limit and select all
In multiple mode, `maxSelected` SHALL limit the number of selected values. Once the limit is reached, unselected options become disabled and `maxSelectedMessage` is shown above the list, if provided. `selectAll: { label }` SHALL add an option at the top of the list. It selects every enabled option up to `maxSelected` and, when all of them are selected, unselects them. It exposes its checked state, which is mixed when only some options are selected.

#### Scenario: Limit reached
- **WHEN** a `SelectField` with `maxSelected={2}` has two values
- **THEN** the other options are disabled and the provided `maxSelectedMessage` is visible

#### Scenario: Select all respects disabled options
- **WHEN** the user picks the select-all option in a list with one disabled option among four
- **THEN** the three enabled options are selected

### Requirement: Creatable options
When `searchable` and `creatable` are on and the search text does not exactly match any option label, the list SHALL end with an option whose content is `createLabel(query)`. Choosing it calls `onCreate(query)`. The developer adds the new option and decides whether it is selected. `creatable` requires `searchable`.

#### Scenario: Creating a tag
- **WHEN** a user types "Urgente" in a creatable `SelectField` with no such option and picks the create option
- **THEN** `onCreate` is called with "Urgente"

### Requirement: Server-side options
With `searchable`, `filter={false}`, `onSearchChange` and `optionsLoading`, a select field SHALL support options loaded from a server. While `optionsLoading` is true, the popup shows `optionsLoadingMessage` in its status region, if provided. The previously loaded options stay visible until new options arrive.

#### Scenario: Loading while searching
- **WHEN** the user types "lim" and the developer sets `optionsLoading` until results arrive
- **THEN** the loading message is announced, and the new options replace the old ones when `optionsLoading` turns false

### Requirement: Select field
`SelectField` SHALL be importable from `@aureus-core/ui/components/select-field`. It MUST accept the shared field props, an `action`, and every select prop described above. A `ref` MUST reach the trigger button.

#### Scenario: Minimal select
- **WHEN** a `SelectField` is rendered with only `label` and `options`
- **THEN** it shows an empty field with no text inside, and opening it lists the options

### Requirement: Select control bound to the form context
`SelectControl` SHALL be importable from `@aureus-core/ui/components/select-control`. It MUST follow the same form-binding contract as the other controls:
- it is rendered inside a `FormProvider`;
- it takes `name` (a plain string), optional `disabled` and `shouldUnregister`;
- it accepts every `SelectField` prop except `name`, `value`, `defaultValue`, `error`, `errorMessage` and `disabled`;
- the schema message is shown as helper text;
- a disabled control's value is excluded from the submitted data, while a loading control's value is kept.

The form MUST hold `string | null` in single mode and `string[]` in multiple mode. With the same props and state, a `SelectControl` MUST render the same markup as a `SelectField`, apart from generated element ids.

#### Scenario: Multiple values reach the schema
- **WHEN** a form with `tags: z.array(z.string()).min(1)` uses a multiple `SelectControl` named "tags" and the user picks two tags and submits
- **THEN** the submitted data contains `tags` as an array of the two values

#### Scenario: Schema message
- **WHEN** the user submits with no tags
- **THEN** the schema's message is shown below the field with `aria-invalid="true"` on the trigger

### Requirement: Checkbox value and custom values
A checkbox field SHALL hold a value of type `V`, `boolean` by default. It MUST work controlled (`value`) and uncontrolled (`defaultValue`), and report changes through `onValueChange`. The box is checked only when the value equals the checked value.

- **Custom values:** `checkedValue` and `uncheckedValue`, `true` and `false` by default, set the values that are reported and stored, such as `"S"`/`"N"` or `1`/`0`.
  - The props' TypeScript types MUST accept both or neither: passing only one is a type error.
  - `V` MUST be inferred from them.
- **Unknown values:** a controlled value equal to neither value MUST show the box unchecked, and a development warning MUST name it.
- **Native forms:** with `name`, a checked box MUST submit its checked value. A box using the default `true` submits the browser's default `on`.

#### Scenario: Boolean by default
- **WHEN** a user checks a `CheckboxField` with no value props
- **THEN** `onValueChange` receives `true`, and unchecking it reports `false`

#### Scenario: Custom values
- **WHEN** a user checks a `CheckboxField` with `checkedValue="S"` and `uncheckedValue="N"`
- **THEN** `onValueChange` receives `"S"`, and unchecking it reports `"N"`

#### Scenario: Only one custom value does not type-check
- **WHEN** a developer writes `<CheckboxField checkedValue="S" />` without `uncheckedValue`
- **THEN** TypeScript reports an error

### Requirement: Checkbox texts and accessible name
A checkbox field SHALL accept two independent texts:

- **`label`:** the field label above, as in every other field, with the required mark and the info button;
- **`checkboxLabel`:** a `ReactNode` beside the box. Clicking it toggles the box, and links inside it MUST navigate without toggling.

The box MUST get exactly one accessible name. No text is generated for it:

- **With both texts:** the field's group is named by `label`, and the box is named by `checkboxLabel`.
- **With only `label`:** `label` names the box.
- **With only `checkboxLabel`:** `checkboxLabel` names the box, and the required mark follows it.
- **With neither** (and no `aria-label` or `aria-labelledby`): a development warning MUST be emitted.

The helper text and error message MUST be linked to the box through `aria-describedby`. The box MUST carry `aria-invalid` and `aria-required` when they apply.

#### Scenario: Label and checkbox label
- **WHEN** a `CheckboxField` has `label="Notificaciones"` and `checkboxLabel="Recibir resumen semanal"`
- **THEN** a group named "Notificaciones" contains a checkbox named "Recibir resumen semanal"

#### Scenario: Clicking the text
- **WHEN** a user clicks the `checkboxLabel` text of an unchecked box
- **THEN** the box becomes checked

#### Scenario: Link inside the text
- **WHEN** a user clicks a link inside `checkboxLabel`
- **THEN** the link is followed and the box keeps its state

#### Scenario: No accessible name
- **WHEN** a `CheckboxField` renders without `label`, `checkboxLabel`, `aria-label` or `aria-labelledby`
- **THEN** a development warning says that the checkbox has no accessible name

### Requirement: Indeterminate checkbox
With `indeterminate`, a checkbox field SHALL show a mixed state: a dash instead of the check, the checked colours, and `aria-checked="mixed"`. The state is visual only and MUST NOT change the value. Activating an indeterminate box MUST report the checked value. The consumer decides when to clear `indeterminate`.

#### Scenario: Mixed state
- **WHEN** a `CheckboxField` has `indeterminate`
- **THEN** the box exposes `aria-checked="mixed"` and shows a dash

#### Scenario: Activating a mixed box
- **WHEN** a user clicks an indeterminate box whose `checkedValue` is `true`
- **THEN** `onValueChange` receives `true`

### Requirement: Checkbox position and card appearance
A checkbox field SHALL accept two independent layout options:

- **`checkboxPosition`:** `"start"` (the default) places the box before its text; `"end"` places it after the text, at the inline end. The layout MUST mirror in right-to-left documents.
- **`appearance`:** `"plain"` (the default) is the bare row; `"card"` wraps the row in a bordered card. With `"card"`:
  - the whole card MUST be clickable;
  - the card is highlighted when the box is checked;
  - the card uses the destructive border when the field has an error.

Neither option MUST change any other default.

#### Scenario: Box at the end
- **WHEN** a `CheckboxField` has `checkboxPosition="end"`
- **THEN** the text comes first and the box sits at the inline end of the row

#### Scenario: Clicking the card
- **WHEN** a user clicks the empty area of a `CheckboxField` with `appearance="card"`
- **THEN** the box toggles

### Requirement: Checkbox field
`CheckboxField` SHALL be exported from `@aureus-core/ui/components/checkbox-field`, together with its public types.

- **Shared props:** it supports the family's shared props: `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames` and `action`.
- **`classNames`** also targets the box, the checkbox label and the row.
- **`loading` and `disabled`:** both MUST prevent changes. `loading` MUST show a spinner at the end of the row and set `aria-busy`.
- **Keyboard:** Space MUST toggle the box. Enter MUST NOT toggle it.
- **`ref`** reaches the box element.

#### Scenario: Loading prevents changes
- **WHEN** a user clicks a `CheckboxField` that has `loading`
- **THEN** the value does not change, a spinner is shown, and the box has `aria-busy="true"`

#### Scenario: Keyboard toggle
- **WHEN** a user focuses the box and presses Space
- **THEN** the box toggles, and pressing Enter does not toggle it

### Requirement: Checkbox control bound to the form context
`CheckboxControl` SHALL be exported from `@aureus-core/ui/components/checkbox-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`. It takes no `control`, no `rules` and no explicit type parameters.

- **Stored value:** the form MUST store the checked or unchecked value. When the form value is missing, the control MUST show the unchecked state.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** react-hook-form's `shouldFocusError` MUST move focus to the box.
- **Parity:** with the same props, `CheckboxControl` MUST render the same markup as `CheckboxField`.

#### Scenario: Required acceptance
- **WHEN** a form with the schema `terms: z.literal(true, { error: "Debes aceptar los términos." })` is submitted with the box unchecked
- **THEN** "Debes aceptar los términos." is shown below the field, the box has `aria-invalid="true"`, and it receives focus

#### Scenario: Custom values in the form
- **WHEN** a user checks a `CheckboxControl` with `name="active"`, `checkedValue="S"` and `uncheckedValue="N"`, and submits
- **THEN** the submitted data contains `active: "S"`

#### Scenario: Parity with the field
- **WHEN** a `CheckboxField` and a `CheckboxControl` render with the same props and the same unchecked value
- **THEN** their markup is identical, apart from generated ids

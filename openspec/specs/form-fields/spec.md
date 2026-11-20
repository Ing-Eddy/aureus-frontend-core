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

### Requirement: Disabled state
When `disabled` is true, the input and the integrated action button SHALL be disabled, and the label MUST be shown dimmed. For a control, a disabled field MUST follow the form library's disabled semantics: its value is excluded from the submitted data.

#### Scenario: Disabled control is excluded from submission
- **WHEN** a form is submitted while a `TextControl` named "nickname" is `disabled`
- **THEN** the submitted data has no value for "nickname"

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

### Requirement: Checkbox group options and value
A checkbox group field SHALL take `options` as an array of `{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`, and render one box per option. Its value is a `string[]`.

- **Value:** it MUST work controlled (`value`) and uncontrolled (`defaultValue`, which defaults to `[]`), and report changes through `onValueChange`.
- **Order:** the reported value MUST follow the order of `options`, whatever order the boxes were checked in.
- **Unknown values:** values that are not in `options` MUST be kept at the end of the value, and a development warning MUST name them.
- **Native forms:** with `name`, each checked box MUST submit `name=value`.

#### Scenario: Value follows the options order
- **WHEN** a user checks "SMS" and then "Email" in a group whose options are Email, SMS and Push
- **THEN** `onValueChange` last receives `["email", "sms"]`

#### Scenario: Unchecking
- **WHEN** a user unchecks "Email" in a group whose value is `["email", "sms"]`
- **THEN** `onValueChange` receives `["sms"]`

#### Scenario: Value not yet in options
- **WHEN** a group has `value={["email", "fax"]}` and `options` does not include `fax`
- **THEN** "Email" is checked, `fax` is kept in the value, and a development warning names `fax`

#### Scenario: Native submission
- **WHEN** a group with `name="channels"` and Email and SMS checked is submitted in a native form
- **THEN** `FormData.getAll("channels")` returns `["email", "sms"]`

### Requirement: Checkbox group naming and description
The group SHALL be exposed as a `group` named by the field `label`. Its `aria-describedby` MUST include the helper text (or the error message) and the info content.

- **Without a group name:** without `label`, `aria-label` or `aria-labelledby`, a development warning MUST be emitted. No text is generated.
- **Each box** MUST be named by its option's `label`, and described by the option's `description` when there is one.
- **Option labels:** clicking an option's label toggles its box, and links inside the label MUST navigate without toggling.
- **Error:** with `error`, every box MUST carry `aria-invalid`.
- **Required:** `required` MUST show the required mark on the label, and MUST NOT set `aria-required` on the individual boxes.

#### Scenario: Named group with named boxes
- **WHEN** a group has `label="Canales"` and an option `{ value: "email", label: "Email", description: "Resumen diario" }`
- **THEN** a group named "Canales" contains a checkbox named "Email" with the description "Resumen diario"

#### Scenario: Group without a name
- **WHEN** a group renders without `label`, `aria-label` or `aria-labelledby`
- **THEN** a development warning says that the group has no accessible name

### Requirement: Checkbox group select all
With `selectAll={{ label }}`, the group SHALL render a parent box before the options, named by `selectAll.label`. The props' TypeScript types MUST require `label` whenever `selectAll` is passed.

- **State:** the parent box is:
  - checked when every enabled option is checked;
  - unchecked when no enabled option is checked;
  - mixed (`aria-checked="mixed"`) otherwise.
- **Activation from unchecked or mixed:** it MUST check the enabled options in order, stopping at `maxSelected`, unless the limit is already reached.
- **Activation from checked, or with the limit reached:** it MUST uncheck every enabled option.
- **Disabled options** MUST keep their state in both cases.

#### Scenario: Select all respects disabled options
- **WHEN** a user activates the select-all box in a group with Email, SMS and Push, where Push is disabled
- **THEN** the value becomes `["email", "sms"]` and the select-all box is checked

#### Scenario: Mixed state
- **WHEN** only some enabled options are checked
- **THEN** the select-all box exposes `aria-checked="mixed"`

#### Scenario: Select all without its label does not type-check
- **WHEN** a developer writes `<CheckboxGroupField selectAll={{}} … />`
- **THEN** TypeScript reports an error

### Requirement: Checkbox group selection limit
With `maxSelected`, once the number of checked options reaches the limit, every unchecked option MUST be disabled, until an option is unchecked.

- **`maxSelectedMessage`:** when it is passed, it MUST be shown while the limit is reached, in a `status` region. Without it, nothing MUST be shown.

#### Scenario: Limit reached
- **WHEN** a user checks two options in a group with `maxSelected={2}` and four options
- **THEN** the two unchecked options are disabled, and checking is no longer possible until one is unchecked

#### Scenario: Message only when provided
- **WHEN** the limit is reached in a group without `maxSelectedMessage`
- **THEN** no limit text is shown

### Requirement: Checkbox group layout and appearance
A checkbox group field SHALL accept independent layout options. None of them MUST change any other default, and all of them MUST mirror in right-to-left documents.

- **`orientation`:** `"vertical"` (the default) stacks the options; `"horizontal"` places them inline and wraps them when they do not fit.
- **`columns`:** `2`, `3` or `4` arranges the options in a grid of that many columns. The grid MUST collapse to one column when the group's container is too narrow.
- **`appearance`:** `"plain"` (the default), or `"card"`, which renders each option as a bordered, clickable card highlighted when checked.
- **`checkboxPosition`:** `"start"` (the default) or `"end"`, applied to every option.

#### Scenario: Columns collapse in a narrow container
- **WHEN** a group with `columns={3}` is rendered in a container narrower than the column breakpoint
- **THEN** the options are shown in a single column without horizontal overflow

#### Scenario: Cards
- **WHEN** a user clicks the empty area of an option card in a group with `appearance="card"`
- **THEN** that option toggles

### Requirement: Checkbox group field
`CheckboxGroupField` SHALL be exported from `@aureus-core/ui/components/checkbox-group-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className` and `classNames`.
- **`loading` and `disabled`:** both MUST disable every box. `loading` MUST also show a spinner next to the label and set `aria-busy` on the group.
- **Keyboard:** Tab moves through the enabled boxes, and Space toggles the focused box.
- **`onBlur`** fires when focus leaves the group.

#### Scenario: Loading group
- **WHEN** a group has `loading`
- **THEN** every box is disabled, a spinner is shown, and the group has `aria-busy="true"`

#### Scenario: Keyboard
- **WHEN** a user tabs into a group whose second option is disabled, and presses Space, Tab and Space
- **THEN** the first and the third options are checked

### Requirement: Checkbox group control bound to the form context
`CheckboxGroupControl` SHALL be exported from `@aureus-core/ui/components/checkbox-group-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the `string[]` value. A missing form value MUST behave as `[]`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** react-hook-form's `shouldFocusError` MUST move focus to the first enabled box.
- **Parity:** with the same props, the control MUST render the same markup as `CheckboxGroupField`.

#### Scenario: Minimum from the schema
- **WHEN** a form with the schema `channels: z.array(z.string()).min(1, "Elige al menos un canal.")` is submitted with no box checked
- **THEN** "Elige al menos un canal." is shown below the group, every box has `aria-invalid="true"`, and focus moves to the first enabled box

#### Scenario: Submitted value
- **WHEN** a user checks SMS and then Email and submits
- **THEN** the submitted data contains `channels: ["email", "sms"]`

#### Scenario: Parity with the field
- **WHEN** a `CheckboxGroupField` and a `CheckboxGroupControl` render with the same props and the same value
- **THEN** their markup is identical, apart from generated ids

### Requirement: Radio group options and value
A radio group field SHALL take `options` as an array of `{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`, render one radio per option, and allow at most one checked radio at a time.

- **Value:** a `string | null`, `null` while nothing is chosen. It MUST work controlled (`value`) and uncontrolled (`defaultValue`, which defaults to `null`), and report changes through `onValueChange`.
- **Unknown values:** a value that matches no option (without `otherOption`) MUST leave every radio unchecked and be kept until the user chooses, and a development warning MUST name it.
- **Native forms:** with `name`, the checked radio MUST submit `name=value`.

#### Scenario: Exclusive selection
- **WHEN** a user chooses "Pro" and then "Gratis" in a group with the options Gratis and Pro
- **THEN** only "Gratis" is checked and `onValueChange` last receives `"free"`

#### Scenario: Nothing chosen
- **WHEN** a group renders without `value` or `defaultValue`
- **THEN** no radio is checked and the value is `null`

#### Scenario: Native submission
- **WHEN** a group with `name="plan"` and "Pro" checked is submitted in a native form
- **THEN** `FormData.get("plan")` returns `"pro"`

### Requirement: Radio group naming, description and keyboard
The group SHALL be exposed as a `radiogroup` named by the field `label` and described by the helper text (or error message) and the info content.

- **Group attributes:** `aria-required` when `required`, and `aria-invalid` when `error`.
- **Without a name:** without `label`, `aria-label` or `aria-labelledby`, a development warning MUST be emitted. No text is generated.
- **Each radio** MUST be named by its option's `label`, and described by the option's `description` when there is one.
- **Option labels:** clicking an option's label selects it, and links inside the label MUST navigate without selecting.
- **Keyboard:** the group MUST follow the WAI-ARIA radio group pattern:
  - Tab enters the group on the checked radio, or on the first enabled radio when none is checked;
  - the next Tab leaves the group;
  - the arrow keys move to the next or previous enabled radio, wrapping around, and check it;
  - Space checks the focused radio.
- **Arrow axes:** `orientation="vertical"` uses Up and Down; `"horizontal"` uses Left and Right; with `columns`, both axes apply.

#### Scenario: Named radio group
- **WHEN** a group has `label="Plan"`, `required` and an option `{ value: "pro", label: "Pro", description: "Proyectos ilimitados" }`
- **THEN** a radiogroup named "Plan" with `aria-required="true"` contains a radio named "Pro" with the description "Proyectos ilimitados"

#### Scenario: One tab stop and arrow selection
- **WHEN** a user tabs into a vertical group whose second option is disabled, and presses Down Arrow
- **THEN** focus enters on the first radio, Down Arrow checks the third radio, and the next Tab leaves the group

### Requirement: Radio group layout and appearance
A radio group field SHALL accept independent layout options. None of them MUST change any other default, and all of them MUST mirror in right-to-left documents.

- **`orientation`:** `"vertical"` (the default) or `"horizontal"`, which places the options inline and wraps them.
- **`columns`:** `2`, `3` or `4`, a grid that collapses to one column when its container is too narrow.
- **`radioPosition`:** `"start"` (the default) or `"end"`.
- **`appearance`:**
  - `"plain"` (the default);
  - `"card"`, which renders each option as a bordered, clickable card highlighted when checked;
  - `"segmented"`, which renders the options as joined segments.

  Each segment MUST be the radio itself, named by the option's label, with a visible checked state and a minimum height of 36 px (44 px on coarse pointers). Segments do not show descriptions and ignore `radioPosition`.

#### Scenario: Segmented
- **WHEN** a group with `appearance="segmented"` and the options Mensual and Anual renders
- **THEN** two radios named "Mensual" and "Anual" are shown as joined segments, and the checked one is visually distinct

#### Scenario: Columns collapse in a narrow container
- **WHEN** a group with `columns={3}` is rendered in a container narrower than the column breakpoint
- **THEN** the options are shown in a single column without horizontal overflow

### Requirement: Radio group other option
With `otherOption={{ label, inputLabel, placeholder? }}`, the group SHALL render an extra radio, named by `label`, after the options. The props' TypeScript types MUST require `label` and `inputLabel` whenever `otherOption` is passed.

- **Choosing it:** a text input named by `inputLabel` MUST appear under it, and the value becomes the typed text (`""` while empty).
- **Focus:** when the other option is chosen with the pointer, the input MUST receive focus. When it is chosen with the arrow keys, focus MUST stay on the radio, so the arrows keep moving through the group, and the next Tab MUST move into the input.
- **Choosing another option** MUST hide the input and report that option's value.
- **Value outside `options`:** it MUST be shown as the other option checked, with that text in the input, and MUST NOT trigger the unknown-value warning.
- **Clicks in the input** MUST NOT change the selection.

#### Scenario: Typing another value
- **WHEN** a user clicks "Otro" and types "Podcast"
- **THEN** the input named by `inputLabel` has focus and `onValueChange` last receives `"Podcast"`

#### Scenario: Other option from the keyboard
- **WHEN** a user moves onto "Otro" with the arrow keys and presses Tab
- **THEN** focus moves into the input named by `inputLabel`

#### Scenario: Other option without its input label does not type-check
- **WHEN** a developer writes `otherOption={{ label: "Otro" }}`
- **THEN** TypeScript reports an error

### Requirement: Radio group deselection
By default, the checked radio SHALL stay checked when it is activated again. With `deselectable`, activating the checked radio by pointer or with Space MUST uncheck it and report `null`.

#### Scenario: Default keeps the selection
- **WHEN** a user clicks the checked radio of a group without `deselectable`
- **THEN** it stays checked and `onValueChange` is not called

#### Scenario: Deselectable
- **WHEN** a user clicks the checked radio of a group with `deselectable`
- **THEN** no radio is checked and `onValueChange` receives `null`

### Requirement: Radio group field
`RadioGroupField` SHALL be exported from `@aureus-core/ui/components/radio-group-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className` and `classNames`.
- **`loading` and `disabled`:** both MUST disable every radio and set `aria-disabled` on the radiogroup. `loading` MUST also show a spinner next to the label and set `aria-busy`.
- **`onBlur`** fires when focus leaves the group. The `ref` reaches the radiogroup element.

#### Scenario: Loading group
- **WHEN** a group has `loading`
- **THEN** every radio is disabled, a spinner is shown, and the radiogroup has `aria-busy="true"`

### Requirement: Radio group control bound to the form context
`RadioGroupControl` SHALL be exported from `@aureus-core/ui/components/radio-group-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the `string | null` value, or the other option's text. A missing form value MUST behave as `null`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** react-hook-form's `shouldFocusError` MUST move focus to the checked radio, or to the first enabled radio when none is checked.
- **Parity:** with the same props, the control MUST render the same markup as `RadioGroupField`.

#### Scenario: Required choice from the schema
- **WHEN** a form with the schema `plan: z.string({ error: "Elige un plan." })` is submitted with nothing chosen
- **THEN** "Elige un plan." is shown below the group, the radiogroup has `aria-invalid="true"`, and focus moves to the first enabled radio

#### Scenario: Submitted value
- **WHEN** a user chooses "Pro" and submits
- **THEN** the submitted data contains `plan: "pro"`

#### Scenario: Parity with the field
- **WHEN** a `RadioGroupField` and a `RadioGroupControl` render with the same props and the same value
- **THEN** their markup is identical, apart from generated ids

### Requirement: Switch value and custom values
A switch field SHALL hold a value of type `V`, `boolean` by default. It MUST work controlled (`value`) and uncontrolled (`defaultValue`), and report changes through `onValueChange`. The switch is on only when the value equals the checked value.

- **Custom values:** `checkedValue` and `uncheckedValue` (`true` and `false` by default) set the reported and stored values.
  - The props' TypeScript types MUST accept both or neither.
  - `V` MUST be inferred from them, so an unannotated `onValueChange` callback is typed.
- **Unknown values:** a controlled value equal to neither value MUST show the switch off, and a development warning MUST name it.
- **Native forms:** with `name`, an on switch MUST submit its checked value. A switch using the default `true` submits the browser's default `on`.

#### Scenario: Boolean by default
- **WHEN** a user turns on a `SwitchField` with no value props
- **THEN** `onValueChange` receives `true`, and turning it off reports `false`

#### Scenario: Custom values
- **WHEN** a user turns on a `SwitchField` with `checkedValue="public"` and `uncheckedValue="private"`
- **THEN** `onValueChange` receives `"public"`

#### Scenario: Only one custom value does not type-check
- **WHEN** a developer writes `<SwitchField checkedValue="public" />` without `uncheckedValue`
- **THEN** TypeScript reports an error

### Requirement: Switch texts and accessible name
A switch field SHALL accept two independent texts:

- **`label`:** the field label above, with the required mark and the info button;
- **`switchLabel`:** a `ReactNode` beside the switch. Clicking it toggles the switch, and links inside it MUST navigate without toggling.

The switch MUST be a `switch` with `aria-checked` and exactly one accessible name. No text is generated:

- **With both texts:** the field's group is named by `label`, and the switch is named by `switchLabel`.
- **With only one of them:** that text names the switch.
- **With neither** (and no `aria-label` or `aria-labelledby`): a development warning MUST be emitted.

The helper text and info MUST be linked through `aria-describedby`. The switch MUST carry `aria-invalid` and `aria-required` when they apply.

#### Scenario: Named switch
- **WHEN** a `SwitchField` has `label="Notificaciones"` and `switchLabel="Resumen semanal"`
- **THEN** a group named "Notificaciones" contains a switch named "Resumen semanal" with `aria-checked="false"`

#### Scenario: Link inside the text
- **WHEN** a user clicks a link inside `switchLabel`
- **THEN** the link is followed and the switch keeps its state

### Requirement: Switch appearance
A switch field SHALL accept independent appearance options. None of them MUST change another default.

- **`switchPosition`:** `"start"` (the default) or `"end"`, which places the switch after its text, at the inline end.
- **`appearance`:** `"plain"` (the default), or `"card"`, a bordered, clickable card highlighted when the switch is on.
- **`size`:** `"default"` or `"sm"`. Both MUST keep a pointer target of at least 24×24 px, counting the clickable text.
- **`stateLabels={{ on, off }}`:** shows the text of the current state next to the switch.
- **`thumbIcons={{ on, off }}`:** shows the icon of the current state inside the thumb.

`stateLabels` and `thumbIcons` MUST be hidden from assistive technology, because `aria-checked` already conveys the state, and their TypeScript types MUST require both keys.

**Right-to-left:** the thumb MUST rest at the inline start when off and move to the inline end when on, in left-to-right and right-to-left documents alike.

#### Scenario: State label follows the state
- **WHEN** a user turns on a switch with `stateLabels={{ on: "Sí", off: "No" }}`
- **THEN** the visible state text changes from "No" to "Sí", and it is not part of the switch's accessible name

#### Scenario: Thumb in right-to-left
- **WHEN** a switch that is on renders in a right-to-left document
- **THEN** its thumb is at the left end of the track

#### Scenario: Incomplete state labels do not type-check
- **WHEN** a developer writes `stateLabels={{ on: "Sí" }}`
- **THEN** TypeScript reports an error

### Requirement: Switch asynchronous change
With `onBeforeChange(next)`, the switch SHALL call it before changing, with the value it would change to. It returns `boolean` or `Promise<boolean>`.

- **Confirmed** (`true`, or a promise resolving to `true`): the value changes and `onValueChange` is called.
- **Rejected** (`false`, a promise resolving to `false`, or a rejected promise): the switch keeps its state and `onValueChange` MUST NOT be called.
- **While a returned promise is pending:**
  - the switch MUST stay in its current state and show a spinner inside the thumb;
  - it MUST set `aria-busy` and ignore further toggles.
- **Unmounting** while the promise is pending MUST NOT report a change.

#### Scenario: Confirmed save
- **WHEN** a user turns on a switch whose `onBeforeChange` resolves to `true` after a delay
- **THEN** during the delay the switch is off, busy and shows a spinner, and afterwards it is on and `onValueChange` receives `true`

#### Scenario: Failed save
- **WHEN** a user turns on a switch whose `onBeforeChange` rejects
- **THEN** the switch stays off and `onValueChange` is not called

### Requirement: Switch field
`SwitchField` SHALL be exported from `@aureus-core/ui/components/switch-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames` and `action`.
- **`loading`:** MUST show a spinner inside the thumb, lock the switch and set `aria-busy`.
- **`disabled`:** MUST lock the switch.
- **Keyboard:** Space and Enter toggle the focused switch. A locked switch MUST NOT toggle.
- **`ref`:** reaches the switch element.

#### Scenario: Loading switch
- **WHEN** a user clicks a `SwitchField` that has `loading`
- **THEN** the value does not change, the thumb shows a spinner, and the switch has `aria-busy="true"`

#### Scenario: Keyboard toggle
- **WHEN** a user focuses the switch and presses Space, then Enter
- **THEN** the switch turns on and then off

### Requirement: Switch control bound to the form context
`SwitchControl` SHALL be exported from `@aureus-core/ui/components/switch-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the checked or unchecked value. A missing form value MUST show the switch off.
- **With `onBeforeChange`:** the form MUST receive only confirmed values.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST move focus to the switch.
- **Parity:** with the same props, the control MUST render the same markup as `SwitchField`.

#### Scenario: Required acceptance
- **WHEN** a form with `consent: z.literal(true, { error: "Activa el consentimiento." })` is submitted with the switch off
- **THEN** "Activa el consentimiento." is shown below the field, the switch has `aria-invalid="true"`, and it receives focus

#### Scenario: Only confirmed values reach the form
- **WHEN** a user turns on a `SwitchControl` whose `onBeforeChange` resolves to `false`, and submits
- **THEN** the submitted value is still the unchecked value

### Requirement: OTP value, length and completion
An OTP field SHALL take a required `length` and render that many character boxes over a single text input. Its value is a `string` of at most `length` characters, controlled (`value`) or uncontrolled (`defaultValue`, which defaults to `""`), reported through `onValueChange`.

- **`onComplete(code)`:** MUST be called once each time the value reaches `length` characters.
- **`submitOnComplete`:** submits the surrounding form after `onComplete`. Without it, completing MUST NOT submit anything.
- **Native forms:** with `name`, the value MUST be submitted.

#### Scenario: Typing a code
- **WHEN** a user types `123456` into an `OtpField` with `length={6}`
- **THEN** each box shows one digit, `onValueChange` last receives `"123456"`, and `onComplete` is called once with `"123456"`

#### Scenario: Submit on complete
- **WHEN** a user types the last digit of an `OtpField` with `submitOnComplete` inside a form
- **THEN** the form is submitted after `onComplete`

### Requirement: OTP character set and paste
An OTP field SHALL accept `charset`:

- `"digits"` (the default);
- `"alphanumeric"`;
- `"letters"`;
- `{ pattern: string; inputMode? }`.

Characters outside the set MUST be rejected, and the input MUST use the matching `pattern` and `inputMode` (`numeric` for digits, `text` otherwise), so mobile devices show the matching keyboard.

- **`uppercase`:** typed and pasted letters MUST become uppercase.
- **Pasting:** spaces and dashes MUST be removed before the text is filtered and trimmed to `length`.

#### Scenario: Pasting a formatted code
- **WHEN** a user pastes `"123 456"` or `"123-456"` into a digits `OtpField` with `length={6}`
- **THEN** the value becomes `"123456"`

#### Scenario: Rejecting characters
- **WHEN** a user types a letter into a digits `OtpField`
- **THEN** the value does not change

#### Scenario: Uppercase alphanumeric
- **WHEN** a user types `ab12` into an `OtpField` with `charset="alphanumeric"` and `uppercase`
- **THEN** the value is `"AB12"`

### Requirement: OTP groups and separator
With `groups` (an array of positive integers whose sum is `length`), an OTP field SHALL split the boxes into blocks of those sizes, with a decorative `separator` between blocks (shadcn's dash by default).

- **Invalid `groups`:** when the sum does not match `length`, the boxes MUST render as one block and a development warning MUST name the mismatch.
- **Narrow containers:** blocks MUST wrap as whole blocks, and the field MUST NOT overflow horizontally.

#### Scenario: Two groups
- **WHEN** an `OtpField` has `length={6}` and `groups={[3, 3]}`
- **THEN** it shows two blocks of three boxes with a separator between them

#### Scenario: Mismatched groups
- **WHEN** an `OtpField` has `length={6}` and `groups={[3, 2]}`
- **THEN** it shows one block of six boxes, and a development warning reports the mismatch

### Requirement: OTP masking and reveal
With `masked`, an OTP field SHALL show a dot in each filled box instead of its character.

With `reveal={{ showLabel, hideLabel }}` on a masked field, it SHALL render a toggle button:

- the button's accessible name is `showLabel` while masked and `hideLabel` while revealed;
- it has `aria-pressed`;
- it shows or hides the characters without moving focus away from the input.

The props' TypeScript types MUST require both texts. `reveal` without `masked` MUST emit a development warning.

#### Scenario: Masked PIN
- **WHEN** a user types `1234` into an `OtpField` with `length={4}` and `masked`
- **THEN** the boxes show four dots and the value is `"1234"`

#### Scenario: Reveal toggle
- **WHEN** a user presses the button named "Mostrar PIN" of a masked field with `reveal={{ showLabel: "Mostrar PIN", hideLabel: "Ocultar PIN" }}`
- **THEN** the boxes show the characters, and the button is named "Ocultar PIN" with `aria-pressed="true"`

### Requirement: OTP accessibility
The OTP field SHALL expose one text input as its form control:

- it is labelled by the field `label` and described by the helper text (or error message) and info;
- it carries `aria-invalid`, `aria-required` and `aria-busy` when they apply;
- it has `autocomplete="one-time-code"` and `maxLength` equal to `length`.

The visual boxes and separators MUST be hidden from assistive technology, so the code is not read twice. Without `label`, `aria-label` or `aria-labelledby`, a development warning MUST be emitted.

**Right-to-left:** the boxes MUST keep a left-to-right order in right-to-left documents.

#### Scenario: One labelled input
- **WHEN** an `OtpField` has `label="Código"` and `helperText="Te lo enviamos por SMS."`
- **THEN** the only form control is a textbox named "Código" and described by "Te lo enviamos por SMS.", with `autocomplete="one-time-code"`, and the boxes are not exposed to assistive technology

#### Scenario: Code order in RTL
- **WHEN** an `OtpField` with the value `"123"` renders in a right-to-left document
- **THEN** the first box from the left shows `1`

### Requirement: OTP field
`OtpField` SHALL be exported from `@aureus-core/ui/components/otp-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames` and `action`.
- **`loading`:** MUST show a spinner after the boxes, prevent typing and set `aria-busy`.
- **`disabled`:** MUST prevent typing.
- **`autoFocus`:** MUST focus the input on mount.
- **`ref`:** reaches the input.

#### Scenario: Verifying
- **WHEN** an `OtpField` has `loading`
- **THEN** a spinner is shown, typing does not change the value, and the input has `aria-busy="true"`

### Requirement: OTP control bound to the form context
`OtpControl` SHALL be exported from `@aureus-core/ui/components/otp-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the `string` value. A missing form value MUST behave as `""`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the input.
- **Parity:** with the same props, the control MUST render the same markup as `OtpField`.

#### Scenario: Incomplete code
- **WHEN** a form with `code: z.string().length(6, "Introduce los 6 dígitos.")` is submitted with `"123"`
- **THEN** "Introduce los 6 dígitos." is shown below the field, the input has `aria-invalid="true"`, and it receives focus

#### Scenario: Submitted value
- **WHEN** a user types `123456` and submits
- **THEN** the submitted data contains `code: "123456"`

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

### Requirement: File value with new and existing items
A file field SHALL hold a list of file items. Each item is either new (a file picked in this session, not yet sent) or existing (a file the backend already stores, described by the backend's own data). Every item MUST have an id that stays stable while the field is mounted.

- **Existing items:** the field MUST show them through `getFileInfo(data)`, which returns at least a name and optionally a URL, a size and a type. An existing item with a URL MUST show its name as a link that opens the URL.
- **Single or multiple:**
  - without `multiple`, the value MUST be one item or `null`, and picking a file MUST replace the current one;
  - with `multiple`, the value MUST be an array, and picking files MUST append them in order.
- **Controlled and uncontrolled:** the field MUST work with `value`/`onValueChange` and with `defaultValue`. Every change (add, remove, replace, reorder, upload completed) MUST call `onValueChange` with the whole new value.
- **Removing:** removing an item MUST take it out of the value whether it is new or existing.

#### Scenario: Update form with stored files
- **WHEN** a multiple `FileField` gets two existing items whose data have a URL, and the user removes one and picks a new file
- **THEN** the value is the remaining existing item followed by one new item, and the remaining item's name links to its URL

#### Scenario: Single file replaced
- **WHEN** a `FileField` without `multiple` holds an existing item and the user picks a file
- **THEN** the value is one new item with that file

### Requirement: File helpers for submitting
The file field module SHALL export helpers that work with the value outside React:

- **`diffFiles(initial, current)`:** MUST return the files of the new items (`added`), the data of the existing items still present (`kept`), and the data of the initial existing items no longer present (`removed`). Items are compared by id.
- **`toFormData(items, field, formData?)`:** MUST append the file of every new item under `field` to the given or a new `FormData`, and return it.
- **`fileToBase64(file)`:** MUST resolve to the file's data URL.
- **`hasPendingUploads(items)`:** MUST be true while any new item remains in a field that uploads immediately. The consumer uses it in a schema to block the submit.
- **`isNewFile(item)` and `isExistingFile(item)`:** MUST narrow the item's type.

#### Scenario: Changes of an update form
- **WHEN** the initial value has existing items A and B, and the current value has B and a new file `photo.png`
- **THEN** `diffFiles` returns `added: [photo.png]`, `kept: [B's data]` and `removed: [A's data]`

### Requirement: File restrictions and rejections
A file field SHALL accept `accept` (MIME types, wildcards such as `image/*`, and extensions), `maxSize`, `minSize`, `maxFiles` and `maxTotalSize`. Each is independent and opt-in.

- **Rejected files:** a file that breaks a restriction MUST NOT enter the value. The field MUST call `onReject` with every rejected file and its reasons (`type`, `size-max`, `size-min`, `count`, `total-size`).
- **Count limits:** with `maxFiles`, the files beyond the limit MUST be rejected with `count`, in the order they were picked. The files that fit are added.
- **Messages:** `rejectionMessage(rejection)` (optional) MUST be shown for each rejection of the last attempt as an alert. Without it, nothing is shown.
- **Picker filter:** `accept` MUST also be set on the native input, so the system picker filters files. Dropped and pasted files are checked as well.

#### Scenario: File too large
- **WHEN** a `FileField` with `maxSize={1048576}` and `rejectionMessage={(r) => \`${r.file.name} supera 1 MB\`}` gets a 2 MB file
- **THEN** the value does not change, `onReject` receives the file with the reason `size-max`, and "photo.png supera 1 MB" is announced as an alert

#### Scenario: Beyond the limit
- **WHEN** a multiple `FileField` with `maxFiles={2}` holding one item gets three files
- **THEN** the first file is added and the other two are rejected with `count`

### Requirement: File appearances and dropzone
A file field SHALL offer `appearance`:

- **`list`** (the default): a row per item with an icon (or a thumbnail for images), the name, the size and the item's actions;
- **`grid`:** a tile per item with a thumbnail or an icon, the name and the actions. The tiles wrap and fill the available width;
- **`single`:** one large preview (the image, or an icon and the name) with replace and remove actions. It is only valid without `multiple`.

Other rules:

- **Choosing files:** a button, named by `chooseLabel`, opens the system picker. It MUST always be present while more files can be added, and MUST be the field's focusable entry point.
- **`dropzone`** (opt-in) MUST add an area, showing `dropzoneText`, that accepts dropped files and highlights while files are dragged over it. It MUST NOT be the only way to add files, and it is not focusable.
- **Previews:** an image preview MUST be released when its item leaves the value or the field unmounts.
- **Sizes:** they MUST be formatted with `Intl` for `locale` (bytes, kilobytes or megabytes, as the value requires). An existing item without a size MUST show no size.
- **Disabled or loading:** the button, the dropzone and every item action MUST be disabled.

#### Scenario: Dropping files
- **WHEN** a multiple `FileField` with `dropzone` gets two files dropped on its area
- **THEN** both are added to the value in order

#### Scenario: Thumbnail released
- **WHEN** an image item is removed from a `grid` field
- **THEN** its preview URL is released

### Requirement: Immediate file upload
With `upload(file, { signal, onProgress })`, a file field SHALL upload each accepted new file as soon as it is added.

- **Progress:** while uploading, the item MUST show a progress bar named by `uploadProgressLabel(name)` that follows the values passed to `onProgress` (0 to 100), and a cancel action named by `cancelUploadLabel(name)`.
- **Completion:** when `upload` resolves, the item MUST become an existing item with the resolved data, in the same position and with the same id.
- **Failure:** when `upload` rejects, the item MUST stay new and show `uploadErrorText(name)` and a retry action named by `retryUploadLabel(name)`. `onUploadError(file, error)` MUST be called.
- **Cancel and unmount:** cancelling MUST abort the upload through `signal` and remove the item. Unmounting MUST abort every pending upload.
- **Without `upload`:** files stay new until the consumer sends them.

#### Scenario: Upload completes
- **WHEN** a `FileField` with `upload` gets `contract.pdf`, reports 50 % progress, and resolves with `{ id: 7, url: "/files/7" }`
- **THEN** the progress bar shows 50 while pending, and the item then becomes an existing item with that data, in the same position

#### Scenario: Pending uploads block the submit
- **WHEN** a `FileControl` with `upload` is validated by a schema with `.refine((v) => !hasPendingUploads(v), "Espera a que terminen las subidas.")` and is submitted while a file is uploading
- **THEN** the submit is blocked and "Espera a que terminen las subidas." is shown below the field

### Requirement: File reordering, paste, camera and transform
Each of these extras SHALL be opt-in and independent.

- **`reorderable`** (only with `multiple`) MUST let users change the order of the items:
  - **Keyboard:** each item has a move handle named by `moveLabel(name)`. Space or Enter grabs the item, the arrow keys move it, Space or Enter drops it, and Escape returns it to its original position. Each move is announced with `moveAnnouncement(name, position, total)`.
  - **Pointer:** dragging the handle moves the item, with touch included.
  - **Value:** the new order MUST be reported through `onValueChange`.
- **`pasteable`** MUST add the files pasted while focus is inside the field, with the same restrictions as picked files.
- **`capture`** (`"user"` or `"environment"`) MUST be set on the native input, so mobile browsers open the camera.
- **`transform(file)`** MUST be applied to each accepted file before it is added (and before it is uploaded). If it rejects, the file is reported through `onReject` and not added.

#### Scenario: Reordering with the keyboard
- **WHEN** a user focuses the move handle of the first of three items, presses Space, ArrowDown and Space
- **THEN** the item is second in the value, and the announcement says it moved to position 2 of 3

#### Scenario: Pasting an image
- **WHEN** a user pastes an image while focus is inside a `FileField` with `pasteable`
- **THEN** the image is added as a new item

### Requirement: File field texts
A file field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while the feature is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| always | `chooseLabel`, `removeLabel(name)` |
| `dropzone` | `dropzoneText` |
| `appearance="single"` | `replaceLabel(name)` |
| `upload` | `uploadProgressLabel(name)`, `cancelUploadLabel(name)`, `retryUploadLabel(name)`, `uploadErrorText(name)` |
| `reorderable` | `moveLabel(name)`, `moveAnnouncement(name, position, total)` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Optional texts render nothing when they are omitted: `rejectionMessage`, `addedAnnouncement(count)` and `removedAnnouncement(name)`.

#### Scenario: Dropzone without its text
- **WHEN** a developer writes `<FileField chooseLabel="Elegir" removeLabel={(n) => n} dropzone />` without `dropzoneText`
- **THEN** TypeScript reports an error

### Requirement: File field accessibility
- **Choose button:** the choose button MUST be the native file input itself, visually hidden but focusable and presented by a label that looks like a button. Focusing it MUST show a visible focus ring on that label, and Enter, Space and a click MUST open the system picker. Its accessible name (`chooseLabel` followed by the field's label), description (helper, info, error), `aria-required` and `aria-invalid` MUST be on it. A `button` cannot carry `aria-required`, so the native input is used instead.
- **Group name:** the field's label MUST name the group of items.
- **Actions:** every item action (open, remove, replace, cancel, retry, move) MUST be a button or link with a name that includes the file's name.
- **Announcements:** additions, removals, rejections and upload failures MUST be announced through live regions with the developer's texts.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels, transitions MUST respect reduced motion, and the layout MUST follow the page's direction.

#### Scenario: Choose button
- **WHEN** a `FileField` with `label="Contrato"`, `required` and `helperText="PDF, hasta 10 MB"` renders with `chooseLabel="Elegir archivo"`
- **THEN** the file input's accessible name is "Elegir archivo Contrato", its description contains "PDF, hasta 10 MB", and it has `aria-required="true"`

### Requirement: File field
`FileField` SHALL be exported from `@aureus-core/ui/components/file-field`, together with its public types and the file helpers.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **`ref`:** reaches the choose button (the native file input).
- **`onBlur`:** called when focus leaves the field.
- **Native submission:** with `name`, the native input MUST carry the new items' files, so a native form submission includes them.

#### Scenario: Native submission
- **WHEN** a `FileField` with `name="docs"` holds two new items inside a plain `<form>`
- **THEN** `new FormData(form).getAll("docs")` returns both files

### Requirement: File control bound to the form context
`FileControl` SHALL be exported from `@aureus-core/ui/components/file-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the file items. A missing form value MUST behave as `[]` with `multiple` and `null` without it.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the choose button (the native file input).
- **Parity:** with the same props, the control MUST render the same markup as `FileField`.

#### Scenario: Required file
- **WHEN** a form with `contract: z.array(z.any()).min(1, "Adjunta el contrato.")` is submitted with no file
- **THEN** "Adjunta el contrato." is shown below the field, and the file input has `aria-invalid="true"` and receives focus

#### Scenario: Edit form defaults
- **WHEN** a form's `defaultValues` has an existing item for `photo` and the user submits without changes
- **THEN** the submitted data contains that same existing item

### Requirement: Avatar value and fallback
An avatar field SHALL hold one file item or `null`, with the same model as the file field: an existing item is the backend's data, and a new item is an image picked or edited in this session.

- **Stored photo:** an existing item MUST be shown through the `url` returned by `getFileInfo(data)`. A new image item MUST be shown through a preview URL that is released when the item leaves the value or the field unmounts.
- **Fallback:** without a photo, or when the photo's URL fails to load, the avatar MUST show the consumer's `fallback`. Without it, it shows the initials of `initialsFrom` (the first letter of the first and the last word, uppercased). Without either, it shows a decorative user icon.
- **Shape and size:** `shape` MUST be `circle` (the default) or `square`; `size` MUST be `sm`, `md`, `lg` (the default) or `xl`.
- **Choosing:** a circular icon button (a camera) sits on the avatar's bottom inline-end corner (bottom right, or bottom left in right-to-left pages), overlapping its edge. Without a photo it is named by `chooseLabel`, and with a photo by `changeLabel`. It opens the system picker, and picking an image replaces the photo.
- **File behaviour:** `accept` (`image/*` when omitted), the size limits, `onReject`, `rejectionMessage`, `capture`, `transform` and `upload` MUST behave as in the file field. While an upload is pending, the avatar MUST show a progress ring named by `uploadProgressLabel(name)` and exposing its value.

#### Scenario: Stored photo
- **WHEN** an `AvatarField` holds an existing item whose `getFileInfo` returns `url: "/users/7.jpg"`
- **THEN** the avatar shows that image

#### Scenario: Broken URL
- **WHEN** the stored photo's URL fails to load and `initialsFrom="Ada Lovelace"`
- **THEN** the avatar shows "AL"

#### Scenario: Picking a photo
- **WHEN** a user picks `me.png` in an empty `AvatarField`
- **THEN** the value is one new item with that file, and the avatar shows its preview

### Requirement: Avatar inspection dialog
With a photo, the avatar SHALL be a button named by `inspectLabel(name)` that opens a modal dialog titled `dialogTitle`.

- **Content:** the dialog MUST show the photo large, with the field's `shape`, and these actions:
  - close (`closeLabel`), which closes the dialog;
  - change (`changeLabel`), which opens the picker and replaces the photo;
  - edit (`editLabel`, with `editable`), which switches the dialog to the editor;
  - remove (`removeLabel`, with `removable`), which sets the value to `null` and closes the dialog;
  - open the original (`downloadLabel`, with `downloadable`), a link to the photo's URL (or to the new image's preview).
- **Dropping and pasting:** with `dropzone`, an image dropped on the large photo (whose area shows `dropzoneText`) replaces it. With `pasteable`, an image pasted while the dialog has focus replaces it.
- **Focus:** focus MUST stay inside the dialog while it is open. Escape MUST close it, and closing MUST return focus to the avatar button (or to the choose button when the photo was removed).
- **No fixed texts:** the dialog MUST NOT render any text that does not come from the props, including the close button's name.

#### Scenario: Inspecting a stored photo
- **WHEN** a user activates the avatar of a field holding a stored photo
- **THEN** a dialog named by `dialogTitle` opens with the photo large, focus moves into it, and pressing Escape closes it and returns focus to the avatar

#### Scenario: Removing the photo
- **WHEN** a user activates remove in the dialog of a `removable` field
- **THEN** the value is `null`, the dialog closes, the avatar shows the fallback, and focus is on the choose button

### Requirement: Avatar image editor
With `editable`, the dialog SHALL offer an editor for the current photo.

- **Crop area:** a square crop window over the image, with the field's `shape` as a visual mask, named by `cropAreaLabel`.
  - Dragging with the pointer (touch included) moves the image.
  - With focus on the area, the arrow keys move it and `+`/`-` zoom.
  - The image MUST always cover the window: moves and zooms are clamped.
- **Zoom:** a slider named by `zoomLabel`, from 1× to 4×.
- **Controls:**
  - rotate left and rotate right by 90° (`rotateLeftLabel`, `rotateRightLabel`);
  - flip horizontally and vertically (`flipHorizontalLabel`, `flipVerticalLabel`);
  - reset (`resetLabel`), which restores the initial framing;
  - cancel (`cancelLabel`), which returns to the inspection view without changes;
  - apply (`applyLabel`).
- **Applying:** applying MUST render the visible crop, with its rotation and flips, to a square image of at most `outputSize` pixels per side (512 by default), and never larger than the source pixels the crop covers, in `outputType` (`image/png` by default, or `image/jpeg` or `image/webp` with `outputQuality`). The result MUST become the value as a new item named after the original file, with the output type's extension, and pass through `transform` and `upload` when they are set.
- **Stored photos and CORS:** a stored photo MUST be loaded for editing with CORS. If the browser forbids reading its pixels, applying MUST NOT change the value. `onEditError(error)` MUST be called, and a development warning MUST explain that the server must allow CORS.

#### Scenario: Rotating and applying
- **WHEN** a user rotates right once a 400×200 image whose left half is red and right half is blue, and applies with `outputSize={128}`
- **THEN** the value is a new 128×128 PNG whose top rows are red and bottom rows are blue

#### Scenario: Keyboard cropping
- **WHEN** a user focuses the crop area of a zoomed image and presses ArrowLeft
- **THEN** the image moves left by one step, and never so far that the window shows outside the image

### Requirement: Avatar field texts
An avatar field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| always | `inspectLabel(name)`, `dialogTitle`, `closeLabel`, `getFileInfo` |
| editable value (without `readOnly`) | `chooseLabel`, `changeLabel` |
| `removable` | `removeLabel` |
| `downloadable` | `downloadLabel` |
| `editable` | `editLabel`, `cropAreaLabel`, `zoomLabel`, `rotateLeftLabel`, `rotateRightLabel`, `flipHorizontalLabel`, `flipVerticalLabel`, `resetLabel`, `applyLabel`, `cancelLabel` |
| `dropzone` | `dropzoneText` |
| `upload` | `uploadProgressLabel`, `cancelUploadLabel`, `retryUploadLabel`, `uploadErrorText` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Optional texts render nothing when they are omitted: `fallback`, `rejectionMessage`, `changedAnnouncement`, `removedAnnouncement` and `editedAnnouncement`.

#### Scenario: Editor without its texts
- **WHEN** a developer writes an `AvatarField` with `editable` and no `applyLabel`
- **THEN** TypeScript reports an error

### Requirement: Avatar field accessibility
- **Circular button on the avatar:** it MUST be the field's single native file input, presented as a circular icon button, as in the file field. It carries the field's accessible name (`chooseLabel` or `changeLabel`, then the field's label), description, `aria-required` and `aria-invalid`, and a visible focus ring. The change action inside the dialog is a regular button named `changeLabel` that opens the same picker.
- **Avatar button:** with a photo, the avatar MUST be a button named by `inspectLabel(name)`. The image inside it is decorative.
- **Dialog:** it MUST have `role="dialog"`, `aria-modal`, and the name `dialogTitle`. Every control in it MUST have a name from the props.
- **Announcements:** changes, removals, edits, rejections and upload failures MUST be announced through live regions with the developer's texts.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels. On small avatars the circular button may look smaller, but its target (including an invisible ring around it) MUST still be at least 24×24, and it MUST NOT cover more than a quarter of the avatar. Transitions MUST respect reduced motion. The layout MUST follow the page's direction, and in right-to-left pages ArrowLeft and ArrowRight in the crop area move the image in the visual direction of the arrow.

#### Scenario: Required avatar
- **WHEN** an empty `AvatarField` with `label="Foto"`, `required` and `chooseLabel="Subir foto"` renders
- **THEN** the file input's name is "Subir foto Foto" and it has `aria-required="true"`

### Requirement: Avatar field
`AvatarField` SHALL be exported from `@aureus-core/ui/components/avatar-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **Disabled or loading:** they MUST disable the circular button, the avatar button and every dialog action.
- **`ref`:** reaches the native file input.
- **`onBlur`:** called when focus leaves the field.
- **Native submission:** with `name`, a native form submission MUST include the new image.

#### Scenario: Disabled
- **WHEN** an `AvatarField` holding a photo is `disabled`
- **THEN** the avatar button and the circular change button are disabled

### Requirement: Avatar control bound to the form context
`AvatarControl` SHALL be exported from `@aureus-core/ui/components/avatar-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the item or `null`. A missing form value MUST behave as `null`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the circular button (the native file input).
- **Parity:** with the same props, the control MUST render the same markup as `AvatarField`.

#### Scenario: Required photo
- **WHEN** a form with `photo: z.custom((v) => v != null, "Sube una foto.")` is submitted without a photo
- **THEN** "Sube una foto." is shown below the field, and the file input has `aria-invalid="true"` and receives focus

#### Scenario: Edit form defaults
- **WHEN** the form's `defaultValues.photo` is a stored photo and the user submits without changes
- **THEN** the submitted data contains that same existing item

### Requirement: Read-only avatar
With `readOnly`, an avatar field SHALL only show the photo.

- **No changes:** it MUST render no circular button and no file input, and the dialog MUST offer no change, edit or remove action. Dropping and pasting MUST be ignored. The value MUST never change.
- **Viewing:** with a photo, the avatar MUST still be a button named by `inspectLabel(name)` that opens the dialog with the large photo, close and, with `downloadable`, the link to the original. Without a photo, the avatar MUST NOT be interactive.
- **Types:** `chooseLabel` and `changeLabel` MUST NOT be required, and the editing features (`editable`, `removable`, `dropzone`, `pasteable`, `upload`) MUST be rejected by the props' types.

#### Scenario: Viewing a profile
- **WHEN** a `readOnly` `AvatarField` holding a stored photo renders, and a user activates the avatar
- **THEN** the dialog shows the photo and a close button, and there is no file input and no change, edit or remove action

#### Scenario: Read-only without a photo
- **WHEN** a `readOnly` `AvatarField` without a photo renders with `initialsFrom="Ada Lovelace"`
- **THEN** it shows "AL", and nothing in it is focusable

### Requirement: Slider value
A slider field SHALL hold a `number`, or with `range` a pair `[low, high]` with two thumbs.

- **Limits:**
  - `min` defaults to 0 and `max` to 100;
  - `step` (1 by default) sets the precision, and every value MUST be a multiple of `step` from `min`;
  - `largeStep` (ten steps by default) is the PageUp/PageDown step.
- **Range:**
  - the pair MUST always be sorted: dragging a thumb past the other one makes it the other end of the range (the thumbs trade places);
  - with `minDistance`, the thumbs MUST stay at least that far apart, and a dragged thumb stops at that distance from the other one;
  - a controlled pair given out of order MUST be shown sorted.
- **Changes:** the field MUST work controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`). `onValueChange` MUST be called while a thumb moves, and `onValueCommit` once when a drag ends, when a key changes the value, or when a linked input commits.
- **Out-of-range values:** a value outside `[min, max]` given by the consumer MUST be shown clamped, and a development warning MUST name it.

#### Scenario: Dragging a range
- **WHEN** a user drags the thumb at 20 of a `range` slider at `[20, 80]` to 90
- **THEN** the value is `[80, 90]`; with `minDistance={10}` the thumb stops at 70 and the value is `[70, 80]`

#### Scenario: Commit once
- **WHEN** a user drags a thumb from 10 to 40 and releases it
- **THEN** `onValueChange` was called for intermediate values, and `onValueCommit` was called once with 40

### Requirement: Slider formatting
A slider field SHALL format every value it shows or announces with the same rule:

1. `formatValue(value)`, when given;
2. otherwise `Intl.NumberFormat(locale, formatOptions)`, where `locale` defaults to the browser's and `formatOptions` allows currency, percent and unit styles.

For a range, the combined text MUST use `formatRange` of the same formatter (for example "20 € – 80 €"). Without `formatValue`, numbers MUST never be shown in a hard-coded language.

#### Scenario: Currency range
- **WHEN** a `range` slider at `[200, 800]` has `locale="es-ES"` and `formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}`
- **THEN** each thumb's `aria-valuetext` is the formatted amount, and the header shows `Intl.NumberFormat("es-ES", …).formatRange(200, 800)`

### Requirement: Slider value display
`showValue` SHALL be `"none"` (the default), `"header"` or `"tooltip"`.

- **`header`:** the formatted value (or range) is shown at the end of the label row, and updates while the thumb moves.
- **`tooltip`:** the formatted value is shown above each thumb (beside it in vertical sliders) while the thumb is dragged, hovered or focused.

Both displays MUST be hidden from assistive technology, because each thumb's `aria-valuetext` already carries the value.

#### Scenario: Header value
- **WHEN** a slider with `label="Volumen"`, `showValue="header"` and `formatOptions={{ style: "percent" }}` and `max={1}`, `step={0.01}` is at 0.4
- **THEN** the label row ends with the formatted "40 %" (per locale), and it is not exposed to the accessibility tree

### Requirement: Slider marks
`marks` SHALL accept a list of `{ value, label? }`.

- **Track:** each mark MUST be drawn on the track at its value's position, and its optional label (the consumer's content) below it, or beside it in vertical sliders. Marks outside `[min, max]` are ignored.
- **Snapping (`snapToMarks`):** only mark values can be chosen.
  - Dragging snaps to the nearest mark.
  - The arrow keys move to the next or previous mark, and Home and End move to the first and last.
  - PageUp and PageDown move two marks.
- **Accessibility:** marks and their labels are decorative.

#### Scenario: Snapping with the keyboard
- **WHEN** a slider with `snapToMarks` and marks at 0, 25, 50, 75 and 100 is at 25 and the user presses ArrowRight
- **THEN** the value is 50

### Requirement: Slider linked input
With `withInput`, a slider field SHALL show a number input next to the track, or two for a range: the low value before the track and the high value after it in horizontal sliders.

- **Narrow containers:** under 24rem wide, the track MUST keep its own line and the inputs MUST wrap below it (the high or single input at the end), so the track never shrinks to an unusable width.

- **Display:** each input MUST show the current value of its thumb, with `locale`.
- **Committing:** typing and leaving the input, or pressing Enter, MUST commit the value. It is clamped to `[min, max]`, rounded to `step` (or snapped to the nearest mark with `snapToMarks`), and, in a range, kept in order and at `minDistance`.
- **Invalid input:** an empty or invalid entry MUST restore the current value.
- **Names:** the inputs MUST be named by `inputLabel` (single) or `inputLabels` (range).

#### Scenario: Typing an exact value
- **WHEN** a user types 47 in the input of a slider with `step={5}` and presses Enter
- **THEN** the value is 45 or 50 (the nearest step), and the thumb moves there

### Requirement: Slider orientation
`orientation="vertical"` SHALL lay the track out vertically, with low values at the bottom. Up and Right increase the value.

- **Height:** `height` (a CSS length, 12rem by default) sizes the track.
- **Right-to-left:** a horizontal slider in a right-to-left page MUST run from right to left. The linked inputs keep their digits left to right.

#### Scenario: Vertical slider
- **WHEN** a vertical slider from 0 to 100 is at 0
- **THEN** its thumb is at the bottom of the track, and ArrowUp increases the value

### Requirement: Slider field texts
A slider field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| single thumb | nothing: the thumb is named by `label`, `aria-label` or `aria-labelledby` (a warning when none is given) |
| `range` | `thumbLabels: [string, string]` |
| `withInput` | `inputLabel` (single) or `inputLabels: [string, string]` (range) |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Mark labels are optional content that renders nothing when omitted.

#### Scenario: Range without thumb names
- **WHEN** a developer writes `<SliderField label="Precio" range />` without `thumbLabels`
- **THEN** TypeScript reports an error

### Requirement: Slider field accessibility
- **Thumbs:** each thumb MUST be a `role="slider"` element with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and the formatted `aria-valuetext`, plus `aria-orientation="vertical"` in vertical sliders.
- **Names:**
  - a single thumb is named by the field's label;
  - in a range, each thumb is named by its `thumbLabels` entry, and the group by the label.
- **Description and state:** the thumbs MUST be described by the helper text and info, and carry `aria-required` and `aria-invalid`.
- **Keyboard:** arrows step, PageUp and PageDown use `largeStep`, and Home and End go to the limits.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels (44 on coarse pointers), and transitions MUST respect reduced motion.

#### Scenario: Named range thumbs
- **WHEN** a `range` slider with `label="Precio"` and `thumbLabels={["Precio mínimo", "Precio máximo"]}` renders
- **THEN** there is a group named "Precio" with two sliders named "Precio mínimo" and "Precio máximo"

### Requirement: Slider field
`SliderField` SHALL be exported from `@aureus-core/ui/components/slider-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **Disabled or loading:** they MUST disable the thumbs and the linked inputs.
- **`ref`:** reaches the first thumb.
- **`onBlur`:** called when focus leaves the field.
- **`name`:** a native form submission MUST include the value (both values for a range).

#### Scenario: Disabled
- **WHEN** a `SliderField` with `withInput` is `disabled`
- **THEN** its thumbs and its input are disabled

### Requirement: Slider control bound to the form context
`SliderControl` SHALL be exported from `@aureus-core/ui/components/slider-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the `number` or the pair. A missing form value MUST behave as `min` (or `[min, max]` for a range).
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first thumb.
- **Parity:** with the same props, the control MUST render the same markup as `SliderField`.

#### Scenario: Range validated by a schema
- **WHEN** a form with `price: z.tuple([z.number(), z.number()]).refine(([a, b]) => b - a >= 100, "El rango debe ser de al menos 100.")` is submitted with `[200, 250]`
- **THEN** the message is shown below the field, the thumbs have `aria-invalid="true"`, and the first thumb receives focus

### Requirement: Date and time values
A date or time field SHALL hold local ISO strings with no time zone:

| Value | Format | Example |
| --- | --- | --- |
| date | `YYYY-MM-DD` | `"2026-08-01"` |
| time | `HH:mm`, or `HH:mm:ss` with `granularity="second"` | `"14:30"`, `"14:30:15"` |
| date and time | `YYYY-MM-DDTHH:mm[:ss]` | `"2026-08-01T14:30"` |
| range | `{ from: date; to: date \| null }` | `{ from: "2026-08-01", to: "2026-08-27" }` |
| several days | a sorted `date[]` with no duplicates | `["2026-08-01", "2026-08-05"]` |

- **Incomplete input:**
  - a single value MUST be `null` while its input is empty or incomplete, and a value MUST be emitted only when it is complete and a real calendar date;
  - a range MUST be `null` without a start, and `{ from, to: null }` while only the start is complete.
- **Changes:** every field MUST work controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`).
  - An incomplete input MUST NOT be cleared because the controlled value is still `null`.
  - A new controlled value MUST replace what is shown.
- **Hours:** times MUST always use the 24-hour clock in the value, whatever the hour cycle shown.
- **Invalid values:** a controlled or default value that is not valid for the field's mode MUST be shown as empty, and a development warning MUST name it.

#### Scenario: Value only when complete
- **WHEN** a user types day and month in an empty date field with `locale="es-ES"` and has not typed the year
- **THEN** `onValueChange` has not been called with a date; after typing "2026" it is called once with `"2026-08-01"`

#### Scenario: Controlled reset
- **WHEN** a controlled date field showing `"2026-08-01"` receives `value={null}`
- **THEN** every segment is empty

### Requirement: Date segments
A date or time input SHALL be a group of editable segments: day, month, year, hour, minute, second and day period, as the mode needs.

- **Locale:**
  - the order, separators and numerals MUST follow `locale` (for example day/month/year in `es-ES`, month/day/year in `en-US`, year/month/day in `ja-JP`);
  - `locale` defaults to the browser's.
- **Empty segments:** an empty segment MUST show a placeholder made of dashes, never words.
- **Typing:**
  - digits fill the focused segment;
  - focus MUST move to the next segment once the segment is complete, or once no further digit could give a valid value (for example "4" in the month segment);
  - the day period is chosen by typing the first letter of the locale's own text for it;
  - Backspace and Delete clear the focused segment, and Backspace in an empty segment moves to the previous one.
- **Arrows:**
  - ArrowUp and ArrowDown change the focused segment by one step and wrap within it (for example December to January), without changing the other segments;
  - an empty segment starts at the current date's or time's part.
- **Moving between segments:**
  - ArrowLeft and ArrowRight move to the segment on that side;
  - Home and End go to the segment's lowest and highest values;
  - Tab leaves the group after the last segment.
- **Real dates:** a day beyond the length of the chosen month MUST be reduced to the month's last day once month and year are known (31 → 30 in April, 29 → 28 in February 2027).
- **Native forms:** with `name`, the field MUST submit its ISO value from a hidden input, or an empty string while it has none.
- **Narrow frames:** a long value MUST wrap between its date and its time instead of hiding segments; neither part is split across lines.

#### Scenario: Order per locale
- **WHEN** a date field renders with `locale="en-US"` and with `locale="es-ES"`
- **THEN** the segments read month, day, year in the first and day, month, year in the second, with the locale's separators

#### Scenario: Auto-advance
- **WHEN** a user focuses the month segment of an `es-ES` date field and types "4"
- **THEN** the month is April and focus is on the year segment

#### Scenario: February clamp
- **WHEN** a date field shows 31/01/2027 and the user presses ArrowUp in the month segment
- **THEN** it shows 28/02/2027 and emits `"2027-02-28"`

### Requirement: Localized calendar
The calendar of a date field SHALL show and announce only texts from `Intl` with the field's `locale`, or from the field's props.

- **`Intl` texts:**
  - the month caption, weekday names and day numbers;
  - each day's accessible name, which MUST be the full formatted date only.
- **States:**
  - today MUST be marked with `aria-current="date"`;
  - the chosen days MUST be marked with `aria-selected="true"`;
  - no English word ("Today", "selected", "Go to the Next Month") may appear in the calendar's text or accessible names.
- **Navigation:** the previous- and next-month buttons are named by `previousMonthLabel` and `nextMonthLabel`.
- **`weekStartsOn`:**
  - defaults to the locale's first day of the week;
  - falls back to Sunday when the browser cannot tell.
- **Opening month:** the calendar MUST open at the month of the chosen date (the start of a range, the first of several days). Without one, it opens at the current month, moved into `[min, max]` when that month is outside.
- **Keyboard and direction:** the day grid MUST be keyboard-navigable (arrows, PageUp/PageDown for months, Home/End for the week), and it follows the page's direction.

#### Scenario: Spanish calendar
- **WHEN** the calendar of a date field with `locale="es-ES"` opens in August 2026
- **THEN** the caption reads "agosto de 2026", the week starts on Monday, the 1 August button's name is the date formatted by `Intl.DateTimeFormat("es-ES", { dateStyle: "full" })`, and no English text is present

### Requirement: Calendar popover
A field with a calendar SHALL open it in a popover: from a button at the end of its segments, or, with several days, from the summary button itself.

- **Names:**
  - the button beside the segments is named by `openCalendarLabel`; both buttons expose `aria-haspopup="dialog"` and `aria-expanded`;
  - the popover is a dialog named by the field's label (or by `aria-label`/`aria-labelledby`).
- **Focus:** on opening, focus MUST move to the chosen day, or to today, or to the first enabled day.
- **Closing:**
  - Escape and a click outside close the popover, and focus returns to the button;
  - choosing a day closes it in date mode and when a range is complete;
  - with several days, it stays open until Escape or a click outside.
- **Date and time:** choosing a day in `"datetime"` mode sets the date part and keeps the time part. If the time is empty, focus moves to the first time segment.
- **Disabled and loading:** a disabled or loading field MUST NOT open the popover.

#### Scenario: Pick a day
- **WHEN** a user opens the calendar of an empty date field and presses Enter on 12 August 2026
- **THEN** the popover closes, the segments show that date, `"2026-08-12"` is emitted, and focus is on the calendar button

### Requirement: Time options
A field with a time SHALL support:

- **`hourCycle`:**
  - `12` shows hours 1–12 with a day period segment;
  - `24` shows 0–23;
  - it defaults to the locale's.
- **`granularity`:** `"minute"` (the default) or `"second"`. Only `"second"` shows a second segment and adds seconds to the value.
- **Steps:**
  - `minuteStep` and `secondStep` (1 by default) set how far ArrowUp and ArrowDown move those segments;
  - from a value off the step, an arrow moves to the next multiple of the step;
  - typed values are kept as typed.

#### Scenario: Twelve-hour input
- **WHEN** a time field with `hourCycle={12}` shows 2:30 PM and the user types "a" in the day period segment
- **THEN** it shows 2:30 AM and emits `"02:30"`

#### Scenario: Minute step
- **WHEN** a time field with `minuteStep={15}` shows 10:07 and the user presses ArrowUp in the minute segment
- **THEN** it shows 10:15

### Requirement: Date limits
A date field SHALL accept limits on the days and values that can be chosen:

- `min` and `max`, ISO values of the field's mode;
- `disabledDates`, a list of ISO dates;
- `isDateDisabled(date)`, called with each ISO date.

Their effect:

- **Calendar:** days outside `[min, max]`, listed or matched MUST be disabled and cannot be chosen, and the month buttons MUST NOT go to months with no day inside the limits.
- **Arrows:** a segment arrow that would complete a value outside `[min, max]` MUST stop at the nearest limit.
- **Typing:** typed values are emitted as typed, so a schema decides whether they are valid.
- **Times:** in `"datetime"` mode, a day that is only partly inside the limits stays enabled.

#### Scenario: Blocked weekends
- **WHEN** a date field has `isDateDisabled={(d) => [0, 6].includes(toDate(d).getDay())}` and its calendar is open
- **THEN** every Saturday and Sunday is disabled and cannot be chosen with the pointer or the keyboard

#### Scenario: Arrows stop at the limit
- **WHEN** a date field with `min="2026-08-10"` shows 10/08/2026 and the user presses ArrowDown in the day segment
- **THEN** the value stays `"2026-08-10"`

### Requirement: Date presets
A field with a calendar SHALL accept `presets`, a list of `{ label, value }`. Each `value` is a value of the field, or a function that returns one. A function MUST be called when the preset is chosen, and MAY also be called while the popover is open to mark the pressed preset, so relative presets stay current.

- **Placement:** the presets MUST be shown in the popover, beside the calendar (above it in narrow viewports), as buttons in a group named by `presetsLabel`.
- **Choosing a preset:** it sets the value, moves the calendar to it and closes the popover.
- **Pressed state:** a preset whose value equals the current value is marked `aria-pressed="true"`.
- **Time-only fields:** `mode="time"` MUST NOT accept presets.

#### Scenario: Range preset
- **WHEN** a user opens a range field with the preset `{ label: "Próximos 7 días", value: () => ({ from: todayIso(), to: addDaysIso(todayIso(), 6) }) }` and presses it
- **THEN** the value is the seven days from today, and the popover closes

### Requirement: Date range selection
`DateSelectionField` with `selection="range"` SHALL choose a start and an end day.

- **Input:** two groups of date segments, named by `startLabel` and `endLabel`, inside one frame with the calendar button.
- **Calendar:**
  - the first day chosen is the start (the value is `{ from, to: null }`), and the second is the end;
  - a second day before the start becomes the new start;
  - with a complete range, the next day starts a new range;
  - the days between start and end are shown as a band, and the hovered day previews the end.
- **Order:** the value MUST always have `from <= to`. A typed end before the start is emitted sorted, and the segments show the sorted range once focus leaves the field.
- **Length:** `minDays` and `maxDays` count both ends (1 to 27 August is 27 days).
  - In the calendar, ends that would break them MUST be disabled. The start itself and the days before it stay enabled, because choosing one starts the range again.
  - Typed ranges are emitted as typed.
- **Blocked days:** with `excludeDisabled`, a range MUST NOT contain a disabled day. Choosing an end beyond one starts a new range at that end.

#### Scenario: 1 to 27 August
- **WHEN** a user opens an empty range field and chooses 1 August 2026, then 27 August 2026
- **THEN** `onValueChange` is called with `{ from: "2026-08-01", to: null }`, then with `{ from: "2026-08-01", to: "2026-08-27" }`, and the popover closes

#### Scenario: Maximum length
- **WHEN** a range field with `maxDays={7}` has the start 1 August 2026 and its calendar is open
- **THEN** 8 August is enabled and 9 August is disabled

### Requirement: Multiple date selection
`DateSelectionField` with `selection="multiple"` SHALL choose any set of separate days.

- **Calendar:** choosing a day adds it, or removes it when it is already chosen. The value stays sorted.
- **Limit:** with `maxSelected`, once that many days are chosen the other days MUST be disabled until one is removed.
- **Input:** a button that opens the calendar and shows the summary of the chosen days:
  - by default, each date formatted with `Intl.DateTimeFormat(locale, { dateStyle: "medium" })`, joined by `Intl.ListFormat(locale)`;
  - `formatSummary(dates)` replaces that text;
  - with no days, it shows `placeholder` when given, and nothing otherwise.

  The button is named by the field's label and the summary.
- **Native forms:** with `name`, each day is submitted as `name[]`.

#### Scenario: Several days
- **WHEN** a user chooses 9, 1 and 5 August 2026 in a multiple field with `locale="es-ES"`
- **THEN** the value is `["2026-08-01", "2026-08-05", "2026-08-09"]` and the summary is the `Intl.ListFormat("es-ES")` list of the three formatted dates ("1 ago 2026, 5 ago 2026 y 9 ago 2026")

#### Scenario: Maximum count
- **WHEN** a multiple field with `maxSelected={2}` has two days chosen
- **THEN** every other day is disabled, and the chosen days can still be removed

### Requirement: Date field texts
The date and time fields SHALL ship no texts of their own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| every field | nothing: the input is named by `label`, `aria-label` or `aria-labelledby` (a warning when none is given) |
| a calendar (`DateTimeField` in `"date"` or `"datetime"` mode, every `DateSelectionField`) | `previousMonthLabel`, `nextMonthLabel` |
| a calendar button beside segments (`DateTimeField` with a calendar, `selection="range"`) | `openCalendarLabel` |
| `selection="range"` | `startLabel`, `endLabel` |
| `presets` | `presetsLabel` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Segment names, captions, weekdays, day names and the summary of several days MUST come from `Intl` with the field's `locale`. Preset labels and `placeholder` are the consumer's content.

#### Scenario: Calendar without texts
- **WHEN** a developer writes `<DateTimeField label="Fecha" />` without `openCalendarLabel`, `previousMonthLabel` and `nextMonthLabel`
- **THEN** TypeScript reports an error

#### Scenario: Time needs no calendar texts
- **WHEN** a developer writes `<DateTimeField label="Hora" mode="time" />`
- **THEN** TypeScript reports no error, and no warning is logged

### Requirement: Date field accessibility
- **Segments:**
  - each segment MUST be a `role="spinbutton"` with `aria-valuemin`, `aria-valuemax`, and an `aria-valuenow` and `aria-valuetext` in the locale (both absent while empty; the month's text is its name);
  - each segment is named by the segment's name from `Intl.DisplayNames(locale, { type: "dateTimeField" })` ("día", "mes", "año", "hora"…);
  - the segments of one value form a `role="group"` named by the field's label (by `startLabel` and `endLabel` in a range, inside a group named by the label).
- **Description and state:** each segment MUST be described by the helper text and info and carry `aria-required` and `aria-invalid` (ARIA does not allow `aria-required` on a group). The group MUST carry `aria-disabled` and `aria-busy` as the field's state.
- **Numerals and direction:** digits are shown in the locale's numbering system. The segments are laid out in the locale's order from left to right, as digits are, also in right-to-left pages, while the rest of the frame follows the page's direction.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels (44 on coarse pointers), and transitions MUST respect reduced motion.

#### Scenario: Named segments
- **WHEN** a date field with `label="Nacimiento"` and `locale="es-ES"` renders
- **THEN** there is a group named "Nacimiento" with three spinbuttons named "día", "mes" and "año"

### Requirement: Date time field
`DateTimeField` SHALL be exported from `@aureus-core/ui/components/date-time-field`, together with its public types and the date helpers.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **`mode`:** `"date"` (the default), `"time"` or `"datetime"`. Only modes with a date have a calendar.
- **Disabled:** the segments and the calendar button MUST be disabled, and the value is not submitted.
- **Loading:** the segments and the calendar button are disabled, and a spinner is shown at the inline end of the frame. The value is still submitted.
- **`ref`:** reaches the first segment.
- **`onBlur`:** called when focus leaves the field, including the popover. Moving into the popover is not leaving the field.

#### Scenario: Three modes
- **WHEN** a `DateTimeField` renders with `mode="date"`, `mode="time"` and `mode="datetime"`
- **THEN** the first shows date segments and a calendar button, the second only time segments, and the third date and time segments and a calendar button

### Requirement: Date selection field
`DateSelectionField` SHALL be exported from `@aureus-core/ui/components/date-selection-field`, together with its public types.

- **`selection`:** required, `"range"` or `"multiple"`. The value type follows it.
- **Shared props:** it supports the same shared props, limits, `locale`, `weekStartsOn` and `presets` as `DateTimeField`, with the same disabled and loading behaviour.
- **`ref`:** reaches the first segment of a range, or the button of several days.
- **`onBlur`:** called when focus leaves the field, including the popover.

#### Scenario: Disabled multiple field
- **WHEN** a `DateSelectionField` with `selection="multiple"` is `disabled`
- **THEN** its button is disabled and the calendar cannot be opened

### Requirement: Date time control bound to the form context
`DateTimeControl` SHALL be exported from `@aureus-core/ui/components/date-time-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the ISO string, or `null` while the input is empty or incomplete. A missing form value MUST behave as `null`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first segment.
- **Parity:** with the same props, the control MUST render the same markup as `DateTimeField`.

#### Scenario: Required meeting time
- **WHEN** a form with `meeting: z.string().refine(isIsoDateTime, "Elige fecha y hora.")` is submitted while the field has only a date
- **THEN** the message is shown below the field, the group has `aria-invalid="true"`, and the first segment receives focus

### Requirement: Date selection control bound to the form context
`DateSelectionControl` SHALL be exported from `@aureus-core/ui/components/date-selection-control`. It MUST take the same form props as `DateTimeControl`.

- **Stored value:** the form MUST store the range (or `null`), or the list of days. A missing form value MUST behave as `null` for a range and as `[]` for several days.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first segment of a range, or the button of several days.
- **Parity:** with the same props, the control MUST render the same markup as `DateSelectionField`.

#### Scenario: Range end missing
- **WHEN** a form with `stay: z.object({ from: z.string(), to: z.string().nullable() }).refine((r) => r.to !== null, "Elige la fecha de salida.")` is submitted with only the start chosen
- **THEN** the message is shown below the field and the start segments receive focus

### Requirement: Date helpers
`@aureus-core/ui/components/date-time-field` SHALL export pure helpers for the ISO values:

- **`toDate(iso)`:** a local `Date` for a date, time or date-and-time value (a time uses today's date), or `null` when the value is invalid.
- **`fromDate(date, mode, granularity?)`:** the ISO value of a `Date` in local time for `"date"`, `"time"` or `"datetime"`.
- **`todayIso()`:** today's local date.
- **`addDaysIso(date, days)`:** a date moved by calendar days, also across daylight-saving changes and month ends.
- **`isIsoDate`, `isIsoTime` and `isIsoDateTime`:** `true` only for well-formed values of real dates and times (with or without seconds).

No helper may use UTC conversions that change the local date.

#### Scenario: No time-zone drift
- **WHEN** `fromDate(toDate("2026-03-29"), "date")` runs in a time zone with a daylight-saving change on that day
- **THEN** the result is `"2026-03-29"`

#### Scenario: Invalid date
- **WHEN** `isIsoDate("2027-02-29")` is called
- **THEN** it returns `false`

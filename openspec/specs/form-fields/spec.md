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

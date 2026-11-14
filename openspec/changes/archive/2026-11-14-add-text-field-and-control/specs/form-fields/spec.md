## Purpose

Defines the shared look, behaviour and accessibility contract of every form field and form control in `@aureus-core/ui`, and the concrete text input components `TextField` and `TextControl` built on it.

## ADDED Requirements

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
A field or control SHALL accept an optional `action` that renders one button inside the input frame, at its inline-end side, sized so its height fits the frame. The action MUST accept text or an icon as content, an optional tooltip, and the usual button props (click handler, accessible name, variant, size, disabled, type). Its type MUST default to `button`, so it never submits a form by accident. The action MUST be disabled whenever the field is disabled or loading. Disabling only the action MUST NOT dim the rest of the field. An icon-only action without an accessible name MUST produce a development warning.

#### Scenario: Icon action with tooltip
- **WHEN** a `TextField` has `action={{ children: <CopyIcon />, "aria-label": "Copy", tooltip: "Copy to clipboard", onClick }}` and the user hovers then clicks the button
- **THEN** the tooltip "Copy to clipboard" is shown, `onClick` is called once, and no form is submitted

#### Scenario: Only the action is disabled
- **WHEN** a `TextField` is rendered with `action={{ children: "Apply", disabled: true }}` and is itself enabled
- **THEN** the button is disabled while the input and its frame keep their enabled appearance

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

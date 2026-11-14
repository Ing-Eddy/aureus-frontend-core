## MODIFIED Requirements

### Requirement: Integrated action button
Unless a field defines a fixed button of its own (the password visibility toggle), a field or control SHALL accept an optional `action` that renders one button inside the input frame, at its inline-end side, sized so its height fits the frame. A field with a fixed button MUST NOT accept `action`. The action MUST accept text or an icon as content, an optional tooltip, and the usual button props (click handler, accessible name, variant, size, disabled, type). Its type MUST default to `button`, so it never submits a form by accident. The action MUST be disabled whenever the field is disabled or loading. Disabling only the action MUST NOT dim the rest of the field. An icon-only action without an accessible name MUST produce a development warning.

#### Scenario: Icon action with tooltip
- **WHEN** a `TextField` has `action={{ children: <CopyIcon />, "aria-label": "Copy", tooltip: "Copy to clipboard", onClick }}` and the user hovers then clicks the button
- **THEN** the tooltip "Copy to clipboard" is shown, `onClick` is called once, and no form is submitted

#### Scenario: Only the action is disabled
- **WHEN** a `TextField` is rendered with `action={{ children: "Apply", disabled: true }}` and is itself enabled
- **THEN** the button is disabled while the input and its frame keep their enabled appearance

#### Scenario: Fixed button excludes action
- **WHEN** a `PasswordField` or `PasswordControl` is given an `action` prop
- **THEN** it is a type error, and the only button in the input frame is the visibility toggle

## ADDED Requirements

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

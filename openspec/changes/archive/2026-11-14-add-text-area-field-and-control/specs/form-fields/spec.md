## MODIFIED Requirements

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

## ADDED Requirements

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

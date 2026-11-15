## ADDED Requirements

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

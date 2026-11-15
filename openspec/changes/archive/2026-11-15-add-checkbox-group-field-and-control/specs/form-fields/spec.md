## ADDED Requirements

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

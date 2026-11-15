## ADDED Requirements

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

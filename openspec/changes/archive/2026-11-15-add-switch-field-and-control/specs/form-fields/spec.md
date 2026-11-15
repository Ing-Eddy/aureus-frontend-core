## ADDED Requirements

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

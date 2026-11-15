## ADDED Requirements

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

## Why

Verification codes (SMS or email codes, 2FA codes, PINs) are a common step in sign-up, sign-in and payment flows, and the form family has no field for them. shadcn's `InputOTP` (on `input-otp`, already a dependency) gives the boxes and the single hidden input, but not:

- the field layout (label, helper, error, loading);
- sanitising pasted codes;
- character sets;
- masking;
- a form binding.

Each screen would assemble those by hand, with inconsistent accessibility.

## What Changes

- **New `OtpField`** (`@aureus-core/ui/components/otp-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading (to show that the code is being verified), disabled, `classNames` and an optional `action`.
  - **`length`** (required) boxes over **one real input**, so SMS autofill (`autocomplete="one-time-code"`), pasting and screen readers work as with any input. The boxes are decorative.
  - **Value:** a `string`, with `onValueChange` and `onComplete(code)` when the last box is filled. `submitOnComplete` (opt-in) submits the surrounding form after `onComplete`.
  - **Opt-in extras.** Each is independent:
    - `charset` (`digits` by default, `alphanumeric`, `letters` or a custom pattern), which also sets the mobile keyboard;
    - `uppercase`;
    - `groups` (for example `[3, 3]`), with a decorative `separator`;
    - `masked` (dots instead of characters);
    - `reveal={{ showLabel, hideLabel }}` (both required by TypeScript): a show/hide toggle for masked codes;
    - `autoFocus`.
  - **Pasting:** pasted codes are cleaned (spaces and dashes removed, uppercase when asked) and trimmed to `length`.
  - **Right-to-left:** the code keeps a left-to-right order in RTL documents.
  - **No new default texts.**
- **New `OtpControl`** (`@aureus-core/ui/components/otp-control`): the field bound to the surrounding react-hook-form `FormProvider`, taking only `name` plus the field's props. The form holds the `string`, so `z.string().length(6)` works directly, and a failed submit focuses the input.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories, including an example of a "resend code" action with a countdown built in the story;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- A built-in resend button or countdown: the consumer composes them with `action`.
- Verification logic.
- Arbitrary per-box content.
- Changing the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the OTP field and control requirements:
  - value, length and completion;
  - character set and paste;
  - groups and separator;
  - masking and reveal;
  - accessibility;
  - field;
  - form-bound control.

## Impact

- **New public entry points:** `@aureus-core/ui/components/otp-field` and `@aureus-core/ui/components/otp-control`. These make 20 custom components.
- **No new runtime dependencies:** it uses `input-otp` (^1.5) and shadcn's `InputOTP` parts, wrapped and not edited.
- **Storybook:** new stories and docs under `apps/storybook/src/stories/components/forms/`, plus an update to the guide.
- **Release:** a `minor` changeset for `@aureus-core/ui`.

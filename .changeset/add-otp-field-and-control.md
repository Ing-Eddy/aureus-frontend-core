---
"@aureus-core/ui": minor
---

Add `OtpField` and `OtpControl`.

- `OtpField` (`@aureus-core/ui/components/otp-field`): a one-time code (OTP, PIN) field with the shared field layout, built on shadcn's Input OTP.
  - **`length` boxes over one real input.** SMS autofill (`autocomplete="one-time-code"`), pasting and screen readers work as with any input. The boxes are decorative and hidden from assistive technology.
  - **Value.** `value`, `defaultValue` and `onValueChange` as a `string`. `onComplete(code)` fires once each time the last box is filled. `submitOnComplete` (opt-in) submits the surrounding form.
  - **Pasting.** Pasted codes are cleaned (spaces and dashes removed) and trimmed to `length`.
  - **Opt-in extras.** Each is independent:
    - `charset` (`digits`, `letters`, `alphanumeric` or a custom pattern), which also sets the mobile keyboard;
    - `uppercase`;
    - `groups` with a decorative `separator`;
    - `masked` (dots, password input);
    - `reveal` (show/hide toggle; both texts required by TypeScript);
    - `autoFocus`.
  - **Family props:** loading (a spinner while verifying), disabled, error, helper, info and `action` (for example "Resend code").
  - **Right-to-left.** Codes keep a left-to-right order in RTL documents.
- `OtpControl` (`@aureus-core/ui/components/otp-control`): the same field bound to react-hook-form. The form holds the code as a `string`, so `z.string().length(6)` works directly.

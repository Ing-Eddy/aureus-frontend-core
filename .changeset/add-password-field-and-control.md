---
"@aureus-core/ui": minor
---

Add `PasswordField` and `PasswordControl`.

- `PasswordField` (`@aureus-core/ui/components/password-field`): the same label, required mark, info tooltip, helper text, error, loading and disabled states as `TextField`, with a built-in show/hide toggle instead of a configurable `action`. The toggle has `aria-pressed` and `aria-controls`, keeps focus and the caret in the input when clicked, and the password is hidden again when the form is submitted. Visibility can be controlled with `visible` / `onVisibleChange`, or set initially with `defaultVisible`. `autoComplete` defaults to `current-password`; spell-check, auto-correct and auto-capitalize are always off.
- `PasswordControl` (`@aureus-core/ui/components/password-control`): the same input bound to react-hook-form. Render it inside a `FormProvider` and give it a `name`; the schema's validation message (for example a password-confirmation mismatch) is shown as helper text.
- `TextField` now shares its internal view with `PasswordField`. Its API and markup are unchanged.

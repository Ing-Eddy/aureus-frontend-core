---
"@aureus-core/ui": minor
---

Add `TextAreaField` and `TextAreaControl`.

- `TextAreaField` (`@aureus-core/ui/components/text-area-field`): a multi-line field with the same label, required mark, info tooltip, helper text, error, loading, disabled and `classNames` as every field.
  - It grows with its content between `minRows` (default 3) and `maxRows` (default 10, then it scrolls), in every browser.
  - Users can drag it to resize it, and the height they choose becomes the new minimum; `resize={false}` removes the handle.
  - The optional `action`, the loading spinner and an optional character counter (`showCount`, with `maxLength`) live in a footer bar attached to the bottom edge, so the button follows the field's height and never covers the text.
  - `actionShortcut` lets Ctrl+Enter / Cmd+Enter press the action.
  - The counter is announced to screen readers only after the user pauses typing.
- `TextAreaControl` (`@aureus-core/ui/components/text-area-control`): the same field bound to react-hook-form. Render it inside a `FormProvider` with a `name`; the schema's message is shown as helper text, and the counter follows the form value.
- `FieldClassNames` gains a `footer` slot, used by multi-line fields.

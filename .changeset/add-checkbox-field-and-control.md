---
"@aureus-core/ui": minor
---

Add `CheckboxField` and `CheckboxControl`.

- `CheckboxField` (`@aureus-core/ui/components/checkbox-field`): a checkbox with the shared field layout, built on shadcn's Checkbox.
  - **Two texts.** `label` sits above, as in every field. `checkboxLabel` sits beside the box: it is clickable, and links inside it navigate without toggling. With both, `label` names the group and `checkboxLabel` names the box. Neither has a default.
  - **Value.** `value`, `defaultValue` and `onValueChange`, a `boolean` by default. `checkedValue` and `uncheckedValue` (both or neither, enforced by TypeScript) store custom values such as `"S"`/`"N"` or `1`/`0`; the type is inferred from them.
  - **Opt-in extras.** Each is independent and none changes another's default:
    - `indeterminate`, a visual mixed state;
    - `checkboxPosition="end"`;
    - `appearance="card"`, a clickable card highlighted when checked.
  - **Family props:** required mark, info, helper text, error, loading (with a spinner), disabled, `action` and `classNames` (`checkbox`, `checkboxLabel`, `row`).
  - **Accessibility.** A `checkbox` with exactly one accessible name. Space toggles it and Enter does not. A development warning is emitted when there is no name.
- `CheckboxControl` (`@aureus-core/ui/components/checkbox-control`): the same field bound to react-hook-form. The form holds a `boolean` or the custom values, so `z.boolean()`, `z.literal(true)` and `z.enum([...])` schemas work directly.
- Internal: the shared field shell can render its label without associating it with the control and can name its group with it. Existing fields are unchanged.

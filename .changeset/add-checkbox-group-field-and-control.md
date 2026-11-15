---
"@aureus-core/ui": minor
---

Add `CheckboxGroupField` and `CheckboxGroupControl`.

- `CheckboxGroupField` (`@aureus-core/ui/components/checkbox-group-field`): several checkboxes holding a `string[]`, with the shared field layout.
  - **Options.** `{ value, label, description?, disabled? }`. The label is a `ReactNode`; links in it navigate without toggling.
  - **Value.** `value`, `defaultValue` and `onValueChange`, always in the order of `options`. Values that match no option are kept, with a development warning.
  - **Opt-in extras.** Each is independent:
    - `selectAll` (its `label` is required by TypeScript), with a mixed state, respecting disabled options and the limit;
    - `maxSelected`, with an optional `maxSelectedMessage` in a status region;
    - `orientation="horizontal"`;
    - `columns` (2–4, collapsing with container queries);
    - `appearance="card"`;
    - `checkboxPosition="end"`.
  - **Accessibility.**
    - A `group` named by `label` and described by the helper text and info, with `aria-busy` and `aria-disabled`.
    - Each box is named and described by its option.
    - `required` marks the label without setting `aria-required` on every box.
    - A development warning is emitted when the group has no name.
- `CheckboxGroupControl` (`@aureus-core/ui/components/checkbox-group-control`): the same field bound to react-hook-form. The form holds a `string[]`, and a failed submit focuses the first enabled box.
- Internal: the checkbox row moves to the shared internals and gains an optional description line, and the field shell accepts root ARIA attributes and a header slot. Existing fields are unchanged.

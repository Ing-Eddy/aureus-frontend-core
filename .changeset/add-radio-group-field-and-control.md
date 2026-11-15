---
"@aureus-core/ui": minor
---

Add `RadioGroupField` and `RadioGroupControl`.

- `RadioGroupField` (`@aureus-core/ui/components/radio-group-field`): a group of radios with the shared field layout, built on shadcn's Radio Group. Exactly one option can be chosen.
  - **Options.** `{ value, label, description?, disabled? }`. The label is a `ReactNode`; links in it navigate without choosing.
  - **Value.** `value`, `defaultValue` and `onValueChange` with `string | null`, which stays `null` until something is chosen. A value that matches no option checks nothing and is kept, with a development warning.
  - **Keyboard.** The WAI-ARIA radio group pattern: one tab stop, and the arrow keys move and select, skipping disabled options and wrapping around. The arrow axis follows `orientation`.
  - **Opt-in extras.** Each is independent:
    - `orientation="horizontal"`;
    - `columns` (2–4, collapsing with container queries);
    - `appearance="card"`;
    - `appearance="segmented"` (it follows `orientation` like every layout: pass `orientation="horizontal"` for side-by-side segments);
    - `radioPosition="end"`;
    - `otherOption` (`{ label, inputLabel, placeholder? }`, with its texts required by TypeScript), a free-text answer that becomes the value;
    - `deselectable`.
  - **Accessibility.**
    - A `radiogroup` named by `label`, described by the helper text and info, with `aria-required`, `aria-invalid`, `aria-busy` and `aria-disabled`.
    - Each radio is named and described by its option.
    - A development warning is emitted when the group has no name.
- `RadioGroupControl` (`@aureus-core/ui/components/radio-group-control`): the same field bound to react-hook-form. The form holds `string | null`, and a failed submit focuses the checked radio, or the first enabled one.
- **Internal:** the checkbox row becomes a shared choice row, keeping the checkbox `data-slot` names, and only interactive elements inside the row stop its click forwarding. Existing components are unchanged.

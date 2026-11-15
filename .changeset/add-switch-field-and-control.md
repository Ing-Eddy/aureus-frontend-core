---
"@aureus-core/ui": minor
---

Add `SwitchField` and `SwitchControl`.

- `SwitchField` (`@aureus-core/ui/components/switch-field`): an on/off switch with the shared field layout, for settings that apply immediately.
  - **Two texts.** `label` sits above, as in every field; `switchLabel` sits beside the switch. The text is clickable, and links in it navigate without toggling.
  - **Value.** `value`, `defaultValue` and `onValueChange`, a `boolean` by default. `checkedValue`/`uncheckedValue` (both or neither, inferred) store custom values.
  - **`onBeforeChange(next)`** confirms each change. While a returned promise is pending, the switch stays put, shows a spinner in the thumb, sets `aria-busy` and ignores toggles, keeping focus. It changes only when the result is `true`.
  - **`loading`** shows the spinner in the thumb too.
  - **Opt-in extras.** Each is independent:
    - `switchPosition="end"`;
    - `appearance="card"`;
    - `size="sm"`;
    - `stateLabels` and `thumbIcons` (decorative; both entries required by TypeScript).
  - **Accessibility.**
    - A `switch` with `aria-checked` and exactly one accessible name.
    - Space and Enter toggle it.
    - The thumb moves the correct way in RTL.
    - A development warning is emitted when there is no name.
- `SwitchControl` (`@aureus-core/ui/components/switch-control`): the same field bound to react-hook-form. The form holds a `boolean` or the custom values; with `onBeforeChange`, only confirmed changes are stored.
- **Internal:** the checkbox value hook and value types move to the shared internals, and the shared choice row gains a switch slot and a switch with a customisable thumb. Existing components are unchanged.

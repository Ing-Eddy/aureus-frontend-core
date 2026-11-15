---
"@aureus-core/ui": minor
---

Add `NumberField` and `NumberControl`.

- `NumberField` (`@aureus-core/ui/components/number-field`): a number input with the shared field layout. Its value is `number | null`, reported with `onValueChange`.
  - **Formatting.** Every option is an independent, opt-in prop, and none changes another one's default. Without them the field shows digits as typed.
    - `locale` sets the separators;
    - `grouping` turns thousands separators on or off;
    - `decimals` caps the decimals, and `padDecimals` pads them with zeros;
    - `currency` only adds the symbol;
    - `prefix`, `suffix` and `align`;
    - `negativeFormat` (`minus` or `parentheses`) and `negativeColor`.
  - **Live formatting.** Separators appear while typing and the caret keeps its place. Stepping and rounding are exact.
  - **Custom step buttons.** `stepper` shows or hides them, and `stepperLayout` is `stacked` or `split`. Stacked switches to split on touch screens, so every target is at least 24×24 px. Press-and-hold repeats the step.
  - **Keyboard.** Arrows, Shift, Page Up/Down, Home/End, Enter commits and Escape reverts. Formatted amounts can be pasted.
  - **Opt-in conveniences.** `selectOnFocus`, `wheel`, `shorthand` (1.5k) and `expressions` (`=120*3`). An expression is remembered while the field is mounted and shown again on focus.
  - **Accessibility.** The input is a `spinbutton` with a readable `aria-valuetext`.
- `NumberControl` (`@aureus-core/ui/components/number-control`): the same field bound to react-hook-form. The form receives `number | null`, so `z.number()` schemas work directly.

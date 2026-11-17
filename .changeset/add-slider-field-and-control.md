---
"@aureus-core/ui": minor
---

Add `SliderField` and `SliderControl`.

- `SliderField` (`@aureus-core/ui/components/slider-field`): a slider with the shared field layout.
  - **Value.** A `number`, or with `range` a sorted `[low, high]` pair with two thumbs. `min`, `max`, `step` and `largeStep`; `minDistance` keeps a range's thumbs apart (a dragged thumb stops at it; without it, a thumb dragged past the other one becomes the other end). Values are always shown normalized: clamped, on the step grid and sorted. `onValueChange` follows the thumb; `onValueCommit` runs once when a drag ends, a key changes the value or an input commits.
  - **Formatting.** `locale` with `formatOptions` (currency, percent, unit), or `formatValue`, formats every shown value and each thumb's `aria-valuetext`. A range in the header uses `formatRange`.
  - **Opt-in extras, each independent.** `showValue` (`"header"` or `"tooltip"`), `marks` with optional labels, `snapToMarks`, `withInput` (one or two number inputs that commit on Enter or blur) and `orientation="vertical"` with `height`.
  - **Keyboard.** Every slider key follows the props: arrows step (or move by marks), Page Up / Page Down and Shift + arrows use `largeStep`, Home and End go to the limits. With the keyboard a thumb never passes the other one. Right-to-left pages are followed.
  - **No default texts.** A single thumb is named by the label; `range` requires `thumbLabels`, and `withInput` requires `inputLabel` (or `inputLabels` with `range`). Radix's English fallback names for range thumbs are never used.
- `SliderControl` (`@aureus-core/ui/components/slider-control`): the same field bound to react-hook-form. The form holds the `number` or the pair; a missing value behaves as `min` (or `[min, max]`).
- Internal: a shared `SliderBase` (the Radix slider with shadcn's look and named thumbs). The avatar editor's zoom slider uses it, with the same markup.

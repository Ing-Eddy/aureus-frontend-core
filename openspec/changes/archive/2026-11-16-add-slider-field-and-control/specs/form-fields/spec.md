## ADDED Requirements

### Requirement: Slider value
A slider field SHALL hold a `number`, or with `range` a pair `[low, high]` with two thumbs.

- **Limits:**
  - `min` defaults to 0 and `max` to 100;
  - `step` (1 by default) sets the precision, and every value MUST be a multiple of `step` from `min`;
  - `largeStep` (ten steps by default) is the PageUp/PageDown step.
- **Range:**
  - the pair MUST always be sorted: dragging a thumb past the other one makes it the other end of the range (the thumbs trade places);
  - with `minDistance`, the thumbs MUST stay at least that far apart, and a dragged thumb stops at that distance from the other one;
  - a controlled pair given out of order MUST be shown sorted.
- **Changes:** the field MUST work controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`). `onValueChange` MUST be called while a thumb moves, and `onValueCommit` once when a drag ends, when a key changes the value, or when a linked input commits.
- **Out-of-range values:** a value outside `[min, max]` given by the consumer MUST be shown clamped, and a development warning MUST name it.

#### Scenario: Dragging a range
- **WHEN** a user drags the thumb at 20 of a `range` slider at `[20, 80]` to 90
- **THEN** the value is `[80, 90]`; with `minDistance={10}` the thumb stops at 70 and the value is `[70, 80]`

#### Scenario: Commit once
- **WHEN** a user drags a thumb from 10 to 40 and releases it
- **THEN** `onValueChange` was called for intermediate values, and `onValueCommit` was called once with 40

### Requirement: Slider formatting
A slider field SHALL format every value it shows or announces with the same rule:

1. `formatValue(value)`, when given;
2. otherwise `Intl.NumberFormat(locale, formatOptions)`, where `locale` defaults to the browser's and `formatOptions` allows currency, percent and unit styles.

For a range, the combined text MUST use `formatRange` of the same formatter (for example "20 € – 80 €"). Without `formatValue`, numbers MUST never be shown in a hard-coded language.

#### Scenario: Currency range
- **WHEN** a `range` slider at `[200, 800]` has `locale="es-ES"` and `formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}`
- **THEN** each thumb's `aria-valuetext` is the formatted amount, and the header shows `Intl.NumberFormat("es-ES", …).formatRange(200, 800)`

### Requirement: Slider value display
`showValue` SHALL be `"none"` (the default), `"header"` or `"tooltip"`.

- **`header`:** the formatted value (or range) is shown at the end of the label row, and updates while the thumb moves.
- **`tooltip`:** the formatted value is shown above each thumb (beside it in vertical sliders) while the thumb is dragged, hovered or focused.

Both displays MUST be hidden from assistive technology, because each thumb's `aria-valuetext` already carries the value.

#### Scenario: Header value
- **WHEN** a slider with `label="Volumen"`, `showValue="header"` and `formatOptions={{ style: "percent" }}` and `max={1}`, `step={0.01}` is at 0.4
- **THEN** the label row ends with the formatted "40 %" (per locale), and it is not exposed to the accessibility tree

### Requirement: Slider marks
`marks` SHALL accept a list of `{ value, label? }`.

- **Track:** each mark MUST be drawn on the track at its value's position, and its optional label (the consumer's content) below it, or beside it in vertical sliders. Marks outside `[min, max]` are ignored.
- **Snapping (`snapToMarks`):** only mark values can be chosen.
  - Dragging snaps to the nearest mark.
  - The arrow keys move to the next or previous mark, and Home and End move to the first and last.
  - PageUp and PageDown move two marks.
- **Accessibility:** marks and their labels are decorative.

#### Scenario: Snapping with the keyboard
- **WHEN** a slider with `snapToMarks` and marks at 0, 25, 50, 75 and 100 is at 25 and the user presses ArrowRight
- **THEN** the value is 50

### Requirement: Slider linked input
With `withInput`, a slider field SHALL show a number input next to the track, or two for a range: the low value before the track and the high value after it in horizontal sliders.

- **Narrow containers:** under 24rem wide, the track MUST keep its own line and the inputs MUST wrap below it (the high or single input at the end), so the track never shrinks to an unusable width.

- **Display:** each input MUST show the current value of its thumb, with `locale`.
- **Committing:** typing and leaving the input, or pressing Enter, MUST commit the value. It is clamped to `[min, max]`, rounded to `step` (or snapped to the nearest mark with `snapToMarks`), and, in a range, kept in order and at `minDistance`.
- **Invalid input:** an empty or invalid entry MUST restore the current value.
- **Names:** the inputs MUST be named by `inputLabel` (single) or `inputLabels` (range).

#### Scenario: Typing an exact value
- **WHEN** a user types 47 in the input of a slider with `step={5}` and presses Enter
- **THEN** the value is 45 or 50 (the nearest step), and the thumb moves there

### Requirement: Slider orientation
`orientation="vertical"` SHALL lay the track out vertically, with low values at the bottom. Up and Right increase the value.

- **Height:** `height` (a CSS length, 12rem by default) sizes the track.
- **Right-to-left:** a horizontal slider in a right-to-left page MUST run from right to left. The linked inputs keep their digits left to right.

#### Scenario: Vertical slider
- **WHEN** a vertical slider from 0 to 100 is at 0
- **THEN** its thumb is at the bottom of the track, and ArrowUp increases the value

### Requirement: Slider field texts
A slider field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| single thumb | nothing: the thumb is named by `label`, `aria-label` or `aria-labelledby` (a warning when none is given) |
| `range` | `thumbLabels: [string, string]` |
| `withInput` | `inputLabel` (single) or `inputLabels: [string, string]` (range) |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Mark labels are optional content that renders nothing when omitted.

#### Scenario: Range without thumb names
- **WHEN** a developer writes `<SliderField label="Precio" range />` without `thumbLabels`
- **THEN** TypeScript reports an error

### Requirement: Slider field accessibility
- **Thumbs:** each thumb MUST be a `role="slider"` element with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and the formatted `aria-valuetext`, plus `aria-orientation="vertical"` in vertical sliders.
- **Names:**
  - a single thumb is named by the field's label;
  - in a range, each thumb is named by its `thumbLabels` entry, and the group by the label.
- **Description and state:** the thumbs MUST be described by the helper text and info, and carry `aria-required` and `aria-invalid`.
- **Keyboard:** arrows step, PageUp and PageDown use `largeStep`, and Home and End go to the limits.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels (44 on coarse pointers), and transitions MUST respect reduced motion.

#### Scenario: Named range thumbs
- **WHEN** a `range` slider with `label="Precio"` and `thumbLabels={["Precio mínimo", "Precio máximo"]}` renders
- **THEN** there is a group named "Precio" with two sliders named "Precio mínimo" and "Precio máximo"

### Requirement: Slider field
`SliderField` SHALL be exported from `@aureus-core/ui/components/slider-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **Disabled or loading:** they MUST disable the thumbs and the linked inputs.
- **`ref`:** reaches the first thumb.
- **`onBlur`:** called when focus leaves the field.
- **`name`:** a native form submission MUST include the value (both values for a range).

#### Scenario: Disabled
- **WHEN** a `SliderField` with `withInput` is `disabled`
- **THEN** its thumbs and its input are disabled

### Requirement: Slider control bound to the form context
`SliderControl` SHALL be exported from `@aureus-core/ui/components/slider-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the `number` or the pair. A missing form value MUST behave as `min` (or `[min, max]` for a range).
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first thumb.
- **Parity:** with the same props, the control MUST render the same markup as `SliderField`.

#### Scenario: Range validated by a schema
- **WHEN** a form with `price: z.tuple([z.number(), z.number()]).refine(([a, b]) => b - a >= 100, "El rango debe ser de al menos 100.")` is submitted with `[200, 250]`
- **THEN** the message is shown below the field, the thumbs have `aria-invalid="true"`, and the first thumb receives focus

## Context

See proposal.md (Why) for the motivation and specs/form-fields/spec.md for the requirements. Facts that shape the approach:

- **Radix slider (`radix-ui` 1.6.1)**, the primitive under shadcn's `Slider`:
  - one `Thumb` per value;
  - the values stay sorted: a thumb dragged past the other one becomes the other end, and with `minStepsBetweenThumbs > 0` it stops at that distance instead;
  - `minStepsBetweenThumbs` is counted in steps;
  - `orientation`, `inverted` and `dir`;
  - `onValueCommit` on pointer up and on its own key handling;
  - a hidden input per thumb for native forms, named `name` with one thumb and `name[]` with two.
- **Radix keyboard:**
  - PageUp/PageDown (and Shift+arrows) always move **10 steps**;
  - keys only move along `step`, with no snapping to arbitrary values;
  - the root's `onKeyDown` is composed with `composeEventHandlers`, so calling `preventDefault()` there skips Radix's handling.
- **Thumb position:** Radix shifts each thumb by an in-bounds offset, `(half thumb) − percent × (thumb)`, so the thumb never overflows the track ends. Anything drawn at a value's position (marks) must apply the same offset to line up.
- **`ZoomSlider`** (`components/avatar-field/components/zoom-slider.tsx`) already renders the primitive with shadcn's classes and a named thumb.
- **`FieldShell`** has `labelFor={false}`, `labelledByRoot`, `rootAria` and `headerEnd` (content at the end of the label row).
- **`useInheritedDirection`** resolves the computed `dir` for components that need it in JavaScript.
- **`NumberField`** keeps its own text while focused and only reformats from `value` on focus and commit.

## Goals / Non-Goals

**Goals:**
- One internal slider primitive for the avatar zoom and the new field.
- Keyboard behaviour that follows the props (`largeStep`, `snapToMarks`) instead of Radix's fixed rules.
- Marks and the tooltip that line up with the thumb exactly at every value, in both orientations and in RTL.
- A typed value that follows `range` (`number` vs `[number, number]`), through field and control.

**Non-Goals:**
- Vertical sliders with right-to-left semantics (vertical ignores `dir`).
- A "push" mode where one thumb drags the other along: Radix's trade-places behaviour is kept.
- Accepting a list of steps as `step` (marks with `snapToMarks` cover non-uniform values).

## Decisions

### 1. `SliderBase` in `internal/components/slider-base`

`SliderBase` is a thin wrapper of `SliderPrimitive.Root`/`Track`/`Range`/`Thumb` with shadcn's classes.

- **Props:**
  - `values: number[]`;
  - `thumbs: { "aria-label"?; "aria-labelledby"?; "aria-describedby"?; "aria-valuetext"; ref? }[]`;
  - `orientation`, `dir`, `min`, `max`, `step`, `minStepsBetweenThumbs` and `disabled`;
  - `name`, `onValueChange`, `onValueCommit` and `onKeyDown`;
  - `thumbChildren(index)`, for the tooltip;
  - `trackChildren`, for the marks;
  - `className` and `classNames`.
- **Thumb size** is exposed as the CSS variable `--slider-thumb` (0.75rem, or 1.25rem on coarse pointers). Marks use the same variable for the in-bounds offset (decision 5).
- **Hit area:** each thumb has an `::after` ring that reaches 24 px (44 px on coarse pointers).
- **Zoom slider:** `ZoomSlider` becomes a two-line use of `SliderBase` with the same markup. Its stories (Edit, Keyboard) are the regression check.

**Alternatives considered:**
- **Patching shadcn's `slider.tsx`:** rejected, because generated shadcn files are not edited.
- **A slider from scratch:** rejected, because it would duplicate pointer capture, RTL and form inputs that Radix already gets right.

### 2. Keyboard handled by the field, not by Radix

The field passes `onKeyDown` to `SliderBase` (on the root). For every slider key it calls `preventDefault()`, computes the next values with the pure `keyboardValues` (`utils/slider-keys.ts`), and calls both `onValueChange` and `onValueCommit`:

- arrows: one `step`, or the next or previous mark with `snapToMarks`;
- PageUp/PageDown and Shift+arrows: `largeStep`, or two marks with `snapToMarks`;
- Home/End: the lowest and highest value the focused thumb can take.

Handling every key (not only the ones whose rules differ from Radix's) keeps one rule for all of them:
- with the keyboard a thumb never passes the other one or comes closer than `minDistance`;
- Home and End stay on the step grid when `max` is not on it;
- Radix's Home always moves the first thumb, even when the second one has focus.

Other keys reach the browser untouched.

- **Focused thumb:** each thumb carries `data-thumb-index`, read from `event.target`.
- **Direction:** follows Radix's semantics. Right/Up increase, flipped for Right/Left in RTL horizontal sliders. The computed `dir` comes from `useInheritedDirection`.

**Alternatives considered:**
- Setting Radix `step` to the gcd of the marks: rejected, because non-uniform marks would leave stops between marks.
- Intercepting only PageUp/PageDown and the mark keys: rejected, because of the inconsistencies above.

### 3. Snapping and ordering are pure functions in `utils/snap.ts`

| Function | What it does |
|---|---|
| `clamp(value, min, max)` | Keeps a value within the limits |
| `roundToStep(value, min, step)` | Rounds with decimal-safe arithmetic, using the step's fraction digits |
| `nearestMark(value, marks)` | Returns the closest mark value |
| `neighbourMark(value, marks, delta)` | Returns the mark `delta` positions away |
| `normalizeValues(values, {min, max, step, minDistance, marks?}, changedIndex?)` | Sorts the pair, clamps and snaps it, and enforces `minDistance` by moving the value that changed |

- **Every value passes through them:** consumer values, drag values, keyboard values and typed values. One rule covers all paths.
- **Snapping while dragging:** with `snapToMarks`, the Radix `step` stays the field's `step` and each drag value is snapped to the nearest mark, so dragging feels continuous but lands on marks.
- **`minDistance`:** becomes `minStepsBetweenThumbs = ceil(minDistance / step)` plus `preserveThumbOrder` for Radix (without it, Radix lets a thumb jump past the other one once the jump is longer than the distance), and is also enforced by `normalizeValues` for typed and controlled values. Linked inputs stop a typed value at the other thumb, as the keyboard does.

### 4. Value state and typing

`useSliderValue` builds on `useControllableState` with the internal value always as an array, so one code path covers both modes. The field maps it to `number` or a pair at the edges.

**Public types:**

```ts
type SliderFieldProps =
  | (SliderSingleProps & …)  // range?: false; value?: number; onValueChange?: (v: number) => void
  | (SliderRangeProps & …);  // range: true;  value?: [number, number]; thumbLabels: [string, string]
```

Function overloads (as in `SelectField` with `multiple`) give the right callback types to inline handlers.

**Out-of-range values:** a consumer value outside the limits is shown normalized, and `useSliderWarnings` warns once per distinct bad value.

### 5. Marks are positioned with Radix's in-bounds offset

`SliderMarks` renders inside the track container (as a sibling of `Track`, so it is not clipped by `overflow-hidden`). Each mark is placed at:

```
inset-inline-start: calc(p% + var(--slider-thumb) / 2 - p / 100 * var(--slider-thumb))
```

In vertical sliders the same calc uses `bottom`.

- **Labels:** a list below the track (beside it in vertical sliders), translated −50% so they are centred on the mark. The first and last labels align to their edge instead, so they do not overflow the field.
- **Accessibility:** the whole layer is `aria-hidden`.
- **Out-of-range marks** are dropped, and duplicates keep the first one.

**Alternative considered:** measuring the thumb in JavaScript. Rejected, because a CSS variable shared with the thumb keeps them in sync with no layout reads.

### 6. Tooltip is a span inside the thumb

`SliderValueTooltip` is rendered as a child of each `Thumb`.

- **Position:** `absolute`, above the thumb (at the inline end in vertical sliders).
- **Accessibility:** `aria-hidden`.
- **Visibility:** shown on `:hover`, on `:focus-visible` and while the root has `data-dragging`. The field sets `data-dragging` on pointer down and clears it on `onValueCommit` or on `pointerup`/`pointercancel` on the window.
- **Motion:** opacity transitions with `motion-reduce:transition-none`.

**Alternative considered:** shadcn's `Tooltip`. Rejected for three reasons:
- it portals and is positioned by the floating layer, so it lags behind the thumb while dragging;
- it adds `aria-describedby`, which duplicates `aria-valuetext`;
- it opens with a delay.

### 7. One formatter for every text

`utils/format-slider-value.ts` builds a memoized `Intl.NumberFormat(locale, formatOptions)` and returns:
- `format(n)`;
- `formatRange(a, b)`, which uses `formatter.formatRange` and falls back to `format(a) – format(b)` when the method is missing.

When given, `formatValue` replaces `format`, and its range text is `formatValue(a) – formatValue(b)`. The same functions feed:
- `aria-valuetext`;
- the header value;
- the tooltip.

The linked inputs show digits only (locale symbols, no grouping), so currency symbols are never typed.

### 8. Linked inputs are a small spinbutton of the field

`SliderInput` (`components/slider-input.tsx`) is shadcn's `Input` with `role="spinbutton"`, one per thumb:

- `aria-label` set to `inputLabel` or `inputLabels[i]`;
- `aria-valuenow`/`min`/`max`, and the formatted `aria-valuetext`;
- `inputMode` (`numeric`, or `decimal` for fractions and negatives), `dir="ltr"` and a fixed width (`w-20`);
- `disabled`, `aria-invalid` and `aria-required` mirrored from the field.

**Commit-only binding:**
- While typing, the text is a local draft and the thumb does not move.
- Enter or blur commits the draft through the field's normalization (clamp, step or mark, order, `minDistance`). Enter is only swallowed when it changed the text, so forms still submit.
- An empty or invalid draft, or Escape, restores the value.
- ArrowUp/ArrowDown step the value at once, as in a spinbutton.
- While not editing, the input shows the thumb's value, so right after a commit it shows the normalized value (47 typed with `step={5}` reads 45).

**Parsing:** the text is read for `locale` (`utils/parse-slider-input.ts`, from `Intl.NumberFormat.formatToParts`: minus, group and decimal symbols). It is shown without grouping and with the fraction digits of `step`.

**Layout:**
- horizontal: the single input after the track, or for a range the low input before the track and the high one after it;
- vertical: the input or inputs below the track;
- narrow containers (`@container`, under 24rem): the track takes its own line and the inputs wrap below it, the high or single one at the end. The DOM order stays the wide one (low input, track, high input).

**Alternative considered:** the public `NumberField`. Rejected for two reasons:
- while focused it keeps its own text and does not follow `value`, so after Enter it would keep showing "47" when the value is 45 (the spec requires the input to show its thumb's value);
- it is a whole field (its own shell, texts and warnings) nested in another one.

### 9. Field layout and names

- **Single thumb:**
  - `FieldShell` with `labelFor={false}`;
  - the thumb is named with `aria-labelledby={label id}`, or with the consumer's `aria-label`/`aria-labelledby`;
  - it is described by `useFieldA11y`'s `describedBy`.
- **Range:**
  - `FieldShell` with `labelledByRoot` and `rootAria={{ role: "group" }}`;
  - each thumb gets `aria-label={thumbLabels[i]}` plus the shared description.
- **Header value:** `showValue="header"` passes `headerEnd` to `FieldShell`, an `aria-hidden` span with `tabular-nums`.
- **`ref`:** reaches the first thumb.
- **`onBlur`:** fires when focus leaves the field's root (a `focusout` whose `relatedTarget` is outside), so moving between thumbs and inputs does not blur.
- **`loading`:** disables like `disabled`, and shows `FieldLoading` in the header.
- **`vertical`:** sets the slider root's height (`height`, 12rem by default) and `aria-orientation` (Radix sets it on the thumbs).

### 10. Control

`SliderControl` follows the other controls:
- `ControlField` plus `mapControllerToValueField(context, handlers, emptyValue)`;
- `emptyValue` is `min`, or `[min, max]` for a range;
- `ref` goes to the first thumb, so `shouldFocusError` focuses it;
- `onBlur` is the field's `onBlur`, so RHF's `touched` follows the whole field.

The form value is updated on `onValueChange` (live), as other controls do while typing. Consumers wanting commit-only writes use `onValueCommit` themselves.

## Risks / Trade-offs

- **[Radix internals]** The mark offset formula copies Radix's in-bounds math. → A Chromium story compares each mark's centre with the thumb's centre at its value (±1 px), so a Radix change fails the suite.
- **[Intercepted keys]** Every slider key bypasses Radix's handling. → The Keyboard story covers every key in both orientations and in RTL, and unit tests cover the pure next-value functions.
- **[Own input]** The linked input does not support `NumberField`'s extras (expressions, shorthand, grouping while typing). → It is a plain exact-value entry; consumers who need more can pair the slider with a `NumberField` themselves.
- **[`formatRange` support]** Older engines lack it. → It falls back to joining two formatted values with an en dash.
- **[`snapToMarks` with `minDistance`]** Marks closer than `minDistance` can make some pairs unreachable. → `normalizeValues` moves the changed thumb to the next valid mark, and a development warning names a `minDistance` larger than the gap between every pair of marks.

## Migration Plan

Additive. The only existing code touched is `ZoomSlider`, whose markup and behaviour stay the same; its avatar stories and tests are the check. Rollback is reverting the change.

## Open Questions

None. Every choice was confirmed in planning: single and range values, `showValue` modes, and the four extras.

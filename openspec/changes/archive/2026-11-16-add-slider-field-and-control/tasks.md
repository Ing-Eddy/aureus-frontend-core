## 1. Shared slider primitive (refactor, no behaviour change)

- [x] 1.1 Write `internal/components/slider-base/` (`slider-base.tsx`, `index.ts`) as in design decision 1:
  - one or two named thumbs;
  - `data-thumb-index`;
  - the `--slider-thumb` variable and the 24/44 px hit ring;
  - `thumbChildren`, `trackChildren` and `classNames`.

  Export it from `internal/components/index.ts`. Verify with unit tests: one and two thumbs have `role="slider"` with their names and value texts, `name` / `name[]` hidden inputs exist, and `disabled` and `orientation` are forwarded.
- [x] 1.2 Rewrite `avatar-field/components/zoom-slider.tsx` on `SliderBase` with the same classes and attributes. Verify:
  - avatar unit tests pass unchanged;
  - the avatar Edit and Keyboard stories pass;
  - a comparison of the zoom slider's markup before and after shows no difference.

## 2. Utilities and hooks

- [x] 2.1 Write `slider-field/utils/snap.ts` (design decision 3) with tests. Verify:
  - `clamp`;
  - `roundToStep` with decimal steps (0.1, 0.01) without float drift;
  - `nearestMark` and `neighbourMark` at the ends;
  - `normalizeValues` sorts, clamps, snaps, and keeps `minDistance` by moving the changed value, also with marks.
- [x] 2.2 Write `utils/format-slider-value.ts` (design decision 7) with tests. Verify:
  - currency, percent and unit in `es-ES` and `en-US`;
  - `formatRange`, and its fallback when the method is missing;
  - `formatValue` wins over `formatOptions`.
- [x] 2.3 Write `hooks/use-slider-value.ts` (design decision 4) with tests. Verify:
  - controlled and uncontrolled, single and range;
  - out-of-order and out-of-range values are shown normalized;
  - `onValueCommit` is called once per commit.
- [x] 2.4 Write the keyboard function `utils/slider-keys.ts` (design decision 2) with tests. Verify for horizontal, vertical and RTL:
  - PageUp/PageDown and Shift+arrows use `largeStep`;
  - arrows, Home and End with `snapToMarks` move by marks;
  - with a range, keys never pass the other thumb or `minDistance`, and Home/End stay on the grid;
  - non-slider keys return `null`, so the browser handles them.
- [x] 2.5 Write `hooks/use-slider-warnings.ts` (`useMissingTexts` checks) with tests. Verify:
  - a missing accessible name, `thumbLabels`, `inputLabel(s)`, `loadingLabel` and `infoLabel` are each named once with the `SliderField:` prefix;
  - an out-of-range value, and a `minDistance` that no pair of marks satisfies, are each named once;
  - nothing is logged when everything is given.

## 3. Types and components

- [x] 3.1 Write `types/slider-field-types.ts` (design decision 4), with JSDoc stating there are no default texts. Verify with `typecheck`. It contains:
  - `SliderFieldBaseProps`;
  - `SliderMark`;
  - `SliderFieldClassNames` (`slider`, `track`, `range`, `thumb`, `marks`, `tooltip`, `inputs`);
  - the unions `SliderSingleProps` / `SliderRangeProps`, `SliderInputTexts` and `FieldTexts`;
  - `SliderFieldProps`.
- [x] 3.2 Write `components/slider-marks.tsx` (design decision 5). Verify with unit tests:
  - marks outside the limits and duplicates are dropped;
  - the inline style uses the in-bounds formula;
  - the labels render only when given;
  - the layer is `aria-hidden`.
- [x] 3.3 Write `components/slider-value-tooltip.tsx` and `components/slider-header-value.tsx` (design decisions 6 and 9). Verify with unit tests that both are `aria-hidden`, show the formatted text, and that the root's `data-dragging` turns on at pointer down and off at commit or pointer up.
- [x] 3.4 Write `components/slider-input.tsx` (design decision 8). Verify with unit tests:
  - typing does not move the slider until blur or Enter;
  - the commit is clamped, stepped and ordered;
  - an invalid or empty entry restores the value;
  - the inputs are named by `inputLabel(s)`.
- [x] 3.5 Write `slider-field.tsx` and `index.ts`, with overloads for single and range, `FieldShell` names, `onBlur` on `focusout`, `ref` and `loading` (design decision 9). Verify with `typecheck` and a smoke render of single and range.

## 4. Field tests

- [x] 4.1 `slider-field-a11y-tests.tsx`. Verify:
  - names: a single thumb by its label; a range as a group named by the label, with its thumb names;
  - `aria-describedby`, `aria-required`, `aria-invalid` and `aria-valuetext`;
  - vertical `aria-orientation`;
  - axe passes.
- [x] 4.2 `slider-field-value-tests.tsx`. Verify:
  - single and range, controlled and uncontrolled;
  - keyboard steps, `largeStep`, Home/End;
  - `minDistance`;
  - `onValueCommit` once per change;
  - a native form submission contains `name` (single) and `name[]` (range).
- [x] 4.3 `slider-field-marks-tests.tsx` and `slider-field-inputs-tests.tsx`. Verify the spec scenarios "Snapping with the keyboard" and "Typing an exact value", and that disabled or loading disable the inputs.
- [x] 4.4 `slider-field-format-tests.tsx`. Verify the "Currency range" and "Header value" scenarios, and the tooltip text with `formatValue`.
- [x] 4.5 `slider-field-independence-tests.tsx`. Verify that each extra (`showValue`, `marks`, `snapToMarks`, `withInput`, `orientation`, `range`) changes nothing when another is turned on, and that the field without extras is a single slider with no header value, marks or inputs.
- [x] 4.6 `slider-field-types-tests.tsx` with one `@ts-expect-error` per rule. Verify with `typecheck`. The rules:
  - `range` without `thumbLabels`;
  - `withInput` without `inputLabel` (single) or `inputLabels` (range);
  - a pair value without `range`, and a number value with `range`;
  - `thumbLabels` without `range`;
  - `loading` without `loadingLabel`.

## 5. Control

- [x] 5.1 Write `slider-control/` (`slider-control.tsx`, `slider-control-types.ts`, `index.ts`) as in design decision 10. Verify with `typecheck`.
- [x] 5.2 Write `slider-control/tests/`: form value, parity and types. Verify:
  - the form stores a `number` or a pair;
  - a missing value behaves as `min` or `[min, max]`;
  - the "Range validated by a schema" scenario (message, `aria-invalid`, first thumb focused);
  - the markup is identical to `SliderField` via `internal/testing` parity;
  - `@ts-expect-error` on `value`, `defaultValue` and `error`.

## 6. Package, stories and documentation

- [x] 6.1 Add the `slider-field` and `slider-control` entry points (package exports and the tsdown entries, as for the other fields). Verify that `pnpm build` and `pnpm check:package` pass with 26 custom components.
- [x] 6.2 Write `apps/storybook/src/stories/components/forms/slider-field/slider-field-stories.tsx` and `slider-field-docs.ts` (EN/ES). Verify that the stories pass with their play functions and axe. Stories and checks:
  - **Playground**, **Basic** and **Range** (a thumb dragged past the other one trades places; with `minDistance` it stops at that distance);
  - **ShowValue** (header and tooltip);
  - **Formatting** (currency, percent, unit);
  - **Marks**: each mark's centre within 1 px of the thumb's centre at that value, in both orientations and in RTL;
  - **SnapToMarks**;
  - **WithInput**;
  - **Vertical**;
  - **Keyboard**: every key, horizontal, vertical and RTL;
  - **States**;
  - **Responsive** (the 44 px coarse-pointer hit area);
  - **Rtl** (computed direction).
- [x] 6.3 Write `forms/slider-control/` stories and docs (EN/ES): **WithSchema** (the range refine scenario), **DisabledVsLoading** and **Parity**. Verify that the stories pass with axe.
- [x] 6.4 Update the guide `apps/storybook/src/stories/guides/fields-and-controls.mdx` in EN and ES: the Slider section with the usage example, a row in the families table, and the `thumbLabels` / `inputLabel(s)` rows in the texts table. Update the README component list and add `.changeset/add-slider-field-and-control.md` (`minor`). Verify that the guide docs page renders in both locales and that `pnpm lint` passes.

## 7. Verification

- [x] 7.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` (twice, consecutive, all green: unit tests, the text guard, and Chromium stories with axe), `pnpm build` and `pnpm check:package`. Verify that every command exits 0 and record the test counts.
- [x] 7.2 Take screenshots of the built Storybook in light, dark, touch and RTL: single, range with header value, marks, tooltip while focused, linked inputs and vertical. Review them for alignment, contrast and overflow at 320 px. Verify by reviewing the screenshots, and fix and re-run 7.1 if anything changes.

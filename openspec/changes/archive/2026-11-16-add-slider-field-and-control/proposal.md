## Why

Forms often need a value chosen by dragging within limits: volume, a percentage, a budget, or a price range for a filter. The family has no slider field.

- **shadcn's `Slider`** has the look but cannot name its thumbs, so every use fails accessibility.
- **The field layout and binding** (label, helper, error, loading, form binding) are missing.
- **Showing values:** there is no formatting of the shown or announced value, no marks and no way to type an exact value.

The avatar editor already wraps the Radix primitive with named thumbs (`ZoomSlider`), which gives a base to share.

## What Changes

- **New `SliderField`** (`@aureus-core/ui/components/slider-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled, `classNames`, an optional `action`, and `aria-label`/`aria-labelledby`.
  - **Value:** a `number`, or with `range` a `[number, number]` with two thumbs that never cross. The value type follows the mode.
    - `min` (0), `max` (100), `step` (1) and `largeStep` (ten steps);
    - `minDistance` for ranges;
    - `onValueChange` while moving, and `onValueCommit` when a drag or an input edit ends.
  - **Formatting:** `locale` with `formatOptions` (`Intl.NumberFormatOptions`: currency, percent, unit), or `formatValue(value)`, which wins over both. It is used for every shown value and for `aria-valuetext`. Ranges are formatted with `Intl.NumberFormat.formatRange`.
  - **Opt-in extras.** Each is independent:
    - `showValue`: `"header"` shows the formatted value at the end of the label row, and `"tooltip"` shows it over the thumb while it is dragged or focused;
    - `marks`: points on the track, each with an optional label;
    - `snapToMarks`: only mark values are allowed;
    - `withInput`: one number input, or two for a range, to type an exact value;
    - `orientation="vertical"`.
  - **No default texts:**
    - a single thumb is named by the field's label;
    - `range` requires `thumbLabels` (for example "Minimum price", "Maximum price");
    - `withInput` requires `inputLabel`, or `inputLabels` for a range;
    - `loadingLabel` and `infoLabel` as in every field.
- **New `SliderControl`** (`@aureus-core/ui/components/slider-control`): the field bound to the surrounding react-hook-form `FormProvider`. The form holds the `number` or the pair.
- **Internal:** a shared `SliderBase` (the Radix primitive with shadcn's look and named thumbs) in `src/internal/components`. The avatar editor's zoom slider moves onto it with no visible change.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- More than two thumbs.
- Coloured track segments.
- Histograms.
- New dependencies.
- Changing existing components' behaviour.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the slider field and control requirements:
  - value (single and range);
  - formatting;
  - showing the value;
  - marks;
  - linked input;
  - orientation;
  - texts;
  - accessibility;
  - field;
  - form-bound control.

## Impact

- **New code:**
  - `packages/ui/src/internal/components/slider-base/`;
  - `packages/ui/src/components/slider-field/` (`types/`, `hooks/`, `components/`, `utils/`, `tests/`);
  - `packages/ui/src/components/slider-control/`.
- **Changed code:** `components/avatar-field/components/zoom-slider.tsx` uses `SliderBase` (same markup and behaviour).
- **Reused:**
  - `internal/components`: `FieldShell`, `FieldLoading`, `FieldInfo`, `FieldAction`, `ControlField`;
  - `internal/hooks`: `useFieldA11y`, `useControllableState`, `useMissingTexts`;
  - `internal/utils/helpers`: `mapControllerToValueField`;
  - `internal/types`: `FieldTexts`, `DistributiveOmit`;
  - shadcn's `Input`, for the linked inputs.
- **Package:** two new public entry points (26 custom components).
- **Release:** a `minor` changeset.

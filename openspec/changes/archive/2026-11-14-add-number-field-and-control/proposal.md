## Why

The form family has text, password and multi-line inputs, but no numeric one. Numbers are the most frequent values in business apps, accounting among them. The browser's `<input type="number">` is not up to it:
- its spinner looks different on every browser and is hard to use on touch screens;
- it cannot show thousands separators or currency;
- it accepts stray characters such as `e`;
- its value is a string.

A number pair built on the shared field base gives apps one consistent, accessible numeric input that a simple form can use as is, and an accounting screen can configure in depth.

## What Changes

- **New `NumberField`** (`@aureus-core/ui/components/number-field`). It has the same shared field behaviour as the rest of the family: label, required mark, info tooltip, helper text, error with an optional message, loading, disabled, `classNames` and a configurable `action`. It is specialised in numbers:
  - **Value:** `number | null` (`null` when empty), controlled or uncontrolled, reported with `onValueChange`.
  - **Independent, opt-in formatting:** none of these props changes another one's default. Without them the field shows plain digits (`122345`).
    - `locale` sets the separator symbols;
    - `grouping` turns thousands separators on or off;
    - `decimals` sets the maximum number of decimals, and `padDecimals` pads with zeros on blur;
    - `currency` (with `currencyDisplay`) only adds the currency symbol, fixed in the frame;
    - `prefix` and `suffix` add fixed text such as `%` or `kg`;
    - `align` sets the text alignment;
    - `negativeFormat` (`minus` or `parentheses`) and `negativeColor` style negative values.
  - **Live formatting:** separators appear while typing and the caret keeps its place.
  - **Custom stepper buttons** replace the native spinner:
    - `stepper` shows or hides them;
    - `stepperLayout` is `stacked` (▲▼ at the end) or `split` (− at the start, + at the end);
    - on touch screens the stacked layout switches automatically to split, so every target is at least 24×24 px;
    - press-and-hold repeats the step;
    - the buttons are disabled at `min` and `max`.
  - **Always-on number handling:**
    - `min`, `max` and clamping on commit (`clampOnBlur`);
    - `step` and `largeStep`;
    - keyboard: arrows, Shift, PageUp/PageDown, Home/End, Enter to commit, Escape to revert;
    - pasting formatted text (`$1,234.50`, `1.234,50 €`, `(500)`);
    - `allowNegative`;
    - a numeric keyboard on mobile;
    - exact stepping and rounding (no `0.1 + 0.2` artefacts).
  - **Opt-in conveniences:**
    - `selectOnFocus`;
    - `wheel`, which steps with the mouse wheel only while focused;
    - `shorthand`: `1.5k`, `2m`, `1b`;
    - `expressions`: `=120*3+5`, with a safe evaluator. The expression is remembered for the component's lifetime: the field shows the result, and shows the expression again for editing on focus.
  - **Accessibility:** the input is a `spinbutton` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a readable `aria-valuetext` ("minus $1,234.50"). The step buttons are outside the Tab order, as the WAI-ARIA spinbutton pattern recommends.
- **New `NumberControl`** (`@aureus-core/ui/components/number-control`). It is `NumberField` bound to the surrounding react-hook-form `FormProvider`, takes only `name` plus the field's props, and the form receives a `number | null`.
- **Internal additions:**
  - an `InputField` extension with optional start and end addon slots (Text and Password unchanged);
  - a reusable `FieldStepper` component;
  - a `mapControllerToValueField` helper for value-based (non-event) fields;
  - stepper strings and styles.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a Number section in the "Fields & controls" guide;
  - README and CONTRIBUTING updates;
  - JSDoc;
  - a `minor` changeset.

Non-goals:
- No arbitrary-precision decimals (values beyond about 15 significant digits). A development warning flags them.
- No currency conversion, and no automatic decimals from a currency: the implementation decides.
- No range sliders or scrubbing.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds number value and precision, number formatting, negative numbers, stepper buttons, number keyboard and wheel, number input conveniences (paste, shorthand, remembered expressions, select on focus), `NumberField` and `NumberControl`.

## Impact

- **Code:**
  - new `packages/ui/src/components/number-field/**` (component, hooks, utils, tests) and `number-control/**`;
  - new `packages/ui/src/internal/components/field-stepper/**`;
  - the `internal/components/input-field/input-field.tsx` gains its addon slots;
  - new `mapControllerToValueField` in `internal/utils/helpers`;
  - new constants (strings and styles).
- **Playground:**
  - new `apps/storybook/src/stories/components/forms/number-{field,control}/`;
  - the guide is updated.
- **Dependencies:** none. Formatting uses the built-in `Intl.NumberFormat`.
- **Consumers:** purely additive. Text and Password render the same markup as before.

import type { ComponentProps, ReactNode } from "react";
import type { FieldActionProps, FieldBaseProps } from "@/internal/types";

/**
 * Number-specific options. Every one is optional and independent: none changes another one's
 * default. Without any of them the field is a plain number input that shows digits as typed.
 */
export interface NumberFieldOptions {
  /** Controlled value; `null` is empty. */
  value?: number | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: number | null;
  /** Called with the parsed value while typing (when it parses) and on commit. */
  onValueChange?: (value: number | null) => void;

  /** Lowest value. The decrease button is disabled at it. */
  min?: number;
  /** Highest value. The increase button is disabled at it. */
  max?: number;
  /** Clamps the committed value to `[min, max]`. Defaults to `true`. */
  clampOnBlur?: boolean;
  /** Allows negative values. Defaults to `true`. */
  allowNegative?: boolean;
  /** Step of the arrows and buttons. Defaults to `1`. */
  step?: number;
  /** Step with Shift, PageUp and PageDown. Defaults to ten times `step`. */
  largeStep?: number;

  /** Locale of the group and decimal separators. Defaults to `"en-US"`. */
  locale?: string;
  /** Shows thousands separators ("123,345"). Defaults to `false` ("123345"). */
  grouping?: boolean;
  /** Maximum fraction digits accepted; `0` allows only integers. Unlimited by default. */
  decimals?: number;
  /** Pads the fraction with zeros up to `decimals` ("12.50"). Defaults to `false`. */
  padDecimals?: boolean;
  /** ISO 4217 code. Only adds its symbol at the start of the frame; changes nothing else. */
  currency?: string;
  /** How the currency is shown. Defaults to `"symbol"`. */
  currencyDisplay?: "symbol" | "narrowSymbol" | "code";
  /** Fixed content at the start of the frame, after the currency (e.g. "≈"). */
  prefix?: ReactNode;
  /** Fixed content at the end of the text (e.g. "%", "kg"). */
  suffix?: ReactNode;
  /** Alignment of the number. Defaults to `"start"`. */
  align?: "start" | "end";

  /** How negatives are shown when not editing. Defaults to `"minus"`. */
  negativeFormat?: "minus" | "parentheses";
  /** Shows negative values in the destructive color. Defaults to `false`. */
  negativeColor?: boolean;

  /** Shows the step buttons. Defaults to `true`. */
  stepper?: boolean;
  /**
   * `"stacked"` (▲▼ at the end, the default) or `"split"` (− at the start, + at the end).
   * Stacked buttons switch to split on touch screens.
   */
  stepperLayout?: "stacked" | "split";
  /** Accessible name of the increase button. Defaults to "Increase". */
  incrementLabel?: string;
  /** Accessible name of the decrease button. Defaults to "Decrease". */
  decrementLabel?: string;

  /** Selects the whole text on focus. Defaults to `false`. */
  selectOnFocus?: boolean;
  /** The mouse wheel steps the value while the field is focused. Defaults to `false`. */
  wheel?: boolean;
  /** `k`, `m` and `b` suffixes expand on commit ("1.5k" → 1500). Defaults to `false`. */
  shorthand?: boolean;
  /**
   * Arithmetic is evaluated on commit ("=120*3+5" → 365). The expression is remembered while the
   * field is mounted and shown again on focus. Defaults to `false`.
   */
  expressions?: boolean;
  /** Error message for an expression that cannot be evaluated. Defaults to "Invalid expression". */
  invalidExpressionLabel?: string;
  /** Description of a value that comes from an expression. Defaults to "Calculated from …". */
  calculatedFromLabel?: (expression: string) => string;
  /** How a negative value is spoken in `aria-valuetext`. Defaults to "minus". */
  minusLabel?: string;
}

/**
 * Props of `NumberField`: the shared field props, an optional `action`, the number options, and
 * the remaining native `<input>` props (`name`, `placeholder`, `onBlur`, `ref`…).
 */
export type NumberFieldProps = FieldBaseProps &
  Omit<
    ComponentProps<"input">,
    | "type"
    | "value"
    | "defaultValue"
    | "min"
    | "max"
    | "step"
    | "inputMode"
    | "size"
    | "disabled"
    | "required"
    | "className"
    | "children"
    | "prefix"
  > &
  NumberFieldOptions & {
    /** Button inside the frame, before the step buttons. */
    action?: FieldActionProps;
  };

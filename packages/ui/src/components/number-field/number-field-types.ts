import type { ComponentProps, ReactNode } from "react";
import type { FieldActionProps, FieldBaseProps, FieldTexts } from "@/internal/types";

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

  /**
   * Locale of the group and decimal separators and of the currency symbol. Defaults to the
   * browser's. Pass it when every user must see the same format.
   */
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

  /**
   * `"stacked"` (▲▼ at the end, the default) or `"split"` (− at the start, + at the end).
   * Stacked buttons switch to split on touch screens.
   */
  stepperLayout?: "stacked" | "split";

  /** Selects the whole text on focus. Defaults to `false`. */
  selectOnFocus?: boolean;
  /** The mouse wheel steps the value while the field is focused. Defaults to `false`. */
  wheel?: boolean;
  /** `k`, `m` and `b` suffixes expand on commit ("1.5k" → 1500). Defaults to `false`. */
  shorthand?: boolean;
}

/**
 * The step buttons, shown unless `stepper={false}`. While they are shown, their accessible names
 * are required; no text is generated.
 */
export type NumberStepperTexts =
  | {
      /** Shows the step buttons. Defaults to `true`. */
      stepper: false;
      /** Only allowed while the step buttons are shown. */
      incrementLabel?: never;
      /** Only allowed while the step buttons are shown. */
      decrementLabel?: never;
    }
  | {
      /** Shows the step buttons. Defaults to `true`. */
      stepper?: boolean;
      /** Accessible name of the increase button, in the developer's language. */
      incrementLabel: string;
      /** Accessible name of the decrease button, in the developer's language. */
      decrementLabel: string;
    };

/** Remembered expressions. Turning them on requires their two texts; no text is generated. */
export type NumberExpressionTexts =
  | {
      /**
       * Arithmetic is evaluated on commit ("=120*3+5" → 365). The expression is remembered while
       * the field is mounted and shown again on focus. Defaults to `false`.
       */
      expressions?: false;
      /** Only allowed together with `expressions`. */
      invalidExpressionLabel?: never;
      /** Only allowed together with `expressions`. */
      calculatedFromLabel?: never;
    }
  | {
      /**
       * Arithmetic is evaluated on commit ("=120*3+5" → 365). The expression is remembered while
       * the field is mounted and shown again on focus. Defaults to `false`.
       */
      expressions: boolean;
      /** Error message for an expression that cannot be evaluated. Required with `expressions`. */
      invalidExpressionLabel: string;
      /**
       * Part of the accessible description of a value that comes from an expression, for example
       * `(expression) => "Calculado a partir de " + expression`. Required with `expressions`.
       */
      calculatedFromLabel: (expression: string) => string;
    };

/**
 * Props of `NumberField`: the shared field props, an optional `action`, the number options, and
 * the remaining native `<input>` props (`name`, `placeholder`, `onBlur`, `ref`…). `loading`,
 * `info`, the step buttons and `expressions` require their texts; no text is generated.
 */
export type NumberFieldProps = FieldBaseProps &
  FieldTexts &
  NumberStepperTexts &
  NumberExpressionTexts &
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

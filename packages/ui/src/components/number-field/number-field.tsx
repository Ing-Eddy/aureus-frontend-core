import { useId, useMemo, useRef } from "react";
import {
  FieldStepperSplitButton,
  FieldStepperStacked,
  InputField,
  useStepperLayout,
} from "@/internal/components";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { InputGroupAddon, InputGroupText } from "@/shadcn/ui/input-group";
import { useNumberInput } from "./hooks";
import type { NumberFieldProps } from "./number-field-types";
import { browserLocale, formatEditing, getCurrencySymbol } from "./utils";

/**
 * A number input with the shared field layout. Every number behaviour is an independent, opt-in
 * prop: formatting (locale, grouping, decimals, currency, prefix, suffix), negatives, custom step
 * buttons, keyboard stepping, paste, shorthand and remembered expressions. It ships no default
 * texts.
 *
 * ```tsx
 * <NumberField
 *   label={t("invoice.total")}
 *   locale="es-BO"
 *   currency="BOB"
 *   decimals={2}
 *   min={0}
 *   stepper={false}
 *   value={total}
 *   onValueChange={setTotal}
 * />
 * ```
 */
export function NumberField(allProps: NumberFieldProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min,
    max,
    clampOnBlur = true,
    allowNegative = true,
    step = 1,
    largeStep,
    locale: localeProp,
    grouping = false,
    decimals,
    padDecimals = false,
    currency,
    currencyDisplay = "symbol",
    prefix,
    suffix,
    align = "start",
    negativeFormat = "minus",
    negativeColor = false,
    stepper = true,
    stepperLayout = "stacked",
    incrementLabel,
    decrementLabel,
    selectOnFocus = false,
    wheel = false,
    shorthand = false,
    expressions = false,
    invalidExpressionLabel,
    calculatedFromLabel,
    id,
    ref,
    disabled,
    loading,
    readOnly,
    error,
    errorMessage,
    classNames,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onPaste,
    "aria-describedby": describedBy,
    ...props
  } = allProps;
  useMissingTexts("NumberField", [
    inputNameCheck(allProps),
    ...fieldTextChecks(allProps),
    [stepper && !incrementLabel, "the step buttons need `incrementLabel`"],
    [stepper && !decrementLabel, "the step buttons need `decrementLabel`"],
    [expressions && !invalidExpressionLabel, "`expressions` needs `invalidExpressionLabel`"],
    [expressions && !calculatedFromLabel, "`expressions` needs `calculatedFromLabel`"],
  ]);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const calculatedId = `${inputId}-calculated`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const locked = Boolean(disabled || loading || readOnly);
  const locale = localeProp ?? browserLocale();

  const number = useNumberInput({
    inputRef,
    value: valueProp,
    defaultValue,
    onValueChange,
    min,
    max,
    clampOnBlur,
    allowNegative,
    step,
    largeStep: largeStep ?? step * 10,
    locale,
    grouping,
    decimals,
    padDecimals,
    negativeFormat,
    selectOnFocus,
    wheel,
    shorthand,
    expressions,
    locked,
    readOnly: Boolean(readOnly),
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onPaste,
  });

  const layout = useStepperLayout(stepperLayout);
  const currencySymbol = currency
    ? getCurrencySymbol(locale, currency, currencyDisplay)
    : undefined;
  const value = number.value;

  // The formatted number with its minus sign (never parentheses, never words), so screen readers
  // speak it in their own language: "-$1,234.50".
  const valueText =
    value === null
      ? undefined
      : [
          `${value < 0 ? "-" : ""}${currencySymbol ?? ""}${formatEditing(Math.abs(value), number.format)}`,
          typeof suffix === "string" ? suffix : "",
        ]
          .filter(Boolean)
          .join(" ");

  const stepperProps = {
    controls: inputId,
    onStep: (direction: "increment" | "decrement") => number.step(direction),
    disabled: locked,
    incrementLabel,
    decrementLabel,
  };

  const startSlot = (
    <>
      {stepper && layout === "split" ? (
        <FieldStepperSplitButton
          {...stepperProps}
          direction="decrement"
          canStep={number.canDecrement}
        />
      ) : null}
      {currencySymbol || prefix ? (
        <InputGroupAddon align="inline-start">
          {currencySymbol ? (
            <InputGroupText data-slot="number-field-currency">{currencySymbol}</InputGroupText>
          ) : null}
          {prefix ? (
            <InputGroupText data-slot="number-field-prefix">{prefix}</InputGroupText>
          ) : null}
        </InputGroupAddon>
      ) : null}
    </>
  );

  const endSlot = stepper ? (
    layout === "split" ? (
      <FieldStepperSplitButton
        {...stepperProps}
        direction="increment"
        canStep={number.canIncrement}
      />
    ) : (
      <FieldStepperStacked
        {...stepperProps}
        canIncrement={number.canIncrement}
        canDecrement={number.canDecrement}
      />
    )
  ) : null;

  const inputMode = decimals === 0 && !allowNegative ? "numeric" : "decimal";

  return (
    <>
      <InputField
        {...props}
        {...number.inputProps}
        componentName="NumberField"
        id={inputId}
        ref={mergedRef}
        type="text"
        role="spinbutton"
        inputMode={inputMode}
        dir="ltr"
        autoComplete="off"
        spellCheck={false}
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={valueText}
        aria-describedby={
          [describedBy, number.remembered ? calculatedId : undefined].filter(Boolean).join(" ") ||
          undefined
        }
        disabled={disabled}
        loading={loading}
        readOnly={readOnly}
        error={error || number.expressionError}
        errorMessage={number.expressionError ? invalidExpressionLabel : errorMessage}
        classNames={{
          ...classNames,
          input: cn(
            align === "end" && "text-end",
            negativeColor && value !== null && value < 0 && "text-destructive",
            classNames?.input,
          ),
        }}
        startSlot={startSlot}
        inputEndSlot={
          suffix ? (
            <InputGroupText data-slot="number-field-suffix">{suffix}</InputGroupText>
          ) : undefined
        }
        endSlot={endSlot}
      />
      {number.remembered ? (
        <span id={calculatedId} className="sr-only">
          {calculatedFromLabel?.(number.remembered.source)}
        </span>
      ) : null}
    </>
  );
}

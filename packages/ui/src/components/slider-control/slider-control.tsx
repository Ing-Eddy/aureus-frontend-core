import { SliderField, type SliderFieldProps } from "@/components/slider-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { SliderControlProps } from "./slider-control-types";

type SliderValue = number | [number, number];

/**
 * `SliderField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds a `number` (or `[low, high]` with `range`), a missing value behaves as `min` (or
 * `[min, max]`), and the validation message is shown as helper text. The form value follows the
 * thumb while it moves; `onValueCommit` still reports the end of each interaction.
 */
export function SliderControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: SliderControlProps) {
  const min = fieldProps.min ?? 0;
  const max = fieldProps.max ?? 100;
  const emptyValue: SliderValue = fieldProps.range === true ? [min, max] : min;
  return (
    <ControlField
      componentName="SliderControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLSpanElement, SliderValue>(
          context,
          {
            onValueChange: fieldProps.onValueChange as ((value: SliderValue) => void) | undefined,
            ref,
          },
          emptyValue,
        );
        const props = {
          ...fieldProps,
          ...mapped,
          // The field's blur comes from its container (thumbs and inputs), not from the thumb.
          onBlur: (event) => {
            context.field.onBlur();
            onBlur?.(event);
          },
          disabled: mapped.disabled || disabled,
        } as SliderFieldProps;
        return <SliderField {...props} />;
      }}
    />
  );
}

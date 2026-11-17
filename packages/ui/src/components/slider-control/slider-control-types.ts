import type { SliderFieldProps } from "@/components/slider-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `SliderControl`: the field `name` and binding options, plus every `SliderField` prop
 * except the value and error, which come from the surrounding form. The form holds a `number`, or
 * `[low, high]` with `range`.
 */
export type SliderControlProps = ControlBaseProps &
  DistributiveOmit<
    SliderFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

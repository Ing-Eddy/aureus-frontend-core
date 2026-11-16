import type { NumberFieldProps } from "@/components/number-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `NumberControl`: the field `name` and binding options, plus every `NumberField` prop
 * except the value and error, which come from the surrounding form. The form holds
 * `number | null`.
 */
export type NumberControlProps = ControlBaseProps &
  DistributiveOmit<
    NumberFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

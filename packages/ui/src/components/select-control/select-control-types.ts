import type { SelectFieldProps } from "@/components/select-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `SelectControl`: the field `name` and binding options, plus every `SelectField` prop
 * except the value and error, which come from the surrounding form. The form holds
 * `string | null` (single) or `string[]` (multiple).
 */
export type SelectControlProps = ControlBaseProps &
  DistributiveOmit<
    SelectFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

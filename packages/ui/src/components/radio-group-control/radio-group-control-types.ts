import type { RadioGroupFieldProps } from "@/components/radio-group-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `RadioGroupControl`: the field `name` and binding options, plus every
 * `RadioGroupField` prop except the value and error, which come from the surrounding form.
 * The form holds `string | null` (or the other option's text).
 */
export type RadioGroupControlProps = ControlBaseProps &
  DistributiveOmit<
    RadioGroupFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

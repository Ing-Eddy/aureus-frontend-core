import type { DateTimeFieldProps } from "@/components/date-time-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `DateTimeControl`: the field `name` and binding options, plus every `DateTimeField` prop
 * except the value and error, which come from the surrounding form. The form holds the ISO string,
 * or `null` while the input is empty or incomplete.
 */
export type DateTimeControlProps = ControlBaseProps &
  DistributiveOmit<
    DateTimeFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

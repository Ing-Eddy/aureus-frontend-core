import type { DateSelectionFieldProps } from "@/components/date-selection-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `DateSelectionControl`: the field `name` and binding options, plus every
 * `DateSelectionField` prop except the value and error, which come from the surrounding form. The
 * form holds the range (or `null`), or the list of days.
 */
export type DateSelectionControlProps = ControlBaseProps &
  DistributiveOmit<
    DateSelectionFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

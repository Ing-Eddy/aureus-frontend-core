import type { TextAreaFieldProps } from "@/components/text-area-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `TextAreaControl`: the field `name` and binding options, plus the same visual,
 * sizing, counter and shortcut props as `TextAreaField`. Value, default value, validation and
 * error come from the surrounding form.
 */
export type TextAreaControlProps = ControlBaseProps &
  DistributiveOmit<
    TextAreaFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

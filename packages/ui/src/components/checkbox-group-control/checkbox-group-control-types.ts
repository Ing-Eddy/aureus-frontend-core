import type { CheckboxGroupFieldProps } from "@/components/checkbox-group-field";
import type { ControlBaseProps } from "@/internal/types";

/**
 * Props of `CheckboxGroupControl`: the field `name` and binding options, plus every
 * `CheckboxGroupField` prop except the value and error, which come from the surrounding form.
 * The form holds a `string[]`.
 */
export type CheckboxGroupControlProps = ControlBaseProps &
  Omit<
    CheckboxGroupFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

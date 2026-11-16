import type { PasswordFieldProps } from "@/components/password-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/**
 * Props of `PasswordControl`: the field `name` and binding options, plus the same visual and
 * visibility props as `PasswordField`. Value, default value, validation and error come from the
 * surrounding form.
 */
export type PasswordControlProps = ControlBaseProps &
  DistributiveOmit<
    PasswordFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

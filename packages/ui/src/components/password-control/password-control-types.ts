import type { PasswordFieldProps } from "@/components/password-field";
import type { ControlBaseProps } from "@/internal/types";

/**
 * Props of `PasswordControl`: the field `name` and binding options, plus the same visual and
 * visibility props as `PasswordField`. Value, default value, validation and error come from the
 * surrounding form.
 */
export type PasswordControlProps = ControlBaseProps &
  Omit<
    PasswordFieldProps,
    "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled"
  >;

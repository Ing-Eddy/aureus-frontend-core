import type { OtpFieldProps } from "@/components/otp-field";
import type { ControlBaseProps } from "@/internal/types";

/**
 * Props of `OtpControl`: the field `name` and binding options, plus every `OtpField` prop except
 * the value and error, which come from the surrounding form. The form holds the code as a `string`.
 */
export type OtpControlProps = ControlBaseProps &
  Omit<OtpFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">;

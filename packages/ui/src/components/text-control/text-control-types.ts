import type { TextFieldProps } from "@/components/text-field";
import type { ControlBaseProps } from "@/internal/types";

/**
 * Props of `TextControl`: the field `name` and binding options, plus the same visual props as
 * `TextField`. Value, default value, validation and error come from the surrounding form.
 */
export type TextControlProps = ControlBaseProps &
  Omit<TextFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">;

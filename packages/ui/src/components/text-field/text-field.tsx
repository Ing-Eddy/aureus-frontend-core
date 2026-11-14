import { InputField } from "@/internal/components";
import type { TextFieldProps } from "./text-field-types";

/**
 * A text input with label, required mark, info tooltip, helper text, error, loading and disabled
 * states, and an optional integrated action button. Works controlled and uncontrolled.
 */
export function TextField(props: TextFieldProps) {
  return <InputField {...props} type="text" />;
}

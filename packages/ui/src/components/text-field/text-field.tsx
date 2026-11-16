import { InputField } from "@/internal/components";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import type { TextFieldProps } from "./text-field-types";

/**
 * A text input with label, required mark, info tooltip, helper text, error, loading and disabled
 * states, and an optional integrated action button. Works controlled and uncontrolled. It ships
 * no default texts.
 */
export function TextField(props: TextFieldProps) {
  useMissingTexts("TextField", [inputNameCheck(props), ...fieldTextChecks(props)]);
  return <InputField {...props} componentName="TextField" type="text" />;
}

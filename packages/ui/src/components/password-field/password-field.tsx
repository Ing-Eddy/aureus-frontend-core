import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId, useMemo, useRef } from "react";
import { InputField } from "@/internal/components";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import { passwordInputClassName } from "@/internal/utils/constants";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { usePasswordVisibility } from "./hooks";
import type { PasswordFieldProps } from "./password-field-types";

/**
 * A password input with the same label, required mark, info tooltip, helper text, error, loading
 * and disabled states as `TextField`, and a built-in show/hide toggle in place of an action. It
 * ships no default texts: the toggle's names are required.
 */
export function PasswordField({
  visible: visibleProp,
  defaultVisible,
  onVisibleChange,
  showPasswordLabel,
  hidePasswordLabel,
  autoComplete = "current-password",
  id,
  ref,
  classNames,
  ...props
}: PasswordFieldProps) {
  useMissingTexts("PasswordField", [
    inputNameCheck(props),
    ...fieldTextChecks(props),
    [!showPasswordLabel, "the visibility toggle needs `showPasswordLabel`"],
    [!hidePasswordLabel, "the visibility toggle needs `hidePasswordLabel`"],
  ]);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);

  const { visible, toggle, keepCaretOnPointerDown } = usePasswordVisibility({
    visible: visibleProp,
    defaultVisible,
    onVisibleChange,
    inputRef,
  });

  return (
    <InputField
      {...props}
      componentName="PasswordField"
      id={inputId}
      ref={mergedRef}
      autoComplete={autoComplete}
      // A visible password must never reach a spell checker or be auto-corrected.
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      classNames={{ ...classNames, input: cn(passwordInputClassName, classNames?.input) }}
      type={visible ? "text" : "password"}
      action={{
        children: visible ? <EyeOffIcon /> : <EyeIcon />,
        "aria-label": visible ? hidePasswordLabel : showPasswordLabel,
        "aria-pressed": visible,
        "aria-controls": inputId,
        onPointerDown: keepCaretOnPointerDown,
        onClick: toggle,
      }}
    />
  );
}

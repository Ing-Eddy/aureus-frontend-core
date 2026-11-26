import { PasswordField } from "@/components/password-field";
import { ControlField } from "@/internal/components";
import { mapControllerToField } from "@/internal/utils/helpers";
import type { PasswordControlProps } from "./password-control-types";

/**
 * `PasswordField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: it reads its value from the form and shows the form's validation message as
 * helper text.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>.
 * <PasswordControl
 *   name="password"
 *   label={t("auth.password")}
 *   showPasswordLabel={t("auth.showPassword")}
 *   hidePasswordLabel={t("auth.hidePassword")}
 * />
 * ```
 */
export function PasswordControl({
  name,
  disabled,
  shouldUnregister,
  onChange,
  onBlur,
  ref,
  ...fieldProps
}: PasswordControlProps) {
  return (
    <ControlField
      componentName="PasswordControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToField<HTMLInputElement>(context, { onChange, onBlur, ref });
        return <PasswordField {...fieldProps} {...mapped} disabled={mapped.disabled || disabled} />;
      }}
    />
  );
}

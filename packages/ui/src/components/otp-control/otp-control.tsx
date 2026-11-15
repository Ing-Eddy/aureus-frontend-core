import { OtpField } from "@/components/otp-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { OtpControlProps } from "./otp-control-types";

/**
 * `OtpField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`: the
 * form holds the code as a `string`, and its validation message is shown as helper text.
 */
export function OtpControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: OtpControlProps) {
  return (
    <ControlField
      componentName="OtpControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLInputElement, string>(
          context,
          { onValueChange: fieldProps.onValueChange, onBlur, ref },
          "",
        );
        return <OtpField {...fieldProps} {...mapped} disabled={mapped.disabled || disabled} />;
      }}
    />
  );
}

import { TextField } from "@/components/text-field";
import { ControlField } from "@/internal/components";
import { mapControllerToField } from "@/internal/utils/helpers";
import type { TextControlProps } from "./text-control-types";

/**
 * `TextField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * it reads its value from the form and shows the form's validation message as helper text.
 */
export function TextControl({
  name,
  disabled,
  shouldUnregister,
  onChange,
  onBlur,
  ref,
  ...fieldProps
}: TextControlProps) {
  return (
    <ControlField
      componentName="TextControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToField<HTMLInputElement>(context, { onChange, onBlur, ref });
        return <TextField {...fieldProps} {...mapped} disabled={mapped.disabled || disabled} />;
      }}
    />
  );
}

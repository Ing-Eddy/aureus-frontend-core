import { NumberField } from "@/components/number-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { NumberControlProps } from "./number-control-types";

/**
 * `NumberField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds a `number | null` (never a string), and its validation message is shown as
 * helper text.
 */
export function NumberControl({
  name,
  disabled,
  shouldUnregister,
  onValueChange,
  onBlur,
  ref,
  ...fieldProps
}: NumberControlProps) {
  return (
    <ControlField
      componentName="NumberControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLInputElement, number | null>(
          context,
          { onValueChange, onBlur, ref },
          null,
        );
        return <NumberField {...fieldProps} {...mapped} disabled={mapped.disabled || disabled} />;
      }}
    />
  );
}

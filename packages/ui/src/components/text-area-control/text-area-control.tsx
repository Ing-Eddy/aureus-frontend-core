import { TextAreaField } from "@/components/text-area-field";
import { ControlField } from "@/internal/components";
import { mapControllerToField } from "@/internal/utils/helpers";
import type { TextAreaControlProps } from "./text-area-control-types";

/**
 * `TextAreaField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: it reads its value from the form and shows the form's validation message as
 * helper text.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>.
 * <TextAreaControl name="notes" label={t("order.notes")} minRows={3} />
 * ```
 */
export function TextAreaControl({
  name,
  disabled,
  shouldUnregister,
  onChange,
  onBlur,
  ref,
  ...fieldProps
}: TextAreaControlProps) {
  return (
    <ControlField
      componentName="TextAreaControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToField<HTMLTextAreaElement>(context, {
          onChange,
          onBlur,
          ref,
        });
        return <TextAreaField {...fieldProps} {...mapped} disabled={mapped.disabled || disabled} />;
      }}
    />
  );
}

import { DateTimeField, type DateTimeFieldProps } from "@/components/date-time-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { DateTimeControlProps } from "./date-time-control-types";

/**
 * `DateTimeField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds the ISO string (`null` while empty or incomplete), a missing value behaves as
 * `null`, and the validation message is shown as helper text. Opening the calendar does not mark
 * the field as touched.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>. The form stores "HH:mm".
 * <DateTimeControl name="opensAt" label={t("store.opensAt")} mode="time" minuteStep={15} />
 * ```
 */
export function DateTimeControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: DateTimeControlProps) {
  return (
    <ControlField
      componentName="DateTimeControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLSpanElement, string | null>(
          context,
          { onValueChange: fieldProps.onValueChange, ref },
          null,
        );
        const props = {
          ...fieldProps,
          ...mapped,
          // The field's blur comes from its frame and calendar, not from one segment.
          onBlur: (event) => {
            context.field.onBlur();
            onBlur?.(event);
          },
          disabled: mapped.disabled || disabled,
        } as DateTimeFieldProps;
        return <DateTimeField {...props} />;
      }}
    />
  );
}

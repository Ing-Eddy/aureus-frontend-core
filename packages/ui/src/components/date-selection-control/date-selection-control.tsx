import {
  type DateRangeValue,
  DateSelectionField,
  type DateSelectionFieldProps,
} from "@/components/date-selection-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { DateSelectionControlProps } from "./date-selection-control-types";

/** The value of either selection. */
type SelectionValue = DateRangeValue | null | readonly string[];

/**
 * `DateSelectionField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: the form holds the range (`null` without a start) or the list of days, a missing
 * value behaves as `null` (`[]` for several days), and the validation message is shown as helper
 * text. Opening the calendar does not mark the field as touched.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>. The form stores an array of "YYYY-MM-DD".
 * <DateSelectionControl
 *   name="holidays"
 *   label={t("calendar.holidays")}
 *   selection="multiple"
 *   previousMonthLabel={t("date.previousMonth")}
 *   nextMonthLabel={t("date.nextMonth")}
 * />
 * ```
 */
export function DateSelectionControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: DateSelectionControlProps) {
  const emptyValue: SelectionValue = fieldProps.selection === "multiple" ? [] : null;
  return (
    <ControlField
      componentName="DateSelectionControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLElement, SelectionValue>(
          context,
          {
            onValueChange: fieldProps.onValueChange as
              | ((value: SelectionValue) => void)
              | undefined,
            ref,
          },
          emptyValue,
        );
        const props = {
          ...fieldProps,
          ...mapped,
          // The field's blur comes from its frame and calendar, not from one element.
          onBlur: (event) => {
            context.field.onBlur();
            onBlur?.(event);
          },
          disabled: mapped.disabled || disabled,
        } as DateSelectionFieldProps;
        return <DateSelectionField {...props} />;
      }}
    />
  );
}

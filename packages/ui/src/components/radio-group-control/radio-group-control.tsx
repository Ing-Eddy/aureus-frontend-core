import { RadioGroupField } from "@/components/radio-group-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField, mergeRefs } from "@/internal/utils/helpers";
import type { RadioGroupControlProps } from "./radio-group-control-types";

/** The radio react-hook-form should focus on error: the checked one, or the first enabled one. */
function focusTarget(group: HTMLElement) {
  return (
    group.querySelector<HTMLElement>('[role="radio"][data-state="checked"]') ??
    group.querySelector<HTMLElement>('[role="radio"]:not(:disabled)')
  );
}

/**
 * `RadioGroupField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: the form holds `string | null`, and its validation message is shown as helper
 * text.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>.
 * <RadioGroupControl name="delivery" label={t("order.delivery")} options={deliveryOptions} />
 * ```
 */
export function RadioGroupControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: RadioGroupControlProps) {
  return (
    <ControlField
      componentName="RadioGroupControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLDivElement, string | null>(
          context,
          { onValueChange: fieldProps.onValueChange, onBlur },
          null,
        );
        // The radiogroup is not focusable itself: react-hook-form gets an object that focuses the
        // checked radio, or the first enabled one.
        const formRef = (element: HTMLDivElement | null) =>
          context.field.ref(element ? { focus: () => focusTarget(element)?.focus() } : null);
        return (
          <RadioGroupField
            {...fieldProps}
            {...mapped}
            ref={mergeRefs<HTMLDivElement>(formRef, ref)}
            disabled={mapped.disabled || disabled}
          />
        );
      }}
    />
  );
}

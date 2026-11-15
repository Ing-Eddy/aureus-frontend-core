import { CheckboxGroupField } from "@/components/checkbox-group-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField, mergeRefs } from "@/internal/utils/helpers";
import type { CheckboxGroupControlProps } from "./checkbox-group-control-types";

/** The first box that can take focus inside a group container. */
function firstEnabledBox(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[role="checkbox"]:not(:disabled)');
}

/**
 * `CheckboxGroupField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: the form holds a `string[]`, and its validation message is shown as helper text.
 */
export function CheckboxGroupControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: CheckboxGroupControlProps) {
  return (
    <ControlField
      componentName="CheckboxGroupControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLDivElement, string[]>(
          context,
          { onValueChange: fieldProps.onValueChange, onBlur },
          [],
        );
        // react-hook-form focuses whatever its ref holds; the group container is not focusable,
        // so it receives an object that focuses the first enabled box instead.
        const formRef = (element: HTMLDivElement | null) =>
          context.field.ref(element ? { focus: () => firstEnabledBox(element)?.focus() } : null);
        return (
          <CheckboxGroupField
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

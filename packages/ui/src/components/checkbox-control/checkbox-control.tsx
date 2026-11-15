import type { ReactElement } from "react";
import {
  CheckboxField,
  type CheckboxFieldProps,
  type CheckboxValue,
} from "@/components/checkbox-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type {
  CheckboxControlBooleanProps,
  CheckboxControlCustomProps,
  CheckboxControlProps,
} from "./checkbox-control-types";

/**
 * `CheckboxField` bound to the surrounding react-hook-form form. Render it inside a
 * `FormProvider`: the form holds `boolean` (or the custom values), and its validation message is
 * shown as helper text.
 */
export function CheckboxControl(props: CheckboxControlBooleanProps): ReactElement;
/** With custom values: the stored type is inferred from `checkedValue` and `uncheckedValue`. */
export function CheckboxControl<const V extends CheckboxValue>(
  props: CheckboxControlCustomProps<V>,
): ReactElement;
export function CheckboxControl<V extends CheckboxValue = boolean>({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: CheckboxControlProps<V>): ReactElement {
  const uncheckedValue = (fieldProps.uncheckedValue ?? false) as V;
  return (
    <ControlField
      componentName="CheckboxControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLButtonElement, V>(
          context,
          { onValueChange: fieldProps.onValueChange as (value: V) => void, onBlur, ref },
          uncheckedValue,
        );
        // The overloads are checked at the call site; inside, the props are the field's own union.
        const props = {
          ...fieldProps,
          ...mapped,
          disabled: mapped.disabled || disabled,
        } as unknown as CheckboxFieldProps<V>;
        const Field = CheckboxField as (props: CheckboxFieldProps<V>) => ReactElement;
        return <Field {...props} />;
      }}
    />
  );
}

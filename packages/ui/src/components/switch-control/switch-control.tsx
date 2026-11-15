import type { ReactElement } from "react";
import { SwitchField, type SwitchFieldProps, type SwitchValue } from "@/components/switch-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type {
  SwitchControlBooleanProps,
  SwitchControlCustomProps,
  SwitchControlProps,
} from "./switch-control-types";

/**
 * `SwitchField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds `boolean` (or the custom values), and its validation message is shown as helper
 * text. With `onBeforeChange`, only confirmed changes reach the form.
 */
export function SwitchControl(props: SwitchControlBooleanProps): ReactElement;
/** With custom values: the stored type is inferred from `checkedValue` and `uncheckedValue`. */
export function SwitchControl<const V extends SwitchValue>(
  props: SwitchControlCustomProps<V>,
): ReactElement;
export function SwitchControl<V extends SwitchValue = boolean>({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: SwitchControlProps<V>): ReactElement {
  const uncheckedValue = (fieldProps.uncheckedValue ?? false) as V;
  return (
    <ControlField
      componentName="SwitchControl"
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
        } as unknown as SwitchFieldProps<V>;
        const Field = SwitchField as (props: SwitchFieldProps<V>) => ReactElement;
        return <Field {...props} />;
      }}
    />
  );
}

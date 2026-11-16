import type {
  CheckboxBooleanValueProps,
  CheckboxCustomValueProps,
  CheckboxFieldBaseProps,
  CheckboxValue,
} from "@/components/checkbox-field";
import type { ControlBaseProps, DistributiveOmit, FieldTexts } from "@/internal/types";

/** Field props that come from the surrounding form instead. */
type FormOwned = "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled";

/** `CheckboxControl` storing `true` / `false`. */
export type CheckboxControlBooleanProps = ControlBaseProps &
  DistributiveOmit<CheckboxFieldBaseProps & FieldTexts & CheckboxBooleanValueProps, FormOwned>;

/** `CheckboxControl` storing custom values: pass both `checkedValue` and `uncheckedValue`. */
export type CheckboxControlCustomProps<V extends CheckboxValue> = ControlBaseProps &
  DistributiveOmit<CheckboxFieldBaseProps & FieldTexts & CheckboxCustomValueProps<V>, FormOwned>;

/**
 * Props of `CheckboxControl`: the field `name` and binding options, plus every `CheckboxField`
 * prop except the value and error, which come from the surrounding form. The form holds `boolean`,
 * or the custom values.
 */
export type CheckboxControlProps<V extends CheckboxValue = boolean> =
  | CheckboxControlBooleanProps
  | CheckboxControlCustomProps<V>;

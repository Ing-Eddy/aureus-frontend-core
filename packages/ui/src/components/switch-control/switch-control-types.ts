import type { SwitchBooleanProps, SwitchCustomProps, SwitchValue } from "@/components/switch-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/** Field props that come from the surrounding form instead. */
type FormOwned = "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled";

/** `SwitchControl` storing `true` / `false`. */
export type SwitchControlBooleanProps = ControlBaseProps &
  DistributiveOmit<SwitchBooleanProps, FormOwned>;

/** `SwitchControl` storing custom values: pass both `checkedValue` and `uncheckedValue`. */
export type SwitchControlCustomProps<V extends SwitchValue> = ControlBaseProps &
  DistributiveOmit<SwitchCustomProps<V>, FormOwned>;

/**
 * Props of `SwitchControl`: the field `name` and binding options, plus every `SwitchField` prop
 * except the value and error, which come from the surrounding form. The form holds `boolean`, or
 * the custom values; with `onBeforeChange` it only receives confirmed changes.
 */
export type SwitchControlProps<V extends SwitchValue = boolean> =
  | SwitchControlBooleanProps
  | SwitchControlCustomProps<V>;

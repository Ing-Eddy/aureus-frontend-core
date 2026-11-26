/** Values a two-state control (checkbox, switch) can report: `boolean` by default, or custom values. */
export type ToggleValue = string | number | boolean;

/** The default: the value is `true` when on and `false` when off. */
export interface ToggleBooleanValueProps {
  /** Not given: the value is `true` when on. */
  checkedValue?: undefined;
  /** Not given: the value is `false` when off. */
  uncheckedValue?: undefined;
  /** Controlled value. */
  value?: boolean;
  /** Initial value when uncontrolled. Defaults to `false`. */
  defaultValue?: boolean;
  /** Called with `true` or `false`. */
  onValueChange?: (value: boolean) => void;
}

/** Custom values: pass both, for example `"S"`/`"N"` or `1`/`0`. */
export interface ToggleCustomValueProps<V extends ToggleValue> {
  /** Value reported and stored when on. Required together with `uncheckedValue`. */
  checkedValue: V;
  /** Value reported and stored when off. Required together with `checkedValue`. */
  uncheckedValue: V;
  /** Controlled value. The control is on only when it equals `checkedValue`. */
  value?: V;
  /** Initial value when uncontrolled. Defaults to `uncheckedValue`. */
  defaultValue?: V;
  /** Called with `checkedValue` or `uncheckedValue`. */
  onValueChange?: (value: V) => void;
}

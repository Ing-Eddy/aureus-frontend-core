import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  ToggleBooleanValueProps,
  ToggleCustomValueProps,
  ToggleValue,
} from "@/internal/types";

/** Values a checkbox can report: `boolean` by default, or the custom values you choose. */
export type CheckboxValue = ToggleValue;

/** Extra parts of a checkbox field that accept classes. */
export interface CheckboxFieldClassNames extends FieldClassNames {
  /** The box. */
  checkbox?: string;
  /** The text beside the box (`checkboxLabel`). */
  checkboxLabel?: string;
  /** The row that holds the box, its text, the spinner and the action (the card with `appearance="card"`). */
  row?: string;
}

/**
 * Props every checkbox field takes. Every option is independent and opt-in, and there are no
 * default texts: a text that is not passed is not shown.
 */
export interface CheckboxFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /**
   * Text beside the box. Clicking it toggles the box and it may contain links. With `label` as
   * well, `label` names the field's group and this text names the box. No default.
   */
  checkboxLabel?: ReactNode;
  /**
   * Shows the mixed state (a dash, `aria-checked="mixed"`). Visual only: it does not change the
   * value, and activating the box reports the checked value. Defaults to `false`.
   */
  indeterminate?: boolean;
  /** Places the box before (`"start"`, the default) or after (`"end"`) its text. */
  checkboxPosition?: "start" | "end";
  /**
   * `"plain"` (the default) is the bare row. `"card"` wraps it in a bordered, clickable card that is
   * highlighted when checked.
   */
  appearance?: "plain" | "card";
  /** Name of the native checkbox, for native form submission. */
  name?: string;
  /** Id of the box. Generated when missing. */
  id?: string;
  /** Reaches the box (`button role="checkbox"`). */
  ref?: Ref<HTMLButtonElement>;
  /** Button at the end of the row. */
  action?: FieldActionProps;
  /** Called when the box loses focus. */
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  /** Accessible name of the box when there is neither `label` nor `checkboxLabel`. */
  "aria-label"?: string;
  /** Ids of the elements that name the box when there is neither `label` nor `checkboxLabel`. */
  "aria-labelledby"?: string;
  /** Extra ids describing the box. */
  "aria-describedby"?: string;
  /** Extra classes per part. */
  classNames?: CheckboxFieldClassNames;
}

/** The default: the value is `true` when checked and `false` when not. */
export type CheckboxBooleanValueProps = ToggleBooleanValueProps;

/** Custom values: pass both, for example `"S"`/`"N"` or `1`/`0`. */
export type CheckboxCustomValueProps<V extends CheckboxValue> = ToggleCustomValueProps<V>;

/**
 * Props of `CheckboxField`. The value is `boolean` unless both `checkedValue` and
 * `uncheckedValue` are given, in which case its type is inferred from them. (The component itself
 * is overloaded on the two value shapes, so callbacks are typed without annotations.)
 */
export type CheckboxFieldProps<V extends CheckboxValue = boolean> = CheckboxFieldBaseProps &
  (CheckboxBooleanValueProps | CheckboxCustomValueProps<V>);

/** `Omit` that keeps a union a union, so the value props stay both-or-neither. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

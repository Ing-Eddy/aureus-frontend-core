import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  ToggleBooleanValueProps,
  ToggleCustomValueProps,
  ToggleValue,
} from "@/internal/types";

/** Values a switch can report: `boolean` by default, or the custom values you choose. */
export type SwitchValue = ToggleValue;

/** Content for each state, such as `{ on: "Yes", off: "No" }`. Both are required. */
export interface SwitchStateContent {
  on: ReactNode;
  off: ReactNode;
}

/** Extra parts of a switch field that accept classes. */
export interface SwitchFieldClassNames extends FieldClassNames {
  /** The switch track. */
  switch?: string;
  /** The thumb. */
  thumb?: string;
  /** The text beside the switch (`switchLabel`). */
  switchLabel?: string;
  /** The decorative state label. */
  stateLabel?: string;
  /** The row (the card with `appearance="card"`). */
  row?: string;
}

/**
 * Props every switch field takes. Every option is independent and opt-in, and there are no default
 * texts: a text that is not passed is not shown. While loading, the spinner in the thumb is
 * decorative and `aria-busy` announces the state, so there is no `loadingLabel`.
 */
export interface SwitchFieldBaseProps extends Omit<FieldBaseProps, "classNames" | "loadingLabel"> {
  /**
   * Text beside the switch. Clicking it toggles the switch and it may contain links. With `label` as
   * well, `label` names the field's group and this text names the switch. No default.
   */
  switchLabel?: ReactNode;
  /** Places the switch before (`"start"`, the default) or after (`"end"`) its text. */
  switchPosition?: "start" | "end";
  /** `"plain"` (the default) or `"card"`: a bordered, clickable card highlighted when on. */
  appearance?: "plain" | "card";
  /** `"default"` or `"sm"` (smaller track; the touch target stays at least 24 px). */
  size?: "default" | "sm";
  /** Decorative text of the current state, after the switch. Both texts are required. No default. */
  stateLabels?: SwitchStateContent;
  /** Decorative icon of the current state, inside the thumb. Both icons are required. */
  thumbIcons?: SwitchStateContent;
  /** Name of the native checkbox, for native form submission. */
  name?: string;
  /** Id of the switch. Generated when missing. */
  id?: string;
  /** Reaches the switch (`button role="switch"`). */
  ref?: Ref<HTMLButtonElement>;
  /** Button at the end of the row. */
  action?: FieldActionProps;
  /** Called when the switch loses focus. */
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  /** Accessible name of the switch when there is neither `label` nor `switchLabel`. */
  "aria-label"?: string;
  /** Ids of the elements that name the switch when there is neither `label` nor `switchLabel`. */
  "aria-labelledby"?: string;
  /** Extra ids describing the switch. */
  "aria-describedby"?: string;
  /** Extra classes per part. */
  classNames?: SwitchFieldClassNames;
}

/** A guard called before every change; the change happens only if it confirms. */
export type SwitchBeforeChange<V> = (next: V) => boolean | Promise<boolean>;

/** The switch storing `true` / `false`. */
export type SwitchBooleanProps = SwitchFieldBaseProps &
  ToggleBooleanValueProps & {
    /**
     * Called with the value the switch would change to. While a returned promise is pending, the
     * switch is busy (spinner in the thumb) and ignores toggles; it changes only if the result is
     * `true`, and keeps its state on `false` or a rejection.
     */
    onBeforeChange?: SwitchBeforeChange<boolean>;
  };

/** The switch storing custom values: pass both `checkedValue` and `uncheckedValue`. */
export type SwitchCustomProps<V extends SwitchValue> = SwitchFieldBaseProps &
  ToggleCustomValueProps<V> & {
    /** Called with the value the switch would change to; see the boolean variant. */
    onBeforeChange?: SwitchBeforeChange<V>;
  };

/**
 * Props of `SwitchField`. The value is `boolean` unless both `checkedValue` and `uncheckedValue`
 * are given, in which case its type is inferred from them. (The component is overloaded on the two
 * value shapes, so callbacks are typed without annotations.)
 */
export type SwitchFieldProps<V extends SwitchValue = boolean> =
  | SwitchBooleanProps
  | SwitchCustomProps<V>;

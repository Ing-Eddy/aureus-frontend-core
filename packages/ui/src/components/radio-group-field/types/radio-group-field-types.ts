import type { FocusEvent, ReactNode, Ref } from "react";
import type { ChoiceOption, FieldBaseProps, FieldClassNames, FieldTexts } from "@/internal/types";

/** One option of a radio group: `value`, `label`, an optional `description` and `disabled`. */
export type RadioGroupOption = ChoiceOption;

/** Extra parts of a radio group that accept classes. */
export interface RadioGroupFieldClassNames extends FieldClassNames {
  /** The radiogroup (list, row, grid or segmented track). */
  options?: string;
  /** Each option row, card or segment. */
  option?: string;
  /** Each radio circle (not used by segments). */
  radio?: string;
  /** Each option's label. */
  optionLabel?: string;
  /** The text input of the other option. */
  other?: string;
}

/** An extra radio whose value is free text typed in an input that appears when it is chosen. */
export interface RadioGroupOtherOption {
  /** Names the extra radio. Required. */
  label: ReactNode;
  /** Accessible name of the text input. Required. */
  inputLabel: string;
  /** Placeholder of the text input. No default. */
  placeholder?: string;
}

/**
 * Props of `RadioGroupField`. Every option is independent and opt-in, and there are no default
 * texts: a text that is not passed is not shown.
 */
export interface RadioGroupFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** The choices, rendered in this order. */
  options: readonly RadioGroupOption[];
  /** Controlled value: the chosen option value, the other text, or `null` when nothing is chosen. */
  value?: string | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with the chosen value, the other text, or `null` (only with `deselectable`). */
  onValueChange?: (value: string | null) => void;
  /** `"vertical"` (the default) stacks the options; `"horizontal"` places them inline, wrapping. Also sets the arrow-key axis. */
  orientation?: "vertical" | "horizontal";
  /** A grid of 2 to 4 columns that collapses to one in narrow containers. Wins over `orientation`. */
  columns?: 2 | 3 | 4;
  /**
   * `"plain"` (the default); `"card"`, each option a bordered clickable card; or `"segmented"`,
   * joined segments for short choices (segments show labels only, no descriptions).
   */
  appearance?: "plain" | "card" | "segmented";
  /** Places each radio before (`"start"`, the default) or after (`"end"`) its label. Not used by segments. */
  radioPosition?: "start" | "end";
  /** Adds an extra radio with a free-text input. Its `label` and `inputLabel` are required. */
  otherOption?: RadioGroupOtherOption;
  /** Lets the checked radio be unchecked again (back to `null`). Off by default, as in standard radio groups. */
  deselectable?: boolean;
  /** Name of the native radios; the checked one submits `name=value`. */
  name?: string;
  /** Base id of the group; each radio gets `<id>-<index>`. Generated when missing. */
  id?: string;
  /** Reaches the radiogroup element. */
  ref?: Ref<HTMLDivElement>;
  /** Called when focus leaves the group. */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  /** Accessible name of the group when there is no `label`. */
  "aria-label"?: string;
  /** Ids of the elements that name the group when there is no `label`. */
  "aria-labelledby"?: string;
  /** Extra ids describing the group. */
  "aria-describedby"?: string;
  /** Extra classes per part. */
  classNames?: RadioGroupFieldClassNames;
}

/**
 * Props of `RadioGroupField`. `loading` requires `loadingLabel` and `info` requires `infoLabel`; no text
 * is generated.
 */
export type RadioGroupFieldProps = RadioGroupFieldBaseProps & FieldTexts;

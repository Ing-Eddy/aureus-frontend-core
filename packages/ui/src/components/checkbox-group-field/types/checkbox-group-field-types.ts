import type { FocusEvent, ReactNode, Ref } from "react";
import type { FieldBaseProps, FieldClassNames, FieldTexts } from "@/internal/types";
import type { CheckboxGroupOption } from "./checkbox-group-option-types";

/** Extra parts of a checkbox group that accept classes. */
export interface CheckboxGroupFieldClassNames extends FieldClassNames {
  /** The container of the options (list, row or grid). */
  options?: string;
  /** Each option row (each card with `appearance="card"`). */
  option?: string;
  /** Each box. */
  checkbox?: string;
  /** Each option's label. */
  optionLabel?: string;
  /** The select-all row. */
  selectAll?: string;
}

/**
 * Props of `CheckboxGroupField`. Every option is independent and opt-in, and there are no default
 * texts: a text that is not passed is not shown.
 */
export interface CheckboxGroupFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** The choices, rendered in this order. */
  options: readonly CheckboxGroupOption[];
  /** Controlled value: the checked option values. */
  value?: string[];
  /** Initial value when uncontrolled. Defaults to `[]`. */
  defaultValue?: string[];
  /** Called with the checked values, always in the order of `options`. */
  onValueChange?: (value: string[]) => void;
  /**
   * Adds a parent box before the options that checks or unchecks every enabled option. Its
   * `label` is required. Disabled options and `maxSelected` are respected.
   */
  selectAll?: { label: ReactNode };
  /** Maximum number of checked options. At the limit the unchecked options are disabled. */
  maxSelected?: number;
  /** Shown while the limit is reached, in a status region. No default. */
  maxSelectedMessage?: ReactNode;
  /** `"vertical"` (the default) stacks the options; `"horizontal"` places them inline, wrapping. */
  orientation?: "vertical" | "horizontal";
  /** A grid of 2 to 4 columns that collapses to one in narrow containers. Wins over `orientation`. */
  columns?: 2 | 3 | 4;
  /** `"plain"` (the default) or `"card"`: each option is a bordered, clickable card. */
  appearance?: "plain" | "card";
  /** Places each box before (`"start"`, the default) or after (`"end"`) its label. */
  checkboxPosition?: "start" | "end";
  /** Name of the native checkboxes; each checked box submits `name=value`. */
  name?: string;
  /** Base id of the group; each box gets `<id>-<index>`. Generated when missing. */
  id?: string;
  /** Reaches the container of the options. */
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
  classNames?: CheckboxGroupFieldClassNames;
}

/**
 * Props of `CheckboxGroupField`. `loading` requires `loadingLabel` and `info` requires `infoLabel`; no text
 * is generated.
 */
export type CheckboxGroupFieldProps = CheckboxGroupFieldBaseProps & FieldTexts;

import type { ReactNode } from "react";

/** One choice of a select field. */
export interface SelectOption {
  /** Unique id stored as the value. */
  value: string;
  /** Text shown in the list and in the field; also used for search and typeahead. */
  label: string;
  /** Secondary line under the label. */
  description?: ReactNode;
  /** Icon before the label. */
  icon?: ReactNode;
  /** The option is shown but cannot be chosen. */
  disabled?: boolean;
  /** Title of the group the option belongs to. Groups keep their order of first appearance. */
  group?: string;
}

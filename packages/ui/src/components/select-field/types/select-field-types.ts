import type { FocusEvent, ReactNode, Ref } from "react";
import type { FieldActionProps, FieldBaseProps, FieldClassNames } from "@/internal/types";
import type { SelectOption } from "./select-option-types";

/** Extra parts of a select field that accept classes. */
export interface SelectFieldClassNames extends FieldClassNames {
  /** The button that opens the list. */
  trigger?: string;
  /** The floating list container. */
  popup?: string;
  /** Each option row. */
  option?: string;
  /** Each chip (multiple, chips display). */
  chip?: string;
}

/**
 * Props every select field takes. There are no default texts: a message that is not passed is
 * not shown.
 */
export interface SelectFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** The choices. */
  options: readonly SelectOption[];
  /** Text shown in the field while nothing is selected. No default. */
  placeholder?: ReactNode;
  /** Text shown in the open list when `options` is empty. No default. */
  emptyMessage?: ReactNode;
  /** Closes the list after a pick. Defaults to `true` for single and `false` for multiple. */
  closeOnSelect?: boolean;
  /** Name of the hidden input, for native form submission. */
  name?: string;
  /** Id of the field's button (the labelled control). Generated when missing. */
  id?: string;
  /** Reaches the field's button. */
  ref?: Ref<HTMLButtonElement>;
  /** Button inside the frame, before the clear button and the chevron. */
  action?: FieldActionProps;
  /** Called when the field's button loses focus while the list is closed. */
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra ids describing the field. */
  "aria-describedby"?: string;
  /** Extra classes per part. */
  classNames?: SelectFieldClassNames;
}

/** Single selection: the value is one option id, or `null`. */
export interface SelectSingleProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  multipleDisplay?: never;
  removeChipLabel?: never;
  renderSummary?: never;
  maxSelected?: never;
  maxSelectedMessage?: never;
  selectAll?: never;
}

interface SelectMultipleCommon {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Most options that can be selected. Unselected options are disabled at the limit. */
  maxSelected?: number;
  /** Text shown above the list once `maxSelected` is reached. No default. */
  maxSelectedMessage?: ReactNode;
  /** Adds an option at the top that selects every enabled option (or none). */
  selectAll?: { label: ReactNode };
}

/** Multiple selection shown as removable chips. `removeChipLabel` names each remove button. */
export interface SelectMultipleChipsProps extends SelectMultipleCommon {
  multipleDisplay: "chips";
  /** Accessible name of a chip's remove button, e.g. `(o) => \`Remove ${o.label}\``. Required. */
  removeChipLabel: (option: SelectOption) => string;
  renderSummary?: never;
}

/** Multiple selection shown as one line of text from `renderSummary`. */
export interface SelectMultipleSummaryProps extends SelectMultipleCommon {
  multipleDisplay: "summary";
  /** Content of the field for the selected options. Required. */
  renderSummary: (selected: SelectOption[]) => ReactNode;
  removeChipLabel?: never;
}

export type SelectSelectionProps =
  | SelectSingleProps
  | SelectMultipleChipsProps
  | SelectMultipleSummaryProps;

/** No search box. */
export interface SelectNoSearchProps {
  searchable?: false;
  searchLabel?: never;
  searchPlaceholder?: never;
  filter?: never;
  onSearchChange?: never;
  noResultsMessage?: never;
  optionsLoading?: never;
  optionsLoadingMessage?: never;
  creatable?: never;
  createLabel?: never;
  onCreate?: never;
}

interface SelectSearchCommon {
  /** Shows a search box above the list. */
  searchable: true;
  /** Accessible name of the search box. Required. */
  searchLabel: string;
  /** Hint inside the search box. */
  searchPlaceholder?: string;
  /** Filters options by label, ignoring case and accents. Defaults to `true`; `false` for server search. */
  filter?: boolean;
  /** Called whenever the search text changes. */
  onSearchChange?: (query: string) => void;
  /** Text shown when the search matches no option. No default. */
  noResultsMessage?: ReactNode;
  /** Options are being loaded (server search). */
  optionsLoading?: boolean;
  /** Text shown while `optionsLoading`. No default. */
  optionsLoadingMessage?: ReactNode;
}

export interface SelectSearchProps extends SelectSearchCommon {
  creatable?: false;
  createLabel?: never;
  onCreate?: never;
}

/** Search that can offer to create the typed value. */
export interface SelectCreatableProps extends SelectSearchCommon {
  creatable: true;
  /** Content of the "create" option for the typed text. Required. */
  createLabel: (query: string) => ReactNode;
  /** Called with the typed text when the "create" option is picked. Required. */
  onCreate: (query: string) => void;
}

export type SelectSearchFeatureProps =
  | SelectNoSearchProps
  | SelectSearchProps
  | SelectCreatableProps;

/** No clear button. */
export interface SelectNoClearProps {
  clearable?: false;
  clearLabel?: never;
}

/** A button that empties the field. */
export interface SelectClearProps {
  clearable: true;
  /** Accessible name of the clear button. Required. */
  clearLabel: string;
}

export type SelectClearFeatureProps = SelectNoClearProps | SelectClearProps;

/**
 * Props of `SelectField`. Features that need a text (search, clear, chips, summary, select all,
 * create) require it when they are enabled.
 */
export type SelectFieldProps = SelectFieldBaseProps &
  SelectSelectionProps &
  SelectSearchFeatureProps &
  SelectClearFeatureProps;

/** `Omit` that keeps a union a union. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

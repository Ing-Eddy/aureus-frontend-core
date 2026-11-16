import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  FieldTexts,
} from "@/internal/types";
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
  /** Accessible name of the field's button and list, for a select without a visible `label`. */
  "aria-label"?: string;
  /** Id of an element that names the field's button and list, instead of `label`. */
  "aria-labelledby"?: string;
  /** Extra classes per part. */
  classNames?: SelectFieldClassNames;
}

/** Single selection: the value is one option id, or `null`. */
export interface SelectSingleProps {
  /** Allows several options to be selected. Defaults to `false`. */
  multiple?: false;
  /** Controlled value: the selected option's `value`, or `null` for none. */
  value?: string | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with the new value when the user picks or clears an option. */
  onValueChange?: (value: string | null) => void;
  /** Only allowed with `multiple`. */
  multipleDisplay?: never;
  /** Only allowed with `multipleDisplay="chips"`. */
  removeChipLabel?: never;
  /** Only allowed with `multipleDisplay="summary"`. */
  renderSummary?: never;
  /** Only allowed with `multiple`. */
  maxSelected?: never;
  /** Only allowed with `multiple`. */
  maxSelectedMessage?: never;
  /** Only allowed with `multiple`. */
  selectAll?: never;
}

interface SelectMultipleCommon {
  /** Allows several options to be selected. Requires `multipleDisplay`. */
  multiple: true;
  /** Controlled value: the selected options' values, in selection order. */
  value?: string[];
  /** Initial value when uncontrolled. Defaults to `[]`. */
  defaultValue?: string[];
  /** Called with the new value whenever an option is added or removed. */
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
  /** Shows each selected option as a removable chip in the field. */
  multipleDisplay: "chips";
  /** Accessible name of a chip's remove button, e.g. `(o) => \`Remove ${o.label}\``. Required. */
  removeChipLabel: (option: SelectOption) => string;
  /** Only allowed with `multipleDisplay="summary"`. */
  renderSummary?: never;
}

/** Multiple selection shown as one line of text from `renderSummary`. */
export interface SelectMultipleSummaryProps extends SelectMultipleCommon {
  /** Shows the selection as one line of text from `renderSummary`. */
  multipleDisplay: "summary";
  /** Content of the field for the selected options. Required. */
  renderSummary: (selected: SelectOption[]) => ReactNode;
  /** Only allowed with `multipleDisplay="chips"`. */
  removeChipLabel?: never;
}

/** Single or multiple selection, and how a multiple selection is shown. */
export type SelectSelectionProps =
  | SelectSingleProps
  | SelectMultipleChipsProps
  | SelectMultipleSummaryProps;

/** No search box. */
export interface SelectNoSearchProps {
  /** Shows a search box above the list. Defaults to `false`. */
  searchable?: false;
  /** Only allowed with `searchable`. */
  searchLabel?: never;
  /** Only allowed with `searchable`. */
  searchPlaceholder?: never;
  /** Only allowed with `searchable`. */
  filter?: never;
  /** Only allowed with `searchable`. */
  onSearchChange?: never;
  /** Only allowed with `searchable`. */
  noResultsMessage?: never;
  /** Only allowed with `searchable`. */
  optionsLoading?: never;
  /** Only allowed with `searchable`. */
  optionsLoadingMessage?: never;
  /** Only allowed with `searchable`. */
  creatable?: never;
  /** Only allowed with `creatable`. */
  createLabel?: never;
  /** Only allowed with `creatable`. */
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

/** Search without the option to create values. */
export interface SelectSearchProps extends SelectSearchCommon {
  /** Offers to create the typed value when no option matches it. Defaults to `false`. */
  creatable?: false;
  /** Only allowed with `creatable`. */
  createLabel?: never;
  /** Only allowed with `creatable`. */
  onCreate?: never;
}

/** Search that can offer to create the typed value. */
export interface SelectCreatableProps extends SelectSearchCommon {
  /** Offers to create the typed value. Requires `createLabel` and `onCreate`. */
  creatable: true;
  /** Content of the "create" option for the typed text. Required. */
  createLabel: (query: string) => ReactNode;
  /** Called with the typed text when the "create" option is picked. Required. */
  onCreate: (query: string) => void;
}

/** The search box and the option to create values. */
export type SelectSearchFeatureProps =
  | SelectNoSearchProps
  | SelectSearchProps
  | SelectCreatableProps;

/** No clear button. */
export interface SelectNoClearProps {
  /** Shows a button that empties the field. Defaults to `false`. */
  clearable?: false;
  /** Only allowed with `clearable`. */
  clearLabel?: never;
}

/** A button that empties the field. */
export interface SelectClearProps {
  /** Shows a button that empties the field while it has a value. Requires `clearLabel`. */
  clearable: true;
  /** Accessible name of the clear button. Required. */
  clearLabel: string;
}

/** The clear button. */
export type SelectClearFeatureProps = SelectNoClearProps | SelectClearProps;

/**
 * Props of `SelectField`. Features that need a text (loading, info, search, clear, chips,
 * summary, select all, create) require it when they are enabled.
 */
export type SelectFieldProps = SelectFieldBaseProps &
  FieldTexts &
  SelectSelectionProps &
  SelectSearchFeatureProps &
  SelectClearFeatureProps;

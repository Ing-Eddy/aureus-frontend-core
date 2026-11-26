import type { MissingTextCheck } from "@/internal/hooks";

/** The feature props of a select and the texts each needs. */
export interface FeatureTexts {
  /** The search box is on. */
  searchable?: boolean;
  /** Name of the search box. */
  searchLabel?: unknown;
  /** The clear button is on. */
  clearable?: boolean;
  /** Name of the clear button. */
  clearLabel?: unknown;
  /** Multiple selection. */
  multiple?: boolean;
  /** `"chips"` or `"summary"`. */
  multipleDisplay?: unknown;
  /** Name of a chip's remove button. */
  removeChipLabel?: unknown;
  /** Content of the summary. */
  renderSummary?: unknown;
  /** The select-all option. */
  selectAll?: {
    /** Its text. */
    label?: unknown;
  };
  /** Creating values is on. */
  creatable?: boolean;
  /** Content of the create option. */
  createLabel?: unknown;
  /** Handler of the create option. */
  onCreate?: unknown;
}

/**
 * The select's feature checks: each enabled feature without its required text. TypeScript
 * already requires these texts; the checks feed the development warnings for untyped code.
 */
export function selectTextChecks(props: FeatureTexts): MissingTextCheck[] {
  const chips = props.multiple && props.multipleDisplay === "chips";
  const summary = props.multiple && props.multipleDisplay === "summary";
  return [
    [props.searchable && !props.searchLabel, "`searchable` needs `searchLabel`"],
    [props.clearable && !props.clearLabel, "`clearable` needs `clearLabel`"],
    [
      props.multiple && !props.multipleDisplay,
      '`multiple` needs `multipleDisplay` ("chips" or "summary")',
    ],
    [chips && !props.removeChipLabel, '`multipleDisplay="chips"` needs `removeChipLabel`'],
    [summary && !props.renderSummary, '`multipleDisplay="summary"` needs `renderSummary`'],
    [props.selectAll && !props.selectAll.label, "`selectAll` needs `selectAll.label`"],
    [props.creatable && !props.searchable, "`creatable` needs `searchable`"],
    [
      props.creatable && (!props.createLabel || !props.onCreate),
      "`creatable` needs `createLabel` and `onCreate`",
    ],
  ];
}

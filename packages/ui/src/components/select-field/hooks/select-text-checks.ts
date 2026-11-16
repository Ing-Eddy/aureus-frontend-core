import type { MissingTextCheck } from "@/internal/hooks";

export interface FeatureTexts {
  searchable?: boolean;
  searchLabel?: unknown;
  clearable?: boolean;
  clearLabel?: unknown;
  multiple?: boolean;
  multipleDisplay?: unknown;
  removeChipLabel?: unknown;
  renderSummary?: unknown;
  selectAll?: { label?: unknown };
  creatable?: boolean;
  createLabel?: unknown;
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

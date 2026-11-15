import { useEffect } from "react";
import { isDev } from "@/internal/utils/constants";

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

/** The problems of a set of feature props: each enabled feature without its required text. */
export function missingTexts(props: FeatureTexts): string[] {
  const problems: string[] = [];
  if (props.searchable && !props.searchLabel) problems.push("`searchable` needs `searchLabel`");
  if (props.clearable && !props.clearLabel) problems.push("`clearable` needs `clearLabel`");
  if (props.multiple && !props.multipleDisplay) {
    problems.push('`multiple` needs `multipleDisplay` ("chips" or "summary")');
  }
  if (props.multiple && props.multipleDisplay === "chips" && !props.removeChipLabel) {
    problems.push('`multipleDisplay="chips"` needs `removeChipLabel`');
  }
  if (props.multiple && props.multipleDisplay === "summary" && !props.renderSummary) {
    problems.push('`multipleDisplay="summary"` needs `renderSummary`');
  }
  if (props.selectAll && !props.selectAll.label)
    problems.push("`selectAll` needs `selectAll.label`");
  if (props.creatable && !props.searchable) problems.push("`creatable` needs `searchable`");
  if (props.creatable && (!props.createLabel || !props.onCreate)) {
    problems.push("`creatable` needs `createLabel` and `onCreate`");
  }
  return problems;
}

/**
 * Development warnings for untyped usage: TypeScript already requires these texts, and this
 * catches JavaScript callers. Each problem is reported once.
 */
export function useMissingTextWarnings(componentName: string, props: FeatureTexts) {
  const key = missingTexts(props).join("|");
  useEffect(() => {
    if (!isDev || !key) return;
    for (const problem of key.split("|")) console.warn(`${componentName}: ${problem}.`);
  }, [componentName, key]);
}

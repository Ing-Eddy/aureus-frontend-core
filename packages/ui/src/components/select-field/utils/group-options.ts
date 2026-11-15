import type { SelectOption } from "../types";

export interface OptionGroup {
  /** Group title, or `undefined` for options without a group. */
  title?: string;
  options: SelectOption[];
}

/** Groups options by `group`: ungrouped options first, then groups in order of first appearance. */
export function groupOptions(options: readonly SelectOption[]): OptionGroup[] {
  const ungrouped: SelectOption[] = [];
  const groups = new Map<string, SelectOption[]>();
  for (const option of options) {
    if (option.group === undefined) {
      ungrouped.push(option);
      continue;
    }
    const list = groups.get(option.group);
    if (list) list.push(option);
    else groups.set(option.group, [option]);
  }
  const result: OptionGroup[] = ungrouped.length ? [{ options: ungrouped }] : [];
  for (const [title, list] of groups) result.push({ title, options: list });
  return result;
}

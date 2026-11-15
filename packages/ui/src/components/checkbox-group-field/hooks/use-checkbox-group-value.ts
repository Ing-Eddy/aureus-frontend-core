import { useCallback, useEffect, useMemo, useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import { isDev } from "@/internal/utils/constants";
import type { CheckboxGroupOption } from "../types";

export type CheckboxGroupSelectAllState = "all" | "some" | "none";

export interface UseCheckboxGroupValueOptions {
  options: readonly CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  maxSelected?: number;
  /** Name used in development warnings. */
  componentName: string;
}

/**
 * The checkbox group value: controlled or uncontrolled, always reported in the order of `options`
 * (unknown values kept at the end), with the selection limit and "select all".
 */
export function useCheckboxGroupValue({
  options,
  value,
  defaultValue,
  onValueChange,
  maxSelected,
  componentName,
}: UseCheckboxGroupValueOptions) {
  const [raw, setRaw] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const selected = raw ?? [];

  const known = useMemo(() => new Set(options.map((option) => option.value)), [options]);
  const enabled = useMemo(
    () => options.filter((option) => !option.disabled).map((option) => option.value),
    [options],
  );

  /** Known ids in options order, then unknown ids in their original order. */
  const normalize = useCallback(
    (ids: readonly string[]) => {
      const set = new Set(ids);
      return [
        ...options.map((option) => option.value).filter((id) => set.has(id)),
        ...ids.filter((id) => !known.has(id)),
      ];
    },
    [options, known],
  );

  const set = useCallback((ids: readonly string[]) => setRaw(normalize(ids)), [setRaw, normalize]);

  const isChecked = useCallback((id: string) => selected.includes(id), [selected]);
  const atLimit = maxSelected !== undefined && selected.length >= maxSelected;
  const isLocked = (option: CheckboxGroupOption) =>
    Boolean(option.disabled) || (atLimit && !selected.includes(option.value));

  const toggle = useCallback(
    (id: string, checked: boolean) =>
      set(checked ? [...selected, id] : selected.filter((item) => item !== id)),
    [selected, set],
  );

  const selectAllState: CheckboxGroupSelectAllState = useMemo(() => {
    const count = enabled.filter((id) => selected.includes(id)).length;
    if (enabled.length > 0 && count === enabled.length) return "all";
    return count === 0 ? "none" : "some";
  }, [enabled, selected]);

  /** From "all", or at the limit, clears the enabled options; otherwise adds them up to the limit. */
  const toggleAll = useCallback(() => {
    if (selectAllState === "all" || atLimit) {
      set(selected.filter((id) => !enabled.includes(id)));
      return;
    }
    const next = [...selected];
    for (const id of enabled) {
      if (maxSelected !== undefined && next.length >= maxSelected) break;
      if (!next.includes(id)) next.push(id);
    }
    set(next);
  }, [selectAllState, atLimit, selected, enabled, maxSelected, set]);

  // Values that match no option are kept (options may arrive later) and named once in development.
  const warned = useRef(new Set<string>());
  const unknownKey = selected.filter((id) => !known.has(id)).join("\u0000");
  useEffect(() => {
    if (!isDev || !unknownKey) return;
    for (const id of unknownKey.split("\u0000")) {
      if (warned.current.has(id)) continue;
      warned.current.add(id);
      console.warn(`${componentName}: the value "${id}" matches no option; it is kept.`);
    }
  }, [componentName, unknownKey]);

  return { selected, isChecked, isLocked, atLimit, toggle, set, selectAllState, toggleAll };
}

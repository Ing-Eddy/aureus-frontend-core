import { useCallback, useMemo } from "react";
import { useControllableState } from "@/internal/hooks";
import type { SelectOption } from "../types";
import { isSentinel } from "./sentinels";

/** Options of `useSelectValue`. */
export interface UseSelectValueOptions {
  /** Multiple selection. */
  multiple: boolean;
  /** Every option. */
  options: readonly SelectOption[];
  /** Controlled value. */
  value?: string | null | string[];
  /** Initial value when uncontrolled. */
  defaultValue?: string | null | string[];
  /** Called with every requested change. */
  onValueChange?: (value: string | null | string[]) => void;
  /** Most selected options. No default. */
  maxSelected?: number;
}

/** Whether all, some or none of the enabled options are selected. */
export type SelectAllState = "all" | "some" | "none";

/**
 * Selection state for single (`string | null`) and multiple (`string[]`) selects, with the
 * selected options resolved (unknown ids are kept as `{ value: id, label: id }`), limits and
 * select all.
 */
export function useSelectValue({
  multiple,
  options,
  value,
  defaultValue,
  onValueChange,
  maxSelected,
}: UseSelectValueOptions) {
  const empty = multiple ? [] : null;
  const [raw, setRaw] = useControllableState<string | null | string[]>({
    value,
    defaultValue: defaultValue ?? empty,
    onChange: onValueChange,
  });

  const selectedIds = useMemo<string[]>(() => {
    if (multiple) return Array.isArray(raw) ? raw : [];
    return typeof raw === "string" ? [raw] : [];
  }, [multiple, raw]);

  const byId = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
  const selectedOptions = useMemo(
    () => selectedIds.map((id) => byId.get(id) ?? { value: id, label: id }),
    [selectedIds, byId],
  );

  const canSelectMore = maxSelected === undefined || selectedIds.length < maxSelected;
  const enabledIds = useMemo(
    () => options.filter((option) => !option.disabled).map((option) => option.value),
    [options],
  );

  const selectAllState: SelectAllState = useMemo(() => {
    const selectedEnabled = enabledIds.filter((id) => selectedIds.includes(id)).length;
    if (enabledIds.length > 0 && selectedEnabled === enabledIds.length) return "all";
    if (selectedEnabled === 0) return "none";
    return "some";
  }, [enabledIds, selectedIds]);

  const set = useCallback(
    (ids: string[]) => {
      const clean = ids.filter((id) => !isSentinel(id));
      setRaw(multiple ? clean : (clean[0] ?? null));
    },
    [multiple, setRaw],
  );

  /** Every enabled option (up to `maxSelected`), or none when all are already selected. */
  const toggleAll = useCallback(() => {
    if (selectAllState === "all") {
      set(selectedIds.filter((id) => !enabledIds.includes(id)));
      return;
    }
    const next = [...selectedIds];
    for (const id of enabledIds) {
      if (maxSelected !== undefined && next.length >= maxSelected) break;
      if (!next.includes(id)) next.push(id);
    }
    set(next);
  }, [selectAllState, selectedIds, enabledIds, maxSelected, set]);

  return {
    raw,
    selectedIds,
    selectedOptions,
    canSelectMore,
    selectAllState,
    set,
    toggleAll,
    remove: useCallback(
      (id: string) => set(selectedIds.filter((s) => s !== id)),
      [selectedIds, set],
    ),
    removeLast: useCallback(() => set(selectedIds.slice(0, -1)), [selectedIds, set]),
    clear: useCallback(() => set([]), [set]),
  };
}

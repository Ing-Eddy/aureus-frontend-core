import { useEffect, useMemo, useRef } from "react";
import { isDev } from "@/internal/utils/constants";
import type { SelectOption } from "../types";
import { groupOptions, normalizeText } from "../utils";
import { CREATE_ID, SELECT_ALL_ID } from "./sentinels";

/** A row of the list: a real option, or one of the synthetic rows. */
export type ListRow =
  | {
      /** An option, the select-all row or the create row. */
      kind: "option";
      /** The option shown. */
      option: SelectOption;
      /** Disabled by itself or by the selection limit. */
      disabled: boolean;
    }
  | { kind: "select-all" }
  | {
      kind: "create";
      /** The trimmed search text that would be created. */
      query: string;
    };

/** A group of rows; `title` is shown as a heading when present. */
export interface ListGroup {
  /** Stable key of the group. */
  key: string;
  /** Heading; none for ungrouped and synthetic rows. */
  title?: string;
  /** The rows of the group, in order. */
  rows: ListRow[];
}

/** Options of `useSelectOptions`. */
export interface UseSelectOptionsOptions {
  /** Every option. */
  options: readonly SelectOption[];
  /** The search text. */
  query: string;
  /** Whether the search filters the options here (not for server search). */
  filter: boolean;
  /** Whether a create row is offered. */
  creatable: boolean;
  /** Whether the select-all row is offered. */
  selectAll: boolean;
  /** Multiple selection. */
  multiple: boolean;
  /** The selected values. */
  selectedIds: string[];
  /** Most selected options. No default. */
  maxSelected?: number;
}

/**
 * The list to render: options filtered by the search (case and accents ignored), disabled at the
 * selection limit, grouped, plus the select-all row first and the create row last.
 */
export function useSelectOptions({
  options,
  query,
  filter,
  creatable,
  selectAll,
  multiple,
  selectedIds,
  maxSelected,
}: UseSelectOptionsOptions) {
  const normalizedQuery = normalizeText(query.trim());

  const filtered = useMemo(
    () =>
      filter && normalizedQuery
        ? options.filter((option) => normalizeText(option.label).includes(normalizedQuery))
        : options,
    [options, filter, normalizedQuery],
  );

  const atLimit = multiple && maxSelected !== undefined && selectedIds.length >= maxSelected;

  const showCreate =
    creatable &&
    normalizedQuery !== "" &&
    !options.some((option) => normalizeText(option.label) === normalizedQuery);

  const groups = useMemo<ListGroup[]>(() => {
    const result: ListGroup[] = [];
    if (selectAll && multiple && options.length > 0 && !normalizedQuery) {
      result.push({ key: SELECT_ALL_ID, rows: [{ kind: "select-all" }] });
    }
    for (const group of groupOptions(filtered)) {
      result.push({
        key: group.title ?? "\u0000ungrouped",
        title: group.title,
        rows: group.options.map((option) => ({
          kind: "option" as const,
          option,
          disabled: Boolean(option.disabled) || (atLimit && !selectedIds.includes(option.value)),
        })),
      });
    }
    if (showCreate)
      result.push({ key: CREATE_ID, rows: [{ kind: "create", query: query.trim() }] });
    return result;
  }, [
    selectAll,
    multiple,
    options.length,
    normalizedQuery,
    filtered,
    atLimit,
    selectedIds,
    showCreate,
    query,
  ]);

  // Warn once per id about values that are not among the options (yet).
  const warned = useRef(new Set<string>());
  useEffect(() => {
    if (!isDev) return;
    const known = new Set(options.map((option) => option.value));
    for (const id of selectedIds) {
      if (!known.has(id) && !warned.current.has(id)) {
        warned.current.add(id);
        console.warn(`SelectField: the value "${id}" matches no option; it is kept.`);
      }
    }
  }, [options, selectedIds]);

  return {
    groups,
    atLimit,
    isEmpty: options.length === 0,
    noResults: normalizedQuery !== "" && filtered.length === 0,
  };
}

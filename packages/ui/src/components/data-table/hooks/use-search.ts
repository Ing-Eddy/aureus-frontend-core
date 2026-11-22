import { type RefObject, useCallback, useEffect } from "react";
import type { DataTableSearchOptions } from "../types";
import type { DataTableState } from "./use-table-state";

/**
 * The search box (design decision 4): the input value is a draft; the applied query (the client
 * filter and `onSearch`) changes on submit, or after `debounceMs` with `trigger: "change"`.
 */
export function useSearch(
  search: DataTableSearchOptions | undefined,
  state: DataTableState,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const { searchValue, setSearchValue, query, setQuery } = state;
  const onSearch = search?.onSearch;

  const apply = useCallback(
    (raw: string) => {
      const next = raw.trim();
      setQuery(next);
      onSearch?.(next);
    },
    [setQuery, onSearch],
  );

  const liveDelay = search?.trigger === "change" ? (search.debounceMs ?? 0) : undefined;
  useEffect(() => {
    if (liveDelay === undefined || searchValue.trim() === query) return;
    const timer = setTimeout(() => apply(searchValue), liveDelay);
    return () => clearTimeout(timer);
  }, [liveDelay, searchValue, query, apply]);

  const submit = useCallback(() => apply(searchValue), [apply, searchValue]);
  const clear = useCallback(() => {
    setSearchValue("");
    apply("");
    inputRef.current?.focus();
  }, [setSearchValue, apply, inputRef]);

  return { value: searchValue, setValue: setSearchValue, submit, clear };
}

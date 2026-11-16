import { useCallback, useMemo, useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import type { FileItem } from "../types";
import { toFileList } from "../utils";

/** A file field's value: one item or `null` without `multiple`, an array with it. */
export type FileValue<E> = FileItem<E> | FileItem<E>[] | null;

export interface UseFileItemsOptions<E> {
  multiple: boolean;
  value?: FileValue<E>;
  defaultValue?: FileValue<E>;
  onValueChange?: (value: FileValue<E>) => void;
}

/**
 * The items of a file field as a list, whatever the value's shape, and the operations on them.
 * Every operation reads the latest list (not the last render's), so several changes in a row,
 * such as two uploads finishing together, never overwrite each other.
 */
export function useFileItems<E>({
  multiple,
  value,
  defaultValue,
  onValueChange,
}: UseFileItemsOptions<E>) {
  const [current, setCurrent] = useControllableState<FileValue<E>>({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange: onValueChange,
  });
  const items = useMemo(() => toFileList(current), [current]);

  const latest = useRef(items);
  const seen = useRef(current);
  if (seen.current !== current) {
    seen.current = current;
    latest.current = items;
  }

  const commit = useCallback(
    (next: FileItem<E>[]) => {
      latest.current = next;
      setCurrent(multiple ? next : (next[0] ?? null));
    },
    [multiple, setCurrent],
  );

  /** Appends the items with `multiple`; otherwise the first one replaces the current item. */
  const add = useCallback(
    (added: FileItem<E>[]) => {
      if (added.length === 0) return;
      commit(multiple ? [...latest.current, ...added] : added.slice(0, 1));
    },
    [commit, multiple],
  );

  const remove = useCallback(
    (id: string) => {
      if (!latest.current.some((item) => item.id === id)) return;
      commit(latest.current.filter((item) => item.id !== id));
    },
    [commit],
  );

  /** Puts `item` in the place of the item with `id`. Does nothing if that item is gone. */
  const replace = useCallback(
    (id: string, item: FileItem<E>) => {
      if (!latest.current.some((current) => current.id === id)) return;
      commit(latest.current.map((current) => (current.id === id ? item : current)));
    },
    [commit],
  );

  const move = useCallback(
    (from: number, to: number) => {
      const list = [...latest.current];
      if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
      const [moved] = list.splice(from, 1);
      if (moved) list.splice(to, 0, moved);
      commit(list);
    },
    [commit],
  );

  return { items, add, remove, replace, move };
}

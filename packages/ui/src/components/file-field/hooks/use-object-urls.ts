import { useEffect, useRef, useState } from "react";
import type { FileItem } from "../types";

/**
 * Preview URLs for the new image items, by item id. Each URL is created once and released when
 * its item leaves the list or the field unmounts, so previews never leak memory.
 */
export function useObjectUrls<E>(items: readonly FileItem<E>[]): ReadonlyMap<string, string> {
  const owned = useRef(new Map<string, string>());
  const [snapshot, setSnapshot] = useState<ReadonlyMap<string, string>>(() => new Map());

  useEffect(() => {
    const urls = owned.current;
    const wanted = new Set<string>();
    let changed = false;
    for (const item of items) {
      if (item.kind !== "new" || !item.file.type.startsWith("image/")) continue;
      wanted.add(item.id);
      if (!urls.has(item.id)) {
        urls.set(item.id, URL.createObjectURL(item.file));
        changed = true;
      }
    }
    for (const [id, url] of urls) {
      if (wanted.has(id)) continue;
      URL.revokeObjectURL(url);
      urls.delete(id);
      changed = true;
    }
    if (changed) setSnapshot(new Map(urls));
  }, [items]);

  useEffect(() => {
    const urls = owned.current;
    return () => {
      for (const url of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  return snapshot;
}

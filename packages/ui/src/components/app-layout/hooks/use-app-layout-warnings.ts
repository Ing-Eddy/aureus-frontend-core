import { type MissingTextCheck, useMissingTexts } from "@/internal/hooks";
import type { AppLayoutNavEntry } from "../types";

/** Development warnings of a layout part, each starting with `AppLayout:` and logged once. */
export function useAppLayoutWarnings(checks: readonly MissingTextCheck[]) {
  useMissingTexts("AppLayout", checks);
}

/** The ids used more than once in a navigation configuration, sub-items included. */
export function duplicateNavIds(entries: readonly AppLayoutNavEntry[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  };
  for (const entry of entries) {
    visit(entry.id);
    if (entry.type === "group") {
      for (const child of entry.items) {
        visit(child.id);
        if (child.type === "submenu") for (const sub of child.items) visit(sub.id);
      }
    } else if (entry.type === "submenu") {
      for (const sub of entry.items) visit(sub.id);
    }
  }
  return [...duplicates];
}

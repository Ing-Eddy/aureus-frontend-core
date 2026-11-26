import type { FileItem } from "../types";
import { toFileList } from "./file-guards";

/** A file field's value in any of its shapes. */
type FileValue<E> = FileItem<E> | readonly FileItem<E>[] | null | undefined;

/** What changed between the initial value of a file field and its current value. */
export interface FileChanges<E> {
  /** Files picked in this session. */
  added: File[];
  /** Stored files still present. */
  kept: E[];
  /** Stored files of the initial value that are gone. */
  removed: E[];
}

/**
 * Compares the initial value (for example the form's `defaultValues`) with the current one, by
 * item id, so an update form sends only what changed.
 *
 * ```ts
 * const { added, removed } = diffFiles<Attachment>(invoice.attachments, values.attachments);
 * await save({ upload: added, delete: removed.map((file) => file.id) });
 * ```
 */
export function diffFiles<E>(initial: FileValue<E>, current: FileValue<E>): FileChanges<E> {
  const currentItems = toFileList(current);
  const currentIds = new Set(currentItems.map((item) => item.id));
  const added: File[] = [];
  const kept: E[] = [];
  for (const item of currentItems) {
    if (item.kind === "new") added.push(item.file);
    else kept.push(item.data);
  }
  const removed = toFileList(initial).flatMap((item) =>
    item.kind === "existing" && !currentIds.has(item.id) ? [item.data] : [],
  );
  return { added, kept, removed };
}

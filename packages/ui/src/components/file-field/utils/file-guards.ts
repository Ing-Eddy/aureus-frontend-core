import type { ExistingFileItem, FileItem, NewFileItem } from "../types";

/**
 * Whether an item is a file picked in this session.
 *
 * ```ts
 * const picked = files.filter(isNewFile).map((item) => item.file);
 * ```
 */
export function isNewFile<E>(item: FileItem<E>): item is NewFileItem {
  return item.kind === "new";
}

/**
 * Whether an item is a file the backend already stores.
 *
 * ```ts
 * const stored = files.filter(isExistingFile).map((item) => item.data);
 * ```
 */
export function isExistingFile<E>(item: FileItem<E>): item is ExistingFileItem<E> {
  return item.kind === "existing";
}

/**
 * Builds an existing item from the backend's data, for `defaultValues` or `value`. Its id comes
 * from `getId` when given (for example the backend's id), so it stays stable between renders.
 * Without `getId` every item gets the same id, so use it for a single file; for lists use
 * `toExistingFiles`.
 *
 * ```ts
 * const logo = toExistingFile(company.logo, (stored: Attachment) => stored.id);
 * ```
 */
export function toExistingFile<E>(
  data: E,
  getId?: (data: E) => string | number,
): ExistingFileItem<E> {
  return { kind: "existing", id: `existing-${getId ? String(getId(data)) : "0"}`, data };
}

/**
 * Builds existing items from a list of the backend's data, with ids from `getId` or the index.
 *
 * ```ts
 * const attachments = toExistingFiles(invoice.attachments, (stored: Attachment) => stored.id);
 * ```
 */
export function toExistingFiles<E>(
  list: readonly E[],
  getId?: (data: E) => string | number,
): ExistingFileItem<E>[] {
  return list.map((data, index) => ({
    kind: "existing",
    id: `existing-${getId ? String(getId(data)) : index}`,
    data,
  }));
}

/** A value of either shape as a list: `null` and `undefined` become `[]`. */
export function toFileList<E>(
  value: FileItem<E> | readonly FileItem<E>[] | null | undefined,
): FileItem<E>[] {
  if (value == null) return [];
  return Array.isArray(value) ? [...value] : [value as FileItem<E>];
}

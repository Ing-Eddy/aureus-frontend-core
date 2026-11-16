import type { FileItem } from "../types";
import { toFileList } from "./file-guards";

/**
 * Whether any item is still new. With `upload`, every item becomes existing once its upload
 * completes, so this is true while uploads are pending or failed: use it in a schema to block the
 * submit, for example `.refine((files) => !hasPendingUploads(files), "…")`. Without `upload`,
 * new items are expected and this helper does not apply.
 */
export function hasPendingUploads<E>(
  value: FileItem<E> | readonly FileItem<E>[] | null | undefined,
): boolean {
  return toFileList(value).some((item) => item.kind === "new");
}

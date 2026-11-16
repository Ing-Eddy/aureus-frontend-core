import type { FileItem } from "../types";
import { toFileList } from "./file-guards";

/**
 * Appends the file of every new item under `field` to `formData` (a new one when omitted) and
 * returns it. Multipart `FormData` is the recommended way to send files: base64 is about a third
 * larger and needs the whole file in memory.
 */
export function toFormData<E>(
  value: FileItem<E> | readonly FileItem<E>[] | null | undefined,
  field: string,
  formData: FormData = new FormData(),
): FormData {
  for (const item of toFileList(value)) {
    if (item.kind === "new") formData.append(field, item.file, item.file.name);
  }
  return formData;
}

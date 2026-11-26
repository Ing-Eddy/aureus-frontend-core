/**
 * Resolves to the file's data URL (`data:<type>;base64,...`). Prefer `toFormData` for uploads:
 * base64 is about a third larger and reads the whole file into memory.
 *
 * ```ts
 * const dataUrl = await fileToBase64(file);
 * ```
 */
export function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

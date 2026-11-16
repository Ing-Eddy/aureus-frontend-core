let counter = 0;

/** A unique id for a new file item: `crypto.randomUUID()` when available, a counter otherwise. */
export function createFileId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  counter += 1;
  return `file-${Date.now().toString(36)}-${counter}`;
}

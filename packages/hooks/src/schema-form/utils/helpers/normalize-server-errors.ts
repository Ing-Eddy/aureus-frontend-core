import { warnOnce } from "@/internal/utils/helpers";
import { isPlainObject } from "./merge-values";

/** One field's server messages, ready for `setError`. */
export interface NormalizedServerError {
  name: string;
  messages: string[];
}

const isMessage = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

/**
 * Turns `{ path: string | string[] }` into a list of fields with their non-empty messages. Keys with
 * no message are dropped. A value that is not an object is ignored with a development warning.
 */
export function normalizeServerErrors(errors: unknown, source: string): NormalizedServerError[] {
  if (errors === null || errors === undefined) return [];
  if (!isPlainObject(errors)) {
    warnOnce(
      `${source}:server-errors-shape`,
      `[${source}] serverErrors must be an object of field paths to messages ({ email: ["…"] }). ` +
        "Use parseServerErrors to convert your backend's error body.",
    );
    return [];
  }

  const normalized: NormalizedServerError[] = [];
  for (const [name, value] of Object.entries(errors)) {
    const messages = (Array.isArray(value) ? value : [value]).filter(isMessage);
    if (messages.length > 0) normalized.push({ name, messages });
  }
  return normalized;
}

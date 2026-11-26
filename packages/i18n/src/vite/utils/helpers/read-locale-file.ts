import { readFileSync } from "node:fs";
import { relative } from "node:path";
import type { I18nResourceContent } from "@/internal/types";
import { toPosixPath } from "./match-glob";

/** A locale file that cannot be used: unreadable, not JSON, or not a JSON object. */
export class LocaleFileError extends Error {
  /** The absolute path of the file. */
  readonly file: string;

  constructor(file: string, message: string) {
    super(message);
    this.name = "LocaleFileError";
    this.file = file;
  }
}

const describeValue = (value: unknown) =>
  value === null ? "null" : Array.isArray(value) ? "an array" : `a ${typeof value}`;

/** Reads and parses a locale file. Throws a `LocaleFileError` naming the file (relative to `root`). */
export function readLocaleFile(root: string, file: string): I18nResourceContent {
  const name = toPosixPath(relative(root, file));
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    throw new LocaleFileError(
      file,
      `[aureusI18n] ${name} cannot be read: ${(error as Error).message}`,
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new LocaleFileError(
      file,
      `[aureusI18n] ${name} is not valid JSON: ${(error as Error).message}`,
    );
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new LocaleFileError(
      file,
      `[aureusI18n] ${name} must contain a JSON object of translations, but it contains ${describeValue(value)}.`,
    );
  }
  return value as I18nResourceContent;
}

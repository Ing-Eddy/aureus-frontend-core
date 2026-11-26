import type { I18nResourceContent } from "@/internal/types";
import { toPosixPath } from "./match-glob";
import { LocaleFileError, readLocaleFile } from "./read-locale-file";
import type { ScanResult } from "./scan-namespaces";

/** Parsed locale files by absolute POSIX path; `undefined` for a file that could not be used. */
export type LocaleContents = Map<string, I18nResourceContent | undefined>;

/**
 * Reads every locale file of `scan`. A file that cannot be used is passed to `onError` and stored
 * as `undefined`, so the rest of the files are still used.
 */
export function loadLocales(
  root: string,
  scan: ScanResult,
  onError: (error: LocaleFileError) => void,
): LocaleContents {
  const contents: LocaleContents = new Map();
  for (const namespace of scan.namespaces) {
    for (const file of Object.values(namespace.files)) {
      contents.set(toPosixPath(file), readOrReport(root, file, onError));
    }
  }
  return contents;
}

/** Reads one locale file, passing a `LocaleFileError` to `onError` instead of throwing it. */
export function readOrReport(
  root: string,
  file: string,
  onError: (error: LocaleFileError) => void,
): I18nResourceContent | undefined {
  try {
    return readLocaleFile(root, file);
  } catch (error) {
    if (error instanceof LocaleFileError) {
      onError(error);
      return undefined;
    }
    throw error;
  }
}

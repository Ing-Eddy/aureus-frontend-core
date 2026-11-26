import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Writes `content` to `file` only when it differs from what is there, creating the folder if
 * needed. Returns whether the file was written. Avoids loops with file watchers and noisy diffs.
 */
export function writeIfChanged(file: string, content: string): boolean {
  if (existsSync(file) && readFileSync(file, "utf8") === content) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return true;
}

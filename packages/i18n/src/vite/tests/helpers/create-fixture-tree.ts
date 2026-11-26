import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/** A fixture tree: relative file path → content. Objects are written as JSON. */
export type FixtureTree = Record<string, string | object>;

/** Writes `files` under `root`, creating folders as needed. */
export function writeFixtureFiles(root: string, files: FixtureTree): void {
  for (const [path, content] of Object.entries(files)) {
    const absolute = join(root, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(
      absolute,
      typeof content === "string" ? content : `${JSON.stringify(content, null, 2)}\n`,
    );
  }
}

/** Creates a temporary folder with `files`. Call `remove()` when the test is done. */
export function createFixtureTree(files: FixtureTree): { root: string; remove: () => void } {
  const root = mkdtempSync(join(tmpdir(), "aureus-i18n-"));
  writeFixtureFiles(root, files);
  return { root, remove: () => rmSync(root, { recursive: true, force: true }) };
}

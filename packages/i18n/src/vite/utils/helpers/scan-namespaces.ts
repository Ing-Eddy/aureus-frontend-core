import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { globBase, matchGlob, toPosixPath } from "./match-glob";

/** The default `include` of the plugin: every `locales` folder under `src/`. */
export const DEFAULT_INCLUDE = ["src/**/locales"] as const;

/** Folders never searched, at any depth. */
const SKIPPED_FOLDERS = new Set(["node_modules", "dist"]);

/** Whether a folder is never searched: dependencies, build output and hidden folders. */
const isSkipped = (name: string) => SKIPPED_FOLDERS.has(name) || name.startsWith(".");

/** One discovered namespace. */
export interface ScannedNamespace {
  /** The namespace name (`"auth"`). */
  readonly name: string;
  /** Its folder, relative to the root, with `/` separators (`"src/features/auth/locales"`). */
  readonly dir: string;
  /** Language → absolute path of its JSON file, sorted by language. */
  readonly files: Readonly<Record<string, string>>;
}

/** What the plugin found under the root. */
export interface ScanResult {
  /** Every namespace, sorted by name. */
  readonly namespaces: readonly ScannedNamespace[];
  /** Every language found in any namespace, sorted. */
  readonly languages: readonly string[];
}

/** The discovery options of the plugin. See `AureusI18nOptions` for each one. */
export interface ScanOptions {
  /** Folder globs to search. Defaults to `DEFAULT_INCLUDE`. */
  readonly include?: readonly string[];
  /** Folder globs removed from the search. No default. */
  readonly exclude?: readonly string[];
  /** Folder → explicit namespace name. No default. */
  readonly namespaces?: Readonly<Record<string, string>>;
}

/** Every folder under `root/start`, as root-relative POSIX paths, skipping the ignored folders. */
function walkFolders(root: string, start: string, found: Set<string>): void {
  const absolute = join(root, start);
  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return;
  found.add(start);
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    if (!entry.isDirectory() || isSkipped(entry.name)) continue;
    walkFolders(root, start ? `${start}/${entry.name}` : entry.name, found);
  }
}

/** Language → absolute file path for the `.json` files directly inside `folder`. */
function languageFiles(root: string, folder: string): Record<string, string> {
  const absolute = join(root, folder);
  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return {};
  return Object.fromEntries(
    readdirSync(absolute, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => [entry.name.slice(0, -".json".length), join(absolute, entry.name)] as const)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

/**
 * Finds the namespaces and languages under `root`. A folder matched by `include` and not by
 * `exclude` is a namespace named after the folder that contains it (`src/locales` is therefore the
 * namespace `src`). Folders in `namespaces` are namespaces with the given name. Symbolic links to
 * folders or files are not followed. Throws when two folders give the same name, or when nothing is
 * found.
 */
export function scanNamespaces(root: string, options: ScanOptions = {}): ScanResult {
  const include = options.include ?? DEFAULT_INCLUDE;
  const exclude = options.exclude ?? [];
  const explicit = new Map(
    Object.entries(options.namespaces ?? {}).map(([dir, name]) => [toPosixPath(dir), name]),
  );

  const folders = new Set<string>();
  for (const base of new Set(include.map(globBase))) walkFolders(root, base, folders);

  const candidates = new Map<string, string>(); // folder → namespace name
  for (const folder of [...folders].sort()) {
    if (!include.some((pattern) => matchGlob(pattern, folder))) continue;
    if (exclude.some((pattern) => matchGlob(pattern, folder))) continue;
    const parent = basename(folder.split("/").slice(0, -1).join("/"));
    if (parent) candidates.set(folder, parent);
  }
  // An explicit name wins over the name discovery would give the same folder.
  for (const [folder, name] of explicit) candidates.set(folder, name);

  const byName = new Map<string, string>();
  for (const [folder, name] of candidates) {
    const other = byName.get(name);
    if (other !== undefined) {
      const [first, second] = [other, folder].sort();
      throw new Error(
        `[aureusI18n] Two folders give the namespace "${name}": ${first} and ${second}. ` +
          `Rename one of them, or give one another name with the "namespaces" option.`,
      );
    }
    byName.set(name, folder);
  }

  if (byName.size === 0) {
    throw new Error(
      `[aureusI18n] No namespace found. Searched: ${include.join(", ")}` +
        (exclude.length > 0 ? ` (excluding ${exclude.join(", ")})` : "") +
        `. Create a folder such as src/common/locales with one JSON file per language.`,
    );
  }

  const namespaces = [...byName]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, dir]) => ({ name, dir, files: languageFiles(root, dir) }));
  const languages = [...new Set(namespaces.flatMap((ns) => Object.keys(ns.files)))].sort();
  return { namespaces, languages };
}

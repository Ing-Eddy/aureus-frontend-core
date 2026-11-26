/** Turns Windows separators into `/` and removes leading `./` and trailing slashes. */
export function toPosixPath(path: string): string {
  return path
    .replaceAll("\\", "/")
    .replace(/^(\.\/)+/, "")
    .replace(/\/+$/, "");
}

/** The folder names of a path, with empty segments removed. */
const splitSegments = (path: string) => toPosixPath(path).split("/").filter(Boolean);

/** Compiled pattern segments: a scan tests the same few against every folder. */
const segmentCache = new Map<string, RegExp>();

/** A pattern segment as a regular expression: `*` matches any characters except `/`. */
function segmentRegExp(segment: string): RegExp {
  let regExp = segmentCache.get(segment);
  if (!regExp) {
    const source = segment.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"));
    regExp = new RegExp(`^${source.join("[^/]*")}$`);
    segmentCache.set(segment, regExp);
  }
  return regExp;
}

/** Whether the path's segments match the pattern's, trying every length for each `**`. */
function matchSegments(pattern: readonly string[], path: readonly string[]): boolean {
  if (pattern.length === 0) return path.length === 0;
  const [head, ...rest] = pattern;
  if (head === "**") {
    // `**` takes zero or more segments.
    for (let taken = 0; taken <= path.length; taken++) {
      if (matchSegments(rest, path.slice(taken))) return true;
    }
    return false;
  }
  const [first, ...others] = path;
  if (first === undefined || head === undefined || !segmentRegExp(head).test(first)) return false;
  return matchSegments(rest, others);
}

/**
 * Whether a relative folder path matches a glob. Only two wildcards exist: `*` matches within one
 * path segment and `**` matches any number of segments, including none.
 *
 * ```ts
 * matchGlob("src/**\/locales", "src/features/auth/locales"); // true
 * matchGlob("src/features/*\/locales", "src/features/a/b/locales"); // false
 * ```
 */
export function matchGlob(pattern: string, path: string): boolean {
  return matchSegments(splitSegments(pattern), splitSegments(path));
}

/**
 * The fixed folder a glob starts from: the segments before the first wildcard
 * (`src/features/*\/locales` → `src/features`). The search starts there instead of at the root.
 */
export function globBase(pattern: string): string {
  const segments = splitSegments(pattern);
  const firstWildcard = segments.findIndex((segment) => segment.includes("*"));
  return (firstWildcard === -1 ? segments : segments.slice(0, firstWildcard)).join("/");
}

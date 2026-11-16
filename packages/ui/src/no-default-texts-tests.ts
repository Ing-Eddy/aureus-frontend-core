// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guard for the library rule "no default texts": every user-facing text comes from props. It scans
 * the source of the public components and the shared internals (never `src/shadcn`, which the
 * shadcn CLI owns) and fails on hard-coded texts. Developer messages (console warnings, provider
 * errors) are plain strings outside JSX, so none of these patterns matches them.
 */

const SRC = fileURLToPath(new URL(".", import.meta.url));
const ROOTS = ["components", "internal"];

/** Paths that are never shipped: tests, their helpers and the shared test helpers. */
const isExcluded = (path: string) =>
  /(^|\/)tests\//.test(path) || /-tests\.tsx?$/.test(path) || path.startsWith("internal/testing/");

/**
 * Exceptions, as `path: pattern`. Each needs a reason. Decorative characters (such as "•" or "*")
 * need no entry: they contain no letters.
 */
const ALLOWLIST: ReadonlyArray<{ path: string; match: string; reason: string }> = [];

const RULES: ReadonlyArray<{ name: string; pattern: RegExp; tsxOnly?: boolean }> = [
  { name: "uses fieldStrings", pattern: /\bfieldStrings\b/g },
  {
    name: "literal accessible or visible attribute",
    pattern:
      /\s(aria-label|aria-valuetext|aria-placeholder|aria-roledescription|title|placeholder|alt)=(?:"[^"]*[A-Za-z][^"]*"|'[^']*[A-Za-z][^']*'|\{\s*["'`][^"'`]*[A-Za-z])/g,
    tsxOnly: true,
  },
  {
    name: "literal default for a text prop",
    pattern: /\b\w*(?:Label|Message|Text)\s*=\s*["'`][^"'`]*[A-Za-z]/g,
  },
  {
    name: "letters as JSX text",
    pattern: />([^<>{}=;()`"']*[A-Za-zÀ-ÿ][^<>{}=;()`"']*)<\//g,
    tsxOnly: true,
  },
];

/** Removes comments, so JSDoc examples such as `<Label>Text</Label>` are not reported. */
function stripComments(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/** The hard-coded texts in one file's source, as "rule: match". */
function findDefaultTexts(source: string, path: string): string[] {
  const code = stripComments(source);
  const found: string[] = [];
  for (const rule of RULES) {
    if (rule.tsxOnly && !path.endsWith(".tsx")) continue;
    for (const match of code.matchAll(rule.pattern)) {
      const text = match[0].trim();
      const allowed = ALLOWLIST.some((entry) => entry.path === path && text.includes(entry.match));
      if (!allowed) found.push(`${rule.name}: ${text}`);
    }
  }
  return found;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry) ? [full] : [];
  });
}

describe("no default texts", () => {
  it("finds no hard-coded user-facing text in components and internals", () => {
    const problems = ROOTS.flatMap((root) => sourceFiles(join(SRC, root)))
      .map((file) => relative(SRC, file))
      .filter((path) => !isExcluded(path))
      .flatMap((path) =>
        findDefaultTexts(readFileSync(join(SRC, path), "utf8"), path).map(
          (problem) => `${path} → ${problem}`,
        ),
      );
    expect(problems).toEqual([]);
  });

  it("detects each kind of hard-coded text", () => {
    const check = (source: string) => findDefaultTexts(source, "components/x/x.tsx");
    expect(check('<button aria-label="Close" />')).toHaveLength(1);
    expect(check("<input placeholder={'Search'} />")).toHaveLength(1);
    expect(check("<img alt={`Avatar`} />")).toHaveLength(1);
    expect(check('function F({ loadingLabel = "Loading" }) {}')).toHaveLength(1);
    expect(check("const x = ({ emptyMessage = `Nothing` }) => x;")).toHaveLength(1);
    expect(check("<span>Loading</span>")).toHaveLength(1);
    expect(check("<p>\n  More information\n</p>")).toHaveLength(1);
    expect(check('import { fieldStrings } from "./x";')).toHaveLength(1);
  });

  it("ignores props, decorative characters, developer messages and comments", () => {
    const check = (source: string) => findDefaultTexts(source, "components/x/x.tsx");
    expect(check("<button aria-label={label} />")).toEqual([]);
    expect(check('<span aria-hidden="true">•</span>')).toEqual([]);
    expect(check("<span>{label}</span>")).toEqual([]);
    expect(check('<div className="text-sm" data-slot="field" />')).toEqual([]);
    expect(check("console.warn(`TextField: \\`info\\` needs \\`infoLabel\\`.`);")).toEqual([]);
    expect(check('throw new Error("X must be rendered inside a FormProvider.");')).toEqual([]);
    expect(check("/** Renders <span>Loading</span>. */\nconst a = useState<string>(b);")).toEqual(
      [],
    );
  });
});

import { normalizeColor } from "./color";
import { shadowSteps } from "./serialize-theme";
import { type ColorToken, colorTokens, type Mode, modes, type ThemeDraft } from "./theme-types";

/**
 * A small CSS scanner for shadcn theme files (design D8): it only needs custom properties from
 * `:root` / `:root:not(.dark)` / `.dark` blocks, at the top level or inside `@layer`.
 */
export interface ParsedTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const lightSelectors = new Set([":root", ":root:not(.dark)"]);
const darkSelectors = new Set([".dark"]);

/** Removes comments, leaving quoted strings intact. */
function stripComments(css: string): string {
  let out = "";
  let quote: string | undefined;
  for (let index = 0; index < css.length; index++) {
    const char = css[index];
    if (quote) {
      out += char;
      if (char === "\\") out += css[++index] ?? "";
      else if (char === quote) quote = undefined;
    } else if (char === '"' || char === "'") {
      quote = char;
      out += char;
    } else if (char === "/" && css[index + 1] === "*") {
      const end = css.indexOf("*/", index + 2);
      index = end === -1 ? css.length : end + 1;
      out += " ";
    } else {
      out += char;
    }
  }
  return out;
}

/** Index of the `}` closing the `{` at `open`, skipping strings; `-1` when unbalanced. */
function matchingBrace(css: string, open: number): number {
  let depth = 0;
  let quote: string | undefined;
  for (let index = open; index < css.length; index++) {
    const char = css[index];
    if (quote) {
      if (char === "\\") index++;
      else if (char === quote) quote = undefined;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) return index;
  }
  return -1;
}

/** Splits a declaration list on `;` outside strings and parentheses. */
function declarations(body: string): [string, string][] {
  const result: [string, string][] = [];
  let depth = 0;
  let quote: string | undefined;
  let current = "";
  const flush = () => {
    const colon = current.indexOf(":");
    if (colon > 0) result.push([current.slice(0, colon).trim(), current.slice(colon + 1).trim()]);
    current = "";
  };
  for (let index = 0; index < body.length; index++) {
    const char = body[index] ?? "";
    if (quote) {
      if (char === quote) quote = undefined;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === ";" && depth === 0) {
      flush();
      continue;
    }
    current += char;
  }
  flush();
  return result;
}

/** Drops nested rules (CSS nesting) so only the block's own declarations remain. */
function ownDeclarations(body: string): string {
  let out = "";
  for (let index = 0; index < body.length; index++) {
    if (body[index] === "{") {
      const end = matchingBrace(body, index);
      // The nested rule's prelude is part of `out` since the last `;`: cut it.
      out = out.slice(0, out.lastIndexOf(";") + 1);
      if (end === -1) break;
      index = end;
    } else out += body[index];
  }
  return out;
}

function scan(css: string, into: ParsedTheme) {
  let index = 0;
  while (index < css.length) {
    const open = css.indexOf("{", index);
    if (open === -1) return;
    // A statement such as `@import "x";` ends before the next block's prelude starts.
    const prelude = (css.slice(index, open).split(";").pop() ?? "").trim();
    const close = matchingBrace(css, open);
    if (close === -1) return;
    const body = css.slice(open + 1, close);

    if (/^@layer\b/.test(prelude)) scan(body, into);
    else if (!prelude.startsWith("@")) {
      const selectors = prelude.split(",").map((selector) => selector.trim().replace(/\s+/g, " "));
      const targets: Mode[] = [];
      if (selectors.some((selector) => lightSelectors.has(selector))) targets.push("light");
      if (selectors.some((selector) => darkSelectors.has(selector))) targets.push("dark");
      for (const mode of targets) {
        for (const [name, value] of declarations(ownDeclarations(body))) {
          if (name.startsWith("--")) into[mode][name] = value;
        }
      }
    }
    index = close + 1;
  }
}

export function parseThemeCss(css: string): ParsedTheme {
  const parsed: ParsedTheme = { light: {}, dark: {} };
  scan(stripComments(css), parsed);
  return parsed;
}

export interface ImportReport {
  /** Number of declarations applied to the draft. */
  imported: number;
  /** Recognized color tokens absent from the file, e.g. `--sidebar (dark)`. */
  missing: string[];
  /** Declarations that were not used, e.g. `--destructive-foreground (light)`. */
  ignored: string[];
}

export type ImportResult = { ok: true; draft: ThemeDraft; report: ImportReport } | { ok: false };

/** `0.5rem` → 0.5, `8px` → 0.5, `0` → 0 (rem). */
function toRem(value: string): number | undefined {
  const match = /^(-?\d*\.?\d+)(rem|px)?$/.exec(value.trim());
  if (!match) return undefined;
  const amount = Number(match[1]);
  return match[2] === "px" ? amount / 16 : amount;
}

function toPx(value: string): number | undefined {
  const match = /^(-?\d*\.?\d+)(px)?$/.exec(value.trim());
  return match ? Number(match[1]) : undefined;
}

function toEm(value: string): number | undefined {
  const match = /^(-?\d*\.?\d+)(em)?$/.exec(value.trim());
  return match ? Number(match[1]) : undefined;
}

function toOpacity(value: string): number | undefined {
  const match = /^(\d*\.?\d+)(%)?$/.exec(value.trim());
  if (!match) return undefined;
  const amount = Number(match[1]) / (match[2] ? 100 : 1);
  return amount >= 0 && amount <= 1 ? amount : undefined;
}

const colorTokenSet: ReadonlySet<string> = new Set(colorTokens);

/** Names that are recognized but carry nothing the draft stores (derived by the export itself). */
const derivedNames = new Set([
  "--font-heading",
  ...shadowSteps.map((step) => (step ? `--shadow-${step}` : "--shadow")),
]);

/**
 * Applies a parsed theme to a draft. Colors become overrides (so "Reset token" falls back to the
 * draft's base), other values become inputs. The base is kept, so tokens missing from the file
 * keep their current values. A file with no recognized token is rejected.
 */
export function importTheme(draft: ThemeDraft, parsed: ParsedTheme): ImportResult {
  const next: ThemeDraft = structuredClone(draft);
  const report: ImportReport = { imported: 0, missing: [], ignored: [] };
  let recognized = 0;

  for (const mode of modes) {
    for (const [name, raw] of Object.entries(parsed[mode])) {
      const token = name.slice(2);
      const label = `${name} (${mode})`;
      let applied = false;
      if (colorTokenSet.has(token)) {
        recognized++;
        const color = normalizeColor(raw);
        if (color) {
          next.overrides[mode][token as ColorToken] = color;
          applied = true;
        }
      } else if (derivedNames.has(name)) {
        recognized++;
        continue;
      } else if (name === "--shadow-color") {
        recognized++;
        const color = normalizeColor(raw);
        if (color) {
          next.inputs.shadow.color[mode] = color;
          applied = true;
        }
      } else if (mode === "light") {
        applied = applyInput(next, name, raw);
        if (applied || isInputName(name)) recognized++;
      } else if (isInputName(name)) {
        // Mode-independent values only count once, from the light block.
        recognized++;
        continue;
      }
      if (applied) report.imported++;
      else report.ignored.push(label);
    }
  }

  if (recognized === 0) return { ok: false };

  for (const mode of modes) {
    for (const token of colorTokens) {
      if (!(`--${token}` in parsed[mode])) report.missing.push(`--${token} (${mode})`);
    }
  }
  return { ok: true, draft: next, report };
}

const inputNames = new Set([
  "--radius",
  "--font-sans",
  "--font-serif",
  "--font-mono",
  "--shadow-opacity",
  "--shadow-blur",
  "--shadow-spread",
  "--shadow-offset-x",
  "--shadow-offset-y",
  "--spacing",
  "--tracking-normal",
  "--letter-spacing",
]);
const isInputName = (name: string) => inputNames.has(name);

function applyInput(draft: ThemeDraft, name: string, raw: string): boolean {
  const { inputs } = draft;
  const set = <T>(value: T | undefined, apply: (value: T) => void) => {
    if (value === undefined || Number.isNaN(value)) return false;
    apply(value);
    return true;
  };
  switch (name) {
    case "--radius":
      return set(toRem(raw), (value) => {
        inputs.radius = value;
      });
    case "--font-sans":
    case "--font-serif":
    case "--font-mono": {
      const stack = raw.trim();
      if (!stack || stack.includes("var(")) return false;
      inputs.fonts[name.slice("--font-".length) as "sans" | "serif" | "mono"] = stack;
      return true;
    }
    case "--shadow-opacity":
      return set(toOpacity(raw), (value) => {
        inputs.shadow.opacity = value;
      });
    case "--shadow-blur":
      return set(toPx(raw), (value) => {
        inputs.shadow.blur = value;
      });
    case "--shadow-spread":
      return set(toPx(raw), (value) => {
        inputs.shadow.spread = value;
      });
    case "--shadow-offset-x":
      return set(toPx(raw), (value) => {
        inputs.shadow.x = value;
      });
    case "--shadow-offset-y":
      return set(toPx(raw), (value) => {
        inputs.shadow.y = value;
      });
    case "--spacing":
      return set(toRem(raw), (value) => {
        inputs.spacing = value;
      });
    case "--tracking-normal":
    case "--letter-spacing":
      return set(toEm(raw), (value) => {
        inputs.tracking = value;
      });
    default:
      return false;
  }
}

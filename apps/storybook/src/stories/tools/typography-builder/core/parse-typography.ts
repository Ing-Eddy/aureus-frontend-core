import { type TypographyVariant, typographyVariants } from "@aureus-core/ui/components/typography";
import { parseSize } from "./fluid-size";
import { findCatalogFamily } from "./font-catalog";
import { bundledStacks, guessFontsource, isValidFamily, systemStacks } from "./font-stack";
import {
  type FontChoice,
  type FontRole,
  fontRoles,
  type TextTransform,
  type TypographyDraft,
  textTransforms,
  type VariantStyle,
} from "./typography-types";

/** What an exported file holds: `:root` declarations and the Fontsource imports. */
export interface ParsedTypography {
  declarations: Map<string, string>;
  imports: string[];
}

export interface TypographyImportReport {
  /** Values applied to the draft. */
  imported: number;
  /** Known variables absent from the file; they keep their current value. */
  missing: string[];
  /** Declarations that were not used: unknown names or invalid values. */
  ignored: string[];
}

export type TypographyImportResult =
  | { ok: true; draft: TypographyDraft; report: TypographyImportReport }
  | { ok: false };

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

/**
 * Reads `:root` blocks and top-level `@import` lines (design D6). Values may contain quotes; the
 * scanner splits on `;` outside quotes.
 */
export function parseTypographyCss(css: string): ParsedTypography {
  const text = stripComments(css);
  const imports = [...text.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?\s*;/g)].map(
    (match) => match[1] as string,
  );
  const declarations = new Map<string, string>();
  for (const block of text.matchAll(/:root\s*\{([^{}]*)\}/g)) {
    for (const declaration of splitDeclarations(block[1] ?? "")) {
      const colon = declaration.indexOf(":");
      if (colon < 0) continue;
      const name = declaration.slice(0, colon).trim();
      const value = normalize(declaration.slice(colon + 1));
      if (name.startsWith("--") && value) declarations.set(name, value);
    }
  }
  return { declarations, imports };
}

function splitDeclarations(body: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: string | undefined;
  for (const char of body) {
    if (quote) {
      if (char === quote) quote = undefined;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === ";") {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

const variantProperties = [
  "font",
  "size",
  "line-height",
  "weight",
  "tracking",
  "transform",
] as const;
type CssProperty = (typeof variantProperties)[number];

/** Every variable an export defines, in output order. */
export const knownVariables: readonly string[] = [
  ...fontRoles.map((role) => `--typography-font-${role}`),
  "--typography-tracking-normal",
  ...typographyVariants.flatMap((variant) =>
    variantProperties.map((property) => `--typography-${variant}-${property}`),
  ),
];

const firstFamily = (stack: string) =>
  (stack.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "");

/** The font choice a stack stands for (design D6), or `undefined` when it cannot be stored. */
export function parseFontStack(
  role: FontRole,
  stack: string,
  imports: readonly string[],
): FontChoice | undefined {
  const value = normalize(stack);
  if (value === normalize(bundledStacks[role])) return { kind: "bundled" };
  if (value === normalize(systemStacks[role])) return { kind: "system" };
  if (value.includes("var(")) return undefined;
  const family = firstFamily(value).replace(/\s+Variable$/i, "");
  if (!family) return undefined;
  if ((role === "mono" && family === "Geist Mono") || (role !== "mono" && family === "Geist")) {
    return { kind: "bundled" };
  }
  const catalog = findCatalogFamily(family);
  if (catalog) return { kind: "catalog", id: catalog.id };
  if (!isValidFamily(family)) return undefined;
  const slug = guessFontsource(family).slice("@fontsource/".length);
  const fontsource =
    imports.find(
      (name) => name === `@fontsource/${slug}` || name === `@fontsource-variable/${slug}`,
    ) ?? guessFontsource(family);
  return { kind: "custom", family, fontsource };
}

const em = (value: string) => {
  const match = /^(-?\d*\.?\d+)em$/.exec(value);
  return match ? Number(match[1]) : undefined;
};

/** One variant property from its CSS text, or `undefined` when the value is not valid. */
function parseProperty(property: CssProperty, value: string): Partial<VariantStyle> | undefined {
  switch (property) {
    case "font": {
      const match = /^var\(--typography-font-(sans|heading|serif|mono)\)$/.exec(value);
      return match ? { font: match[1] as FontRole } : undefined;
    }
    case "size": {
      const size = parseSize(value);
      return size ? { size } : undefined;
    }
    case "line-height": {
      if (value === "inherit") return { lineHeight: "inherit" };
      const number = Number(value);
      return /^\d*\.?\d+$/.test(value) && number > 0 ? { lineHeight: number } : undefined;
    }
    case "weight": {
      const number = Number(value);
      return /^\d+$/.test(value) && number >= 1 && number <= 1000 ? { weight: number } : undefined;
    }
    case "tracking": {
      const tracking = em(value);
      return tracking === undefined ? undefined : { tracking };
    }
    case "transform":
      return (textTransforms as readonly string[]).includes(value)
        ? { transform: value as TextTransform }
        : undefined;
  }
}

const variantPattern = new RegExp(
  `^--typography-(${typographyVariants.join("|")})-(${variantProperties.join("|")})$`,
);

/**
 * Applies a parsed file to a draft: fonts and tracking replace the draft's, variant values become
 * overrides (so they survive regeneration). Missing values keep theirs. A file with no typography
 * variable is rejected.
 */
export function importTypography(
  draft: TypographyDraft,
  parsed: ParsedTypography,
): TypographyImportResult {
  const next: TypographyDraft = structuredClone(draft);
  const report: TypographyImportReport = { imported: 0, missing: [], ignored: [] };
  let recognized = 0;

  for (const [name, value] of parsed.declarations) {
    if (!name.startsWith("--typography-")) {
      report.ignored.push(name);
      continue;
    }
    const role = /^--typography-font-(sans|heading|serif|mono)$/.exec(name)?.[1] as
      | FontRole
      | undefined;
    if (role) {
      recognized++;
      const choice = parseFontStack(role, value, parsed.imports);
      if (choice) {
        next.fonts[role] = choice;
        report.imported++;
      } else report.ignored.push(name);
      continue;
    }
    if (name === "--typography-tracking-normal") {
      recognized++;
      const tracking = em(value);
      if (tracking === undefined) report.ignored.push(name);
      else {
        next.tracking = tracking;
        report.imported++;
      }
      continue;
    }
    const match = variantPattern.exec(name);
    if (!match) {
      report.ignored.push(name);
      continue;
    }
    recognized++;
    const variant = match[1] as TypographyVariant;
    const patch = parseProperty(match[2] as CssProperty, value);
    if (!patch) {
      report.ignored.push(name);
      continue;
    }
    next.overrides[variant] = { ...next.overrides[variant], ...patch };
    report.imported++;
  }

  if (recognized === 0) return { ok: false };
  report.missing = knownVariables.filter((name) => !parsed.declarations.has(name));
  return { ok: true, draft: next, report };
}

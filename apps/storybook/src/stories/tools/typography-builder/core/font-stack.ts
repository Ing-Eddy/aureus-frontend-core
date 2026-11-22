import { type CatalogFont, type FontFallback, findCatalogFont } from "./font-catalog";
import type { FontChoice, FontRole, ResolvedFont } from "./typography-types";

/** Generic tails appended to a web font, per fallback kind. */
const generics: Record<FontFallback, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

/** The stacks `packages/ui/src/styles/typography.css` ships, byte for byte. */
export const bundledStacks: Readonly<Record<FontRole, string>> = {
  sans: `"Geist Variable", ${generics.sans}`,
  // The package's heading font follows the text font unless it is set.
  heading: "var(--typography-font-sans)",
  serif: generics.serif,
  mono: `"Geist Mono Variable", ${generics.mono}`,
};

/** The operating system's stack for each role. */
export const systemStacks: Readonly<Record<FontRole, string>> = {
  sans: generics.sans,
  heading: generics.sans,
  serif: generics.serif,
  mono: generics.mono,
};

/** The fallback a custom family gets in each role. */
const roleFallback: Record<FontRole, FontFallback> = {
  sans: "sans",
  heading: "sans",
  serif: "serif",
  mono: "mono",
};

const quote = (family: string) => `"${family}"`;

/**
 * A web font's stack. A variable Fontsource package registers `"<Family> Variable"`, while Google
 * Fonts (the preview) and static Fontsource packages register `"<Family>"`; listing both makes the
 * preview and the app use the same font (design D3).
 */
export function webFontStack(family: string, variable: boolean, fallback: FontFallback): string {
  const names = variable ? [quote(`${family} Variable`), quote(family)] : [quote(family)];
  return [...names, generics[fallback]].join(", ");
}

/** Fontsource's slug for a family: lowercase, words joined with `-`. */
export function fontsourceSlug(family: string): string {
  return family
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The package proposed for a family outside the catalog (static, so it exists for any Google font). */
export const guessFontsource = (family: string) => `@fontsource/${fontsourceSlug(family)}`;

/** A family name a user may type: letters, digits and spaces, 2–60 characters. */
export const isValidFamily = (family: string) => /^[A-Za-z0-9 ]{2,60}$/.test(family.trim());

/** A Fontsource package name: `@fontsource/<slug>` or `@fontsource-variable/<slug>`. */
export const isValidFontsource = (name: string) =>
  /^@fontsource(-variable)?\/[a-z0-9]+(-[a-z0-9]+)*$/.test(name.trim());

/** The stack, family and package of one role's choice. */
export function resolveFont(role: FontRole, choice: FontChoice): ResolvedFont {
  switch (choice.kind) {
    case "bundled": {
      const family = role === "mono" ? "Geist Mono" : role === "serif" ? "ui-serif" : "Geist";
      return { choice, stack: bundledStacks[role], family, verified: true };
    }
    case "system":
      return {
        choice,
        stack: systemStacks[role],
        family: role === "serif" ? "ui-serif" : role === "mono" ? "ui-monospace" : "system-ui",
        verified: true,
      };
    case "catalog": {
      const catalog = findCatalogFont(choice.id);
      if (!catalog) return resolveFont(role, { kind: "bundled" });
      return {
        choice,
        stack: webFontStack(catalog.family, catalog.variable, catalog.fallback),
        family: catalog.family,
        catalog,
        fontsource: catalog.fontsource,
        verified: true,
      };
    }
    case "custom":
      return {
        choice,
        stack: webFontStack(choice.family.trim(), false, roleFallback[role]),
        family: choice.family.trim(),
        fontsource: choice.fontsource.trim(),
        verified: false,
      };
  }
}

/** The catalog font a resolved role uses, if any (for weight checks and the explorer). */
export const catalogOf = (font: ResolvedFont): CatalogFont | undefined => font.catalog;

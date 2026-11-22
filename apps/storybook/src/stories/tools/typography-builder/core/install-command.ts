import type { ResolvedTypography } from "./typography-types";

/** Every Fontsource package the typography needs, sorted and without duplicates. */
export function fontPackages(typography: Pick<ResolvedTypography, "fonts">): string[] {
  const packages = new Set<string>();
  for (const font of Object.values(typography.fonts)) {
    if (font.fontsource) packages.add(font.fontsource);
  }
  return [...packages].sort();
}

/** Packages that are guesses for custom fonts, to flag as unverified. */
export function unverifiedPackages(typography: Pick<ResolvedTypography, "fonts">): string[] {
  const packages = new Set<string>();
  for (const font of Object.values(typography.fonts)) {
    if (font.fontsource && !font.verified) packages.add(font.fontsource);
  }
  return [...packages].sort();
}

/** `pnpm add …` for the fonts, or `undefined` when the bundled fonts are enough. */
export function installCommand(typography: Pick<ResolvedTypography, "fonts">): string | undefined {
  const packages = fontPackages(typography);
  return packages.length ? `pnpm add ${packages.join(" ")}` : undefined;
}

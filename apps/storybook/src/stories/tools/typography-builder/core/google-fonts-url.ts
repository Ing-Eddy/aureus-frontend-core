import type { CatalogFont } from "./font-catalog";
import type { ResolvedFont } from "./typography-types";

/** One `family=` parameter of the Google Fonts CSS API, with the weight axis it needs. */
export function googleFamilyParam(family: string, catalog?: CatalogFont): string {
  const name = family.trim().replace(/ /g, "+");
  if (!catalog) return `family=${name}:wght@400;700`;
  const { weights } = catalog;
  const axis = catalog.variable
    ? `${weights[0] ?? 400}..${weights[weights.length - 1] ?? 400}`
    : weights.join(";");
  return `family=${name}:wght@${axis}`;
}

const cssApi = (params: readonly string[]) =>
  params.length
    ? `https://fonts.googleapis.com/css2?${[...params, "display=swap"].join("&")}`
    : undefined;

/**
 * The Google Fonts stylesheet for the preview: every role that uses a catalog or custom font. Bundled
 * and system fonts need no request. Apps never use this URL; they install Fontsource packages.
 */
export function googleFontsUrl(fonts: Record<string, ResolvedFont>): string | undefined {
  const params = new Map<string, string>();
  for (const font of Object.values(fonts)) {
    if (font.choice.kind !== "catalog" && font.choice.kind !== "custom") continue;
    params.set(font.family, googleFamilyParam(font.family, font.catalog));
  }
  return cssApi([...params.keys()].sort().map((family) => params.get(family) as string));
}

/** The stylesheet for a page of explorer fonts, so filtering never loads the whole catalog. */
export function catalogFontsUrl(fonts: readonly CatalogFont[]): string | undefined {
  return cssApi(fonts.map((font) => googleFamilyParam(font.family, font)));
}

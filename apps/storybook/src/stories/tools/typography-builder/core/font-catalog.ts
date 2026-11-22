/**
 * Curated free fonts available on both Google Fonts (preview) and Fontsource (apps), design D3.
 * Families, categories, weights and variable axes come from the Fontsource API (2026-11-22); every
 * package was checked on the npm registry. Adding a font is a data change: the catalog test checks
 * its shape.
 */

/** Where a font sits in the explorer. `display` fonts are meant for headings. */
export type FontCategory = "sans" | "serif" | "display" | "mono";

/** The generic family appended to a stack built from this font. */
export type FontFallback = "sans" | "serif" | "mono";

export interface CatalogFont {
  /** Fontsource id, also the slug of its package. */
  id: string;
  family: string;
  category: FontCategory;
  fallback: FontFallback;
  /** A variable font provides every weight between its first and last entry. */
  variable: boolean;
  /** Weights provided, ascending. */
  weights: readonly number[];
  /** Exact npm package an app installs. */
  fontsource: string;
}

export const fontCatalog: readonly CatalogFont[] = [
  {
    id: "inter",
    family: "Inter",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/inter",
  },
  {
    id: "roboto",
    family: "Roboto",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/roboto",
  },
  {
    id: "open-sans",
    family: "Open Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/open-sans",
  },
  {
    id: "montserrat",
    family: "Montserrat",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/montserrat",
  },
  {
    id: "nunito",
    family: "Nunito",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/nunito",
  },
  {
    id: "dm-sans",
    family: "DM Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/dm-sans",
  },
  {
    id: "plus-jakarta-sans",
    family: "Plus Jakarta Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/plus-jakarta-sans",
  },
  {
    id: "manrope",
    family: "Manrope",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/manrope",
  },
  {
    id: "work-sans",
    family: "Work Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/work-sans",
  },
  {
    id: "figtree",
    family: "Figtree",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/figtree",
  },
  {
    id: "outfit",
    family: "Outfit",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/outfit",
  },
  {
    id: "onest",
    family: "Onest",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/onest",
  },
  {
    id: "raleway",
    family: "Raleway",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/raleway",
  },
  {
    id: "rubik",
    family: "Rubik",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/rubik",
  },
  {
    id: "source-sans-3",
    family: "Source Sans 3",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/source-sans-3",
  },
  {
    id: "lexend",
    family: "Lexend",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/lexend",
  },
  {
    id: "ibm-plex-sans",
    family: "IBM Plex Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700],
    fontsource: "@fontsource-variable/ibm-plex-sans",
  },
  {
    id: "sora",
    family: "Sora",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/sora",
  },
  {
    id: "urbanist",
    family: "Urbanist",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/urbanist",
  },
  {
    id: "instrument-sans",
    family: "Instrument Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [400, 500, 600, 700],
    fontsource: "@fontsource-variable/instrument-sans",
  },
  {
    id: "archivo",
    family: "Archivo",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/archivo",
  },
  {
    id: "public-sans",
    family: "Public Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/public-sans",
  },
  {
    id: "noto-sans",
    family: "Noto Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/noto-sans",
  },
  {
    id: "mona-sans",
    family: "Mona Sans",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/mona-sans",
  },
  {
    id: "hanken-grotesk",
    family: "Hanken Grotesk",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/hanken-grotesk",
  },
  {
    id: "atkinson-hyperlegible-next",
    family: "Atkinson Hyperlegible Next",
    category: "sans",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/atkinson-hyperlegible-next",
  },
  {
    id: "lato",
    family: "Lato",
    category: "sans",
    fallback: "sans",
    variable: false,
    weights: [100, 300, 400, 700, 900],
    fontsource: "@fontsource/lato",
  },
  {
    id: "poppins",
    family: "Poppins",
    category: "sans",
    fallback: "sans",
    variable: false,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource/poppins",
  },
  {
    id: "space-grotesk",
    family: "Space Grotesk",
    category: "display",
    fallback: "sans",
    variable: true,
    weights: [300, 400, 500, 600, 700],
    fontsource: "@fontsource-variable/space-grotesk",
  },
  {
    id: "bricolage-grotesque",
    family: "Bricolage Grotesque",
    category: "display",
    fallback: "sans",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/bricolage-grotesque",
  },
  {
    id: "dm-serif-display",
    family: "DM Serif Display",
    category: "display",
    fallback: "serif",
    variable: false,
    weights: [400],
    fontsource: "@fontsource/dm-serif-display",
  },
  {
    id: "instrument-serif",
    family: "Instrument Serif",
    category: "display",
    fallback: "serif",
    variable: false,
    weights: [400],
    fontsource: "@fontsource/instrument-serif",
  },
  {
    id: "merriweather",
    family: "Merriweather",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/merriweather",
  },
  {
    id: "lora",
    family: "Lora",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [400, 500, 600, 700],
    fontsource: "@fontsource-variable/lora",
  },
  {
    id: "playfair-display",
    family: "Playfair Display",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/playfair-display",
  },
  {
    id: "source-serif-4",
    family: "Source Serif 4",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/source-serif-4",
  },
  {
    id: "fraunces",
    family: "Fraunces",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/fraunces",
  },
  {
    id: "libre-baskerville",
    family: "Libre Baskerville",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [400, 500, 600, 700],
    fontsource: "@fontsource-variable/libre-baskerville",
  },
  {
    id: "eb-garamond",
    family: "EB Garamond",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/eb-garamond",
  },
  {
    id: "crimson-pro",
    family: "Crimson Pro",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/crimson-pro",
  },
  {
    id: "noto-serif",
    family: "Noto Serif",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/noto-serif",
  },
  {
    id: "newsreader",
    family: "Newsreader",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/newsreader",
  },
  {
    id: "literata",
    family: "Literata",
    category: "serif",
    fallback: "serif",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/literata",
  },
  {
    id: "jetbrains-mono",
    family: "JetBrains Mono",
    category: "mono",
    fallback: "mono",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    fontsource: "@fontsource-variable/jetbrains-mono",
  },
  {
    id: "fira-code",
    family: "Fira Code",
    category: "mono",
    fallback: "mono",
    variable: true,
    weights: [300, 400, 500, 600, 700],
    fontsource: "@fontsource-variable/fira-code",
  },
  {
    id: "source-code-pro",
    family: "Source Code Pro",
    category: "mono",
    fallback: "mono",
    variable: true,
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    fontsource: "@fontsource-variable/source-code-pro",
  },
  {
    id: "roboto-mono",
    family: "Roboto Mono",
    category: "mono",
    fallback: "mono",
    variable: true,
    weights: [100, 200, 300, 400, 500, 600, 700],
    fontsource: "@fontsource-variable/roboto-mono",
  },
  {
    id: "red-hat-mono",
    family: "Red Hat Mono",
    category: "mono",
    fallback: "mono",
    variable: true,
    weights: [300, 400, 500, 600, 700],
    fontsource: "@fontsource-variable/red-hat-mono",
  },
  {
    id: "dm-mono",
    family: "DM Mono",
    category: "mono",
    fallback: "mono",
    variable: false,
    weights: [300, 400, 500],
    fontsource: "@fontsource/dm-mono",
  },
  {
    id: "ibm-plex-mono",
    family: "IBM Plex Mono",
    category: "mono",
    fallback: "mono",
    variable: false,
    weights: [100, 200, 300, 400, 500, 600, 700],
    fontsource: "@fontsource/ibm-plex-mono",
  },
  {
    id: "space-mono",
    family: "Space Mono",
    category: "mono",
    fallback: "mono",
    variable: false,
    weights: [400, 700],
    fontsource: "@fontsource/space-mono",
  },
];

export const fontCategories = [
  "sans",
  "serif",
  "display",
  "mono",
] as const satisfies readonly FontCategory[];

const byId = new Map(fontCatalog.map((font) => [font.id, font]));

export function findCatalogFont(id: string): CatalogFont | undefined {
  return byId.get(id);
}

/** Case-insensitive match on the family name (with or without the ` Variable` suffix). */
export function findCatalogFamily(family: string): CatalogFont | undefined {
  const name = family
    .replace(/\s+Variable$/i, "")
    .trim()
    .toLowerCase();
  return fontCatalog.find((font) => font.family.toLowerCase() === name);
}

/** Whether a catalog font can render `weight` without synthesizing it. */
export function supportsWeight(font: CatalogFont, weight: number): boolean {
  if (font.variable) {
    const min = font.weights[0] ?? 400;
    const max = font.weights[font.weights.length - 1] ?? 400;
    return weight >= min && weight <= max;
  }
  return font.weights.includes(weight);
}

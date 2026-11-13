import { defaultFonts } from "./default-theme";
import type { FontStacks } from "./theme-types";

export type FontRole = keyof FontStacks;

export interface FontOption {
  label: string;
  stack: string;
  /** Google Fonts family name; absent for bundled and system fonts (no network request). */
  google?: string;
}

const sansFallback = "ui-sans-serif, system-ui, sans-serif";
const serifFallback = "ui-serif, Georgia, serif";
const monoFallback = "ui-monospace, SFMono-Regular, Menlo, monospace";

const google = (family: string, fallback: string): FontOption => ({
  label: family,
  stack: `'${family}', ${fallback}`,
  google: family,
});

/** Curated families per role. The first entry is the default of `@aureus-core/ui`. */
export const fontOptions: Record<FontRole, readonly FontOption[]> = {
  sans: [
    { label: "Geist (Aureus default)", stack: defaultFonts.sans },
    {
      label: "System UI",
      stack:
        "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    google("Inter", sansFallback),
    google("Roboto", sansFallback),
    google("Open Sans", sansFallback),
    google("Lato", sansFallback),
    google("Montserrat", sansFallback),
    google("Poppins", sansFallback),
    google("DM Sans", sansFallback),
    google("Plus Jakarta Sans", sansFallback),
    google("IBM Plex Sans", sansFallback),
    google("Nunito", sansFallback),
  ],
  serif: [
    { label: "System serif (Tailwind default)", stack: defaultFonts.serif },
    google("Merriweather", serifFallback),
    google("Lora", serifFallback),
    google("Playfair Display", serifFallback),
    google("Source Serif 4", serifFallback),
    google("Libre Baskerville", serifFallback),
  ],
  mono: [
    { label: "System mono (Tailwind default)", stack: defaultFonts.mono },
    google("JetBrains Mono", monoFallback),
    google("Fira Code", monoFallback),
    google("IBM Plex Mono", monoFallback),
    google("Source Code Pro", monoFallback),
    google("Geist Mono", monoFallback),
  ],
};

export const fontRoles = ["sans", "serif", "mono"] as const satisfies readonly FontRole[];

export function findFontOption(role: FontRole, stack: string): FontOption | undefined {
  return fontOptions[role].find((option) => option.stack === stack);
}

/** Google Fonts stylesheet URL for every curated web font the stacks use (none for custom stacks). */
export function googleFontsUrl(fonts: FontStacks): string | undefined {
  const families = fontRoles
    .map((role) => findFontOption(role, fonts[role])?.google)
    .filter((family): family is string => Boolean(family));
  if (families.length === 0) return undefined;
  const query = [...new Set(families)]
    .map(
      (family) => `family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;500;600;700`,
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

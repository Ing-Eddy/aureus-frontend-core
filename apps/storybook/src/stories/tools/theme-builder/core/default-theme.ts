import type { ColorSet, Mode, ThemeDraft, ThemeInputs } from "./theme-types";

/**
 * The Aureus preset: the brand tokens of `@aureus-core/ui/styles.css` (`packages/ui/src/styles/
 * theme.css`, which redefines every shadcn color in both modes). `default-theme-tests.ts` reads the
 * package files and fails if this copy drifts from them; the brand constants (`--brand-*`) are not
 * Theme Builder tokens.
 */
export const aureusColors: Record<Mode, ColorSet> = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.129 0.042 264.695)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.129 0.042 264.695)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.129 0.042 264.695)",
    primary: "oklch(0.45 0.2 264)",
    "primary-foreground": "oklch(0.984 0.003 247.858)",
    secondary: "oklch(0.8 0.14 84)",
    "secondary-foreground": "oklch(0.26 0.05 70)",
    muted: "oklch(0.968 0.007 247.896)",
    "muted-foreground": "oklch(0.446 0.043 257.281)",
    accent: "oklch(0.968 0.007 247.896)",
    "accent-foreground": "oklch(0.208 0.042 265.755)",
    destructive: "oklch(0.51 0.2 27.325)",
    border: "oklch(0.929 0.013 255.508)",
    input: "oklch(0.929 0.013 255.508)",
    ring: "oklch(0.45 0.2 264)",
    "chart-1": "oklch(0.45 0.2 264)",
    "chart-2": "oklch(0.55 0.12 78)",
    "chart-3": "oklch(0.62 0.17 264)",
    "chart-4": "oklch(0.47 0.1 70)",
    "chart-5": "oklch(0.446 0.043 257.281)",
    sidebar: "oklch(0.984 0.003 247.858)",
    "sidebar-foreground": "oklch(0.129 0.042 264.695)",
    "sidebar-primary": "oklch(0.45 0.2 264)",
    "sidebar-primary-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-accent": "oklch(0.968 0.007 247.896)",
    "sidebar-accent-foreground": "oklch(0.208 0.042 265.755)",
    "sidebar-border": "oklch(0.929 0.013 255.508)",
    "sidebar-ring": "oklch(0.45 0.2 264)",
  },
  dark: {
    background: "oklch(0.129 0.042 264.695)",
    foreground: "oklch(0.984 0.003 247.858)",
    card: "oklch(0.208 0.042 265.755)",
    "card-foreground": "oklch(0.984 0.003 247.858)",
    popover: "oklch(0.208 0.042 265.755)",
    "popover-foreground": "oklch(0.984 0.003 247.858)",
    primary: "oklch(0.62 0.17 264)",
    "primary-foreground": "oklch(0.129 0.042 264.695)",
    secondary: "oklch(0.82 0.13 86)",
    "secondary-foreground": "oklch(0.26 0.05 70)",
    muted: "oklch(0.279 0.041 260.031)",
    "muted-foreground": "oklch(0.704 0.04 256.788)",
    accent: "oklch(0.279 0.041 260.031)",
    "accent-foreground": "oklch(0.984 0.003 247.858)",
    destructive: "oklch(0.74 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.62 0.17 264)",
    "chart-1": "oklch(0.62 0.17 264)",
    "chart-2": "oklch(0.82 0.13 86)",
    "chart-3": "oklch(0.76 0.11 258)",
    "chart-4": "oklch(0.68 0.12 80)",
    "chart-5": "oklch(0.704 0.04 256.788)",
    sidebar: "oklch(0.208 0.042 265.755)",
    "sidebar-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-primary": "oklch(0.62 0.17 264)",
    "sidebar-primary-foreground": "oklch(0.129 0.042 264.695)",
    "sidebar-accent": "oklch(0.279 0.041 260.031)",
    "sidebar-accent-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.62 0.17 264)",
  },
};

/**
 * Inputs that describe the brand as closely as the generator allows: Aureus Blue as primary, slate
 * neutrals with no extra tint, the Aureus red and primary-derived charts. The gold secondary and the
 * gold chart steps are hand-picked, so they only exist in the preset. Non-color values are the
 * package's (radius) and Tailwind's defaults (shadow ≈ `shadow-sm`, spacing).
 */
export const aureusInputs: ThemeInputs = {
  primary: "oklch(0.45 0.2 264)",
  achromaticPrimary: false,
  neutral: "slate",
  tint: 0,
  destructive: "oklch(0.51 0.2 27.325)",
  chartMode: "primary",
  radius: 0.625,
  shadow: {
    color: { light: "oklch(0 0 0)", dark: "oklch(0 0 0)" },
    opacity: 0.1,
    blur: 3,
    spread: 0,
    x: 0,
    y: 1,
  },
  spacing: 0.25,
};

/** Downloads as `theme.css`, the name apps import next to their global CSS. */
export const defaultThemeName = "theme";

export function createDefaultDraft(): ThemeDraft {
  return {
    version: 2,
    name: defaultThemeName,
    base: { kind: "preset", id: "aureus" },
    inputs: structuredClone(aureusInputs),
    overrides: { light: {}, dark: {} },
  };
}

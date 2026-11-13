import type { ColorSet, FontStacks, Mode, ThemeDraft, ThemeInputs } from "./theme-types";

/**
 * The Aureus preset: the exact tokens of `@aureus-core/ui/styles.css`, i.e. stock shadcn
 * (`packages/ui/src/styles/shadcn.css`) with the accessibility overrides of `theme.css`.
 * `default-theme-tests.ts` reads both files and fails if this copy drifts from them.
 */
export const aureusColors: Record<Mode, ColorSet> = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.53 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    destructive: "oklch(0.51 0.2 27.325)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.97 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.74 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.269 0 0)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.556 0 0)",
  },
};

/** The package's `--font-sans` and Tailwind's default serif and mono stacks. */
export const defaultFonts: FontStacks = {
  sans: "'Geist Variable', sans-serif",
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

/**
 * Inputs that match the preset as closely as the generator allows: neutral palette, black/white
 * primary, no tint, the Aureus red and monochrome charts. Non-color values are the package's
 * (radius) and Tailwind's defaults (shadow ≈ `shadow-sm`, spacing, letter spacing).
 */
export const aureusInputs: ThemeInputs = {
  primary: "oklch(0.546 0.245 262.881)",
  achromaticPrimary: true,
  neutral: "neutral",
  tint: 0,
  destructive: "oklch(0.51 0.2 27.325)",
  chartMode: "monochrome",
  radius: 0.625,
  fonts: defaultFonts,
  shadow: {
    color: { light: "oklch(0 0 0)", dark: "oklch(0 0 0)" },
    opacity: 0.1,
    blur: 3,
    spread: 0,
    x: 0,
    y: 1,
  },
  spacing: 0.25,
  tracking: 0,
};

export const defaultThemeName = "custom";

export function createDefaultDraft(): ThemeDraft {
  return {
    version: 1,
    name: defaultThemeName,
    base: { kind: "preset", id: "aureus" },
    inputs: structuredClone(aureusInputs),
    overrides: { light: {}, dark: {} },
  };
}

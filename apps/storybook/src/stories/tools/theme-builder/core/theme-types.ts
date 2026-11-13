/**
 * Data model of the theme builder (design D2). Everything here is plain data so the draft can be
 * stored as JSON and shared by the generator, the contrast checks, the serializer and the UI.
 */

/** Every color token of the radix-nova shadcn stylesheet, in the order `shadcn.css` declares them. */
export const colorTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

export type ColorToken = (typeof colorTokens)[number];

export const modes = ["light", "dark"] as const;
export type Mode = (typeof modes)[number];

export const neutralPalettes = ["neutral", "zinc", "stone", "slate", "gray"] as const;
export type NeutralPalette = (typeof neutralPalettes)[number];

export const chartModes = ["monochrome", "primary"] as const;
export type ChartMode = (typeof chartModes)[number];

/** Every color token of one mode, as normalized `oklch(...)` strings. */
export type ColorSet = Record<ColorToken, string>;

export interface FontStacks {
  sans: string;
  serif: string;
  mono: string;
}

/** One shadow definition; every `--shadow-*` step is derived from it. Lengths are in px. */
export interface ShadowInputs {
  color: Record<Mode, string>;
  /** 0–1. */
  opacity: number;
  blur: number;
  spread: number;
  x: number;
  y: number;
}

export interface ThemeInputs {
  /** Brand color, normalized `oklch(...)`. Ignored for colors while `achromaticPrimary` is on. */
  primary: string;
  /** Keep shadcn's neutral (black/white) primary instead of a brand color. */
  achromaticPrimary: boolean;
  neutral: NeutralPalette;
  /** 0–1: how much the neutrals are tinted toward the primary hue. */
  tint: number;
  destructive: string;
  chartMode: ChartMode;
  /** rem. */
  radius: number;
  fonts: FontStacks;
  shadow: ShadowInputs;
  /** Base spacing unit, rem. */
  spacing: number;
  /** Base letter spacing, em. */
  tracking: number;
}

/** The inputs that drive color generation: changing one of them leaves the preset. */
export const colorInputKeys = [
  "primary",
  "achromaticPrimary",
  "neutral",
  "tint",
  "destructive",
  "chartMode",
] as const satisfies readonly (keyof ThemeInputs)[];

export type ThemeBase = { kind: "preset"; id: "aureus" } | { kind: "generated" };

export interface ThemeDraft {
  version: 1;
  name: string;
  base: ThemeBase;
  inputs: ThemeInputs;
  overrides: Record<Mode, Partial<Record<ColorToken, string>>>;
}

/** What the preview, contrast table and export read: base colors with overrides applied. */
export interface ResolvedTheme {
  name: string;
  colors: Record<Mode, ColorSet>;
  radius: number;
  fonts: FontStacks;
  shadow: ShadowInputs;
  spacing: number;
  tracking: number;
}

import type { TypographyVariant } from "@aureus-core/ui/components/typography";
import type { CatalogFont } from "./font-catalog";

export type { TypographyVariant };

/** The four font roles of `@aureus-core/ui` (`--typography-font-<role>`). */
export const fontRoles = ["sans", "heading", "serif", "mono"] as const;
export type FontRole = (typeof fontRoles)[number];

/** How one role gets its family (design D2, D3). */
export type FontChoice =
  /** Geist (sans, heading), Geist Mono (mono) or the system serif stack: what the package ships. */
  | { kind: "bundled" }
  /** The operating system's generic stack for the role. */
  | { kind: "system" }
  /** A font of the curated catalog, by id. */
  | { kind: "catalog"; id: string }
  /** Any other Google Fonts family; its Fontsource package is a guess the user can edit. */
  | { kind: "custom"; family: string; fontsource: string };

export const textTransforms = ["none", "uppercase", "lowercase", "capitalize"] as const;
export type TextTransform = (typeof textTransforms)[number];

/** A variant's font size. Fluid sizes are `clamp(min, intercept + slope·vw, max)` (design D4). */
export type SizeValue =
  | { kind: "fixed"; value: number; unit: "rem" | "em" }
  | { kind: "fluid"; min: number; max: number; intercept: number; slope: number };

/** The six properties of one variant (`--typography-<variant>-*`). */
export interface VariantStyle {
  font: FontRole;
  size: SizeValue;
  lineHeight: number | "inherit";
  /** 100–900. */
  weight: number;
  /** em. */
  tracking: number;
  transform: TextTransform;
}

export type VariantProperty = keyof VariantStyle;

/** Inputs of the generated scale. */
export interface ScaleInputs {
  /** Base (body) size in px, 14–20. */
  basePx: number;
  /** Ratio between scale steps, 1.05–1.8. */
  ratio: number;
  /** Make `display`, `h1` and `h2` fluid between the two viewports. */
  fluid: boolean;
  /** px. */
  minViewport: number;
  /** px. */
  maxViewport: number;
  /** Ratio used for the fluid minimum sizes, ≤ `ratio`. */
  minRatio: number;
}

export type TypographyBase = { kind: "preset"; id: "aureus" } | { kind: "generated" };

export type VariantOverrides = Partial<Record<TypographyVariant, Partial<VariantStyle>>>;

/** Everything the builder stores (design D2). */
export interface TypographyDraft {
  version: 1;
  name: string;
  base: TypographyBase;
  fonts: Record<FontRole, FontChoice>;
  scale: ScaleInputs;
  /** Base letter spacing of the page, em. */
  tracking: number;
  overrides: VariantOverrides;
}

/** One role after resolution: its CSS stack and what an app must install for it. */
export interface ResolvedFont {
  choice: FontChoice;
  stack: string;
  /** First family name, as the preview and the checks see it. */
  family: string;
  /** The catalog entry, when the choice is a catalog font. */
  catalog?: CatalogFont;
  /** Package to install; absent for bundled and system choices. */
  fontsource?: string;
  /** `false` for a custom font's guessed package. */
  verified: boolean;
}

/** What the preview, the checks, the code view and the export read. */
export interface ResolvedTypography {
  name: string;
  fonts: Record<FontRole, ResolvedFont>;
  tracking: number;
  variants: Record<TypographyVariant, VariantStyle>;
}

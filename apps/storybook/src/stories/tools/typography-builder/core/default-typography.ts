import type { TypographyVariant } from "@aureus-core/ui/components/typography";
import type { ScaleInputs, TypographyDraft, VariantStyle } from "./typography-types";

const fixed = (value: number, unit: "rem" | "em" = "rem") =>
  ({ kind: "fixed", value, unit }) as const;
const fluid = (min: number, intercept: number, slope: number, max: number) =>
  ({ kind: "fluid", min, max, intercept, slope }) as const;

/**
 * The Aureus preset: exactly the values of `packages/ui/src/styles/typography.css`
 * (`default-typography-tests.ts` fails on any drift).
 */
export const aureusVariants: Readonly<Record<TypographyVariant, VariantStyle>> = {
  display: {
    font: "heading",
    size: fluid(2.5, 1.75, 2.5, 3.75),
    lineHeight: 1.1,
    weight: 700,
    tracking: -0.03,
    transform: "none",
  },
  h1: {
    font: "heading",
    size: fluid(2, 1.6, 1.5, 2.5),
    lineHeight: 1.15,
    weight: 700,
    tracking: -0.025,
    transform: "none",
  },
  h2: {
    font: "heading",
    size: fluid(1.625, 1.4, 0.9, 1.875),
    lineHeight: 1.2,
    weight: 600,
    tracking: -0.02,
    transform: "none",
  },
  h3: {
    font: "heading",
    size: fixed(1.5),
    lineHeight: 1.3,
    weight: 600,
    tracking: -0.015,
    transform: "none",
  },
  h4: {
    font: "heading",
    size: fixed(1.25),
    lineHeight: 1.4,
    weight: 600,
    tracking: -0.01,
    transform: "none",
  },
  h5: {
    font: "heading",
    size: fixed(1.125),
    lineHeight: 1.45,
    weight: 600,
    tracking: -0.005,
    transform: "none",
  },
  h6: {
    font: "heading",
    size: fixed(1),
    lineHeight: 1.5,
    weight: 600,
    tracking: 0,
    transform: "none",
  },
  lead: {
    font: "sans",
    size: fixed(1.25),
    lineHeight: 1.6,
    weight: 400,
    tracking: -0.005,
    transform: "none",
  },
  "body-lg": {
    font: "sans",
    size: fixed(1.125),
    lineHeight: 1.65,
    weight: 400,
    tracking: 0,
    transform: "none",
  },
  body: {
    font: "sans",
    size: fixed(1),
    lineHeight: 1.6,
    weight: 400,
    tracking: 0,
    transform: "none",
  },
  "body-sm": {
    font: "sans",
    size: fixed(0.875),
    lineHeight: 1.5,
    weight: 400,
    tracking: 0,
    transform: "none",
  },
  label: {
    font: "sans",
    size: fixed(0.875),
    lineHeight: 1.25,
    weight: 500,
    tracking: 0,
    transform: "none",
  },
  caption: {
    font: "sans",
    size: fixed(0.75),
    lineHeight: 1.4,
    weight: 400,
    tracking: 0.01,
    transform: "none",
  },
  overline: {
    font: "sans",
    size: fixed(0.75),
    lineHeight: 1.4,
    weight: 600,
    tracking: 0.08,
    transform: "uppercase",
  },
  code: {
    font: "mono",
    size: fixed(0.875, "em"),
    lineHeight: "inherit",
    weight: 400,
    tracking: 0,
    transform: "none",
  },
};

/** Scale inputs shown before anything is generated: a 16 px base, a major third, fluid headings. */
export const defaultScale: Readonly<ScaleInputs> = {
  basePx: 16,
  ratio: 1.25,
  fluid: true,
  minViewport: 360,
  maxViewport: 1280,
  minRatio: 1.2,
};

/** Downloads as `typography.css`, the name apps import next to their global CSS. */
export const defaultTypographyName = "typography";

export function createDefaultDraft(): TypographyDraft {
  return {
    version: 1,
    name: defaultTypographyName,
    base: { kind: "preset", id: "aureus" },
    fonts: {
      sans: { kind: "bundled" },
      heading: { kind: "bundled" },
      serif: { kind: "bundled" },
      mono: { kind: "bundled" },
    },
    scale: { ...defaultScale },
    tracking: 0,
    overrides: {},
  };
}

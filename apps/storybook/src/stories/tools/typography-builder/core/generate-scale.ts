import { type TypographyVariant, typographyVariants } from "@aureus-core/ui/components/typography";
import { aureusVariants } from "./default-typography";
import { fluidSize, round, sizeRange } from "./fluid-size";
import type { ScaleInputs, VariantStyle } from "./typography-types";

/** Scale step of each variant: size = base · ratio^step (design D4). `code` stays relative. */
export const scaleSteps: Readonly<Record<Exclude<TypographyVariant, "code">, number>> = {
  display: 5,
  h1: 4,
  h2: 3,
  h3: 2,
  h4: 1,
  h5: 0.5,
  h6: 0,
  lead: 1,
  "body-lg": 0.5,
  body: 0,
  "body-sm": -0.5,
  label: -0.5,
  caption: -1,
  overline: -1,
};

/** Variants whose line height and letter spacing follow their size. */
const headingVariants: ReadonlySet<TypographyVariant> = new Set([
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

/** The next smaller heading of each fluid variant. */
const headingBelow: Partial<Record<TypographyVariant, TypographyVariant>> = {
  h2: "h3",
  h1: "h2",
  display: "h1",
};

/** Steps from which the fluid mode applies (`display`, `h1`, `h2`). */
export const fluidFromStep = 3;

/** Smallest size of the steps below the base, so small text stays legible. */
export const minSmallSize = 0.75;

/** Rounds to 1/16 rem (1 px at the default root size). */
export const round16 = (rem: number) => Math.round(rem * 16) / 16;

const step = (value: number, unit: number) => round(Math.round(value / unit) * unit, 3);
const clampTo = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Heading line height: 1.5 at 16 px, tighter as the text grows, never below 1.1. */
export const headingLineHeight = (px: number) =>
  step(clampTo(1.5 - 0.3 * Math.log2(px / 16), 1.1, 1.5), 0.05);

/** Heading letter spacing: 0 at 16 px, tighter as the text grows, never below −0.04em. */
export const headingTracking = (px: number) =>
  step(clampTo(-0.02 * Math.log2(px / 16), -0.04, 0), 0.005);

function sizeFor(value: number, isSmall: boolean) {
  const rem = round16(value);
  return isSmall ? Math.max(minSmallSize, rem) : rem;
}

/**
 * Every variant's style for a scale. Sizes come from the steps table; headings get line height and
 * letter spacing from their (largest) size; everything else (font role, weight, transform, and the
 * line height and letter spacing of text variants) keeps the Aureus preset.
 */
export function generateScale(scale: ScaleInputs): Record<TypographyVariant, VariantStyle> {
  const base = scale.basePx / 16;
  const result = {} as Record<TypographyVariant, VariantStyle>;
  // Smallest headings first, so each fluid heading can read the one below it.
  const order = [...typographyVariants].sort(
    (a, b) => (a === "code" ? 0 : scaleSteps[a]) - (b === "code" ? 0 : scaleSteps[b]),
  );
  for (const variant of order) {
    const preset = aureusVariants[variant];
    if (variant === "code") {
      result[variant] = { ...preset };
      continue;
    }
    const exponent = scaleSteps[variant];
    const small = exponent < 0;
    const max = sizeFor(base * scale.ratio ** exponent, small);
    let size: VariantStyle["size"] = { kind: "fixed", value: max, unit: "rem" };
    if (scale.fluid && exponent >= fluidFromStep) {
      // Never smaller than the heading below at its own minimum, so the order holds at every width.
      const below = headingBelow[variant];
      const floor = below ? sizeRange(result[below].size)[0] : 0;
      const min = Math.max(
        floor,
        sizeFor(base * Math.min(scale.minRatio, scale.ratio) ** exponent, small),
      );
      if (min < max) size = fluidSize(min, max, scale.minViewport, scale.maxViewport);
    }
    const heading = headingVariants.has(variant);
    result[variant] = {
      ...preset,
      size,
      lineHeight: heading ? headingLineHeight(max * 16) : preset.lineHeight,
      tracking: heading ? headingTracking(max * 16) : preset.tracking,
    };
  }
  // Same key order as the catalog.
  return Object.fromEntries(
    typographyVariants.map((variant) => [variant, result[variant]]),
  ) as Record<TypographyVariant, VariantStyle>;
}

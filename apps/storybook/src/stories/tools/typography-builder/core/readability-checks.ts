import type { TypographyVariant } from "@aureus-core/ui/components/typography";
import { formatSize, sizeRange } from "./fluid-size";
import { supportsWeight } from "./font-catalog";
import type { ResolvedTypography } from "./typography-types";

export type ReadabilityCheck =
  | "body-too-small"
  | "line-height-tight"
  | "heading-order"
  | "weight-unavailable"
  | "fluid-without-rem";

export interface ReadabilityIssue {
  check: ReadabilityCheck;
  variant: TypographyVariant;
  /** The offending value, as CSS text. */
  value: string;
}

/** Reference root size: what 1rem is in a browser with default settings. */
export const referenceRootPx = 16;

/** From the smallest heading to the largest. */
const headingOrder: readonly TypographyVariant[] = ["h6", "h5", "h4", "h3", "h2", "h1", "display"];
const readingVariants: readonly TypographyVariant[] = ["body", "body-lg", "lead"];

/** Non-blocking warnings (design D7), in a stable order. */
export function checkReadability(typography: ResolvedTypography): ReadabilityIssue[] {
  const issues: ReadabilityIssue[] = [];
  const { variants, fonts } = typography;

  // An em body size is relative to the page root, so it is compared like rem.
  const [bodyMin] = sizeRange(variants.body.size);
  if (bodyMin * referenceRootPx < 16) {
    issues.push({
      check: "body-too-small",
      variant: "body",
      value: formatSize(variants.body.size),
    });
  }

  for (const variant of readingVariants) {
    const { lineHeight } = variants[variant];
    if (typeof lineHeight === "number" && lineHeight < 1.4) {
      issues.push({ check: "line-height-tight", variant, value: String(lineHeight) });
    }
  }

  for (let index = 1; index < headingOrder.length; index++) {
    const lower = headingOrder[index - 1] as TypographyVariant;
    const higher = headingOrder[index] as TypographyVariant;
    const [lowerMin, lowerMax] = sizeRange(variants[lower].size);
    const [higherMin, higherMax] = sizeRange(variants[higher].size);
    if (higherMin < lowerMin || higherMax < lowerMax) {
      issues.push({
        check: "heading-order",
        variant: higher,
        value: formatSize(variants[higher].size),
      });
    }
  }

  for (const [variant, style] of Object.entries(variants) as [
    TypographyVariant,
    (typeof variants)[TypographyVariant],
  ][]) {
    const catalog = fonts[style.font].catalog;
    if (catalog && !supportsWeight(catalog, style.weight)) {
      issues.push({ check: "weight-unavailable", variant, value: String(style.weight) });
    }
    // The preferred value of a clamp() must keep a positive rem term, or it stops growing with zoom.
    if (style.size.kind === "fluid" && style.size.intercept <= 0) {
      issues.push({ check: "fluid-without-rem", variant, value: formatSize(style.size) });
    }
  }
  return issues;
}

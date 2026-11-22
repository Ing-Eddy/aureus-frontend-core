import type { SizeValue } from "./typography-types";

/** Rounds to `digits` decimals and turns `-0` into `0`. */
export function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** Shortest decimal text of a number: at most 4 decimals (1/16 rem steps), no trailing zeros. */
export const formatNumber = (value: number) => String(round(value, 4));

/**
 * The fluid size that is `min` rem at `minViewport` px and `max` rem at `maxViewport` px (design D4):
 * slope = (max − min) · 16 / (vmax − vmin) · 100 vw, intercept = min − slope · vmin / 1600 rem.
 */
export function fluidSize(
  min: number,
  max: number,
  minViewport: number,
  maxViewport: number,
): SizeValue {
  const slope = ((max - min) * 16 * 100) / (maxViewport - minViewport);
  const intercept = min - (slope * minViewport) / 1600;
  return { kind: "fluid", min, max, intercept: round(intercept), slope: round(slope) };
}

/** The size in rem at a viewport width in px (fixed sizes ignore the viewport). */
export function sizeAt(size: SizeValue, viewport: number): number {
  if (size.kind === "fixed") return size.value;
  const preferred = size.intercept + (size.slope * viewport) / 1600;
  return Math.min(size.max, Math.max(size.min, preferred));
}

/** The smallest and largest size a variant can take, in rem. */
export const sizeRange = (size: SizeValue): [min: number, max: number] =>
  size.kind === "fixed" ? [size.value, size.value] : [size.min, size.max];

/** CSS text of a size. A negative intercept stays a leading negative rem term. */
export function formatSize(size: SizeValue): string {
  if (size.kind === "fixed") return `${formatNumber(size.value)}${size.unit}`;
  const { min, max, intercept, slope } = size;
  return `clamp(${formatNumber(min)}rem, ${formatNumber(intercept)}rem + ${formatNumber(slope)}vw, ${formatNumber(max)}rem)`;
}

const number = String.raw`(-?\d*\.?\d+)`;
const fixedPattern = new RegExp(`^${number}(rem|em)$`);
const clampPattern = new RegExp(
  String.raw`^clamp\(\s*${number}rem\s*,\s*${number}rem\s*\+\s*${number}vw\s*,\s*${number}rem\s*\)$`,
);

/**
 * A size typed by the user or read from an export: `<n>rem`, `<n>em` or the D4 `clamp()` form. Sizes
 * must be positive and a fluid minimum must not exceed its maximum.
 */
export function parseSize(text: string): SizeValue | undefined {
  const value = text.trim().replace(/\s+/g, " ");
  const fixed = fixedPattern.exec(value);
  if (fixed) {
    const amount = Number(fixed[1]);
    return amount > 0
      ? { kind: "fixed", value: amount, unit: fixed[2] as "rem" | "em" }
      : undefined;
  }
  const clamp = clampPattern.exec(value);
  if (!clamp) return undefined;
  const [min, intercept, slope, max] = clamp.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
  ];
  if (!(min > 0 && max >= min && slope >= 0)) return undefined;
  return { kind: "fluid", min, max, intercept, slope };
}

/** Whether every term of a CSS size includes `rem` (WCAG 1.4.4: text must grow with zoom). */
export function hasRemTerms(css: string): boolean {
  const value = css.trim();
  if (!value.startsWith("clamp(")) return /rem$|em$/.test(value);
  const inner = value.slice("clamp(".length, -1);
  return inner.split(",").every((term) => /rem/.test(term));
}

import { describe, expect, it } from "vitest";
import { defaultScale } from "./default-typography";
import { fluidSize, formatSize, hasRemTerms, parseSize, sizeAt, sizeRange } from "./fluid-size";
import { generateScale, headingLineHeight, headingTracking, minSmallSize } from "./generate-scale";

const ratios = [1.125, 1.2, 1.25, 1.333, Math.SQRT2];
const bases = [14, 15, 16, 17, 18, 19, 20];
const textOrder = ["caption", "body-sm", "body", "body-lg", "lead"] as const;
const headingOrder = ["h6", "h5", "h4", "h3", "h2", "h1", "display"] as const;

describe("generateScale", () => {
  it.each(
    ratios.flatMap((ratio) =>
      bases.flatMap((basePx) => [true, false].map((fluid) => [ratio, basePx, fluid] as const)),
    ),
  )("grows monotonically (ratio %s, base %spx, fluid %s)", (ratio, basePx, fluid) => {
    const scale = generateScale({ ...defaultScale, ratio, basePx, fluid });
    for (const order of [textOrder, headingOrder]) {
      for (let index = 1; index < order.length; index++) {
        const [lowerMin, lowerMax] = sizeRange(scale[order[index - 1] as keyof typeof scale].size);
        const [higherMin, higherMax] = sizeRange(scale[order[index] as keyof typeof scale].size);
        expect(higherMax).toBeGreaterThanOrEqual(lowerMax);
        expect(higherMin).toBeGreaterThanOrEqual(lowerMin);
      }
    }
  });

  it("keeps body at the base size and code relative", () => {
    const scale = generateScale({ ...defaultScale, basePx: 18 });
    expect(scale.body.size).toEqual({ kind: "fixed", value: 1.125, unit: "rem" });
    expect(scale.code.size).toEqual({ kind: "fixed", value: 0.875, unit: "em" });
  });

  it("floors small text at 0.75rem", () => {
    const scale = generateScale({ ...defaultScale, basePx: 14, ratio: Math.SQRT2 });
    expect(scale.caption.size).toEqual({ kind: "fixed", value: minSmallSize, unit: "rem" });
  });

  it("makes only display, h1 and h2 fluid", () => {
    const scale = generateScale({ ...defaultScale, fluid: true });
    expect(scale.display.size.kind).toBe("fluid");
    expect(scale.h2.size.kind).toBe("fluid");
    expect(scale.h3.size.kind).toBe("fixed");
    expect(generateScale({ ...defaultScale, fluid: false }).display.size.kind).toBe("fixed");
  });

  it("keeps fonts, weights and transforms of the preset", () => {
    const scale = generateScale({ ...defaultScale, ratio: Math.SQRT2 });
    expect(scale.overline).toMatchObject({ weight: 600, transform: "uppercase", tracking: 0.08 });
    expect(scale.h1.font).toBe("heading");
  });

  it("tightens line height and tracking as headings grow", () => {
    expect(headingLineHeight(16)).toBe(1.5);
    expect(headingLineHeight(32)).toBe(1.2);
    expect(headingLineHeight(80)).toBe(1.1);
    expect(headingTracking(16)).toBe(0);
    expect(headingTracking(32)).toBe(-0.02);
    expect(headingTracking(200)).toBe(-0.04);
  });
});

describe("fluid sizes", () => {
  it("equals the minimum at the small viewport and the maximum at the large one", () => {
    const size = fluidSize(2, 3, 360, 1280);
    expect(sizeAt(size, 360)).toBeCloseTo(2, 2);
    expect(sizeAt(size, 1280)).toBeCloseTo(3, 2);
    expect(sizeAt(size, 200)).toBe(2);
    expect(sizeAt(size, 2000)).toBe(3);
  });

  it("formats and parses the package's clamp() form", () => {
    const text = "clamp(2.5rem, 1.75rem + 2.5vw, 3.75rem)";
    const size = parseSize(text);
    expect(size).toEqual({ kind: "fluid", min: 2.5, max: 3.75, intercept: 1.75, slope: 2.5 });
    expect(size && formatSize(size)).toBe(text);
  });

  it("keeps a negative intercept as a leading negative rem term", () => {
    const size = { kind: "fluid", min: 1, max: 4, intercept: -0.2, slope: 3 } as const;
    expect(formatSize(size)).toBe("clamp(1rem, -0.2rem + 3vw, 4rem)");
    expect(parseSize(formatSize(size))).toEqual(size);
  });

  it("rejects invalid sizes", () => {
    for (const text of ["big", "0rem", "12px", "clamp(3rem, 1rem + 2vw, 2rem)", "-1rem"]) {
      expect(parseSize(text), text).toBeUndefined();
    }
    expect(parseSize(" 1.25rem ")).toEqual({ kind: "fixed", value: 1.25, unit: "rem" });
    expect(parseSize("0.875em")).toEqual({ kind: "fixed", value: 0.875, unit: "em" });
  });

  it("detects terms without rem", () => {
    expect(hasRemTerms("clamp(2rem, 1rem + 2vw, 3rem)")).toBe(true);
    expect(hasRemTerms("clamp(32px, 5vw, 48px)")).toBe(false);
  });
});

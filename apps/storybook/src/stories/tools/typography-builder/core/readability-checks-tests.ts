import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import { checkReadability } from "./readability-checks";
import { resolveTypography } from "./resolve-typography";
import type { TypographyDraft, VariantOverrides } from "./typography-types";

const issues = (overrides: VariantOverrides, patch: Partial<TypographyDraft> = {}) =>
  checkReadability(resolveTypography({ ...createDefaultDraft(), ...patch, overrides }));

describe("checkReadability", () => {
  it("passes the default typography", () => {
    expect(issues({})).toEqual([]);
  });

  it("flags small body text", () => {
    expect(issues({ body: { size: { kind: "fixed", value: 0.8, unit: "rem" } } })).toEqual([
      { check: "body-too-small", variant: "body", value: "0.8rem" },
    ]);
  });

  it("flags tight reading line heights", () => {
    expect(issues({ lead: { lineHeight: 1.2 } })).toEqual([
      { check: "line-height-tight", variant: "lead", value: "1.2" },
    ]);
  });

  it("flags a heading smaller than the level below", () => {
    expect(issues({ h3: { size: { kind: "fixed", value: 1.1, unit: "rem" } } })).toEqual([
      { check: "heading-order", variant: "h3", value: "1.1rem" },
    ]);
  });

  it("flags a weight the font does not provide", () => {
    const result = issues(
      { h2: { weight: 600 } },
      { fonts: { ...createDefaultDraft().fonts, heading: { kind: "catalog", id: "space-mono" } } },
    );
    expect(result).toContainEqual({ check: "weight-unavailable", variant: "h2", value: "600" });
  });

  it("flags a fluid size whose preferred value has no positive rem term", () => {
    expect(
      issues({ display: { size: { kind: "fluid", min: 2.5, max: 4, intercept: 0, slope: 4 } } }),
    ).toEqual([
      { check: "fluid-without-rem", variant: "display", value: "clamp(2.5rem, 0rem + 4vw, 4rem)" },
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./core/default-typography";
import { fontPairings } from "./core/font-pairings";
import { resolveTypography } from "./core/resolve-typography";
import { typographyReducer } from "./use-typography-draft";

describe("typographyReducer", () => {
  it("switches to a generated base when the scale changes, and keeps overrides", () => {
    const withOverride = typographyReducer(createDefaultDraft(), {
      type: "override",
      variant: "h1",
      patch: { weight: 800 },
    });
    const next = typographyReducer(withOverride, { type: "scale", patch: { ratio: 1.333 } });
    expect(next.base).toEqual({ kind: "generated" });
    expect(next.overrides.h1).toEqual({ weight: 800 });
    expect(resolveTypography(next).variants.h1.weight).toBe(800);
  });

  it("never changes the base for fonts, tracking or overrides", () => {
    let draft = createDefaultDraft();
    draft = typographyReducer(draft, {
      type: "font",
      role: "sans",
      choice: { kind: "catalog", id: "inter" },
    });
    draft = typographyReducer(draft, { type: "tracking", value: 0.01 });
    draft = typographyReducer(draft, {
      type: "override",
      variant: "body",
      patch: { lineHeight: 1.7 },
    });
    expect(draft.base).toEqual({ kind: "preset", id: "aureus" });
  });

  it("applies a pairing to the fonts only", () => {
    const start = typographyReducer(createDefaultDraft(), {
      type: "override",
      variant: "h2",
      patch: { weight: 800 },
    });
    const pairing = fontPairings.find((entry) => entry.id === "inter-jetbrains");
    if (!pairing) throw new Error("missing pairing");
    const next = typographyReducer(start, { type: "fonts", fonts: pairing.fonts });
    expect(next.fonts.sans).toEqual({ kind: "catalog", id: "inter" });
    expect(next.overrides).toEqual(start.overrides);
    expect(next.scale).toEqual(start.scale);
  });

  it("stores only values that differ from the base and resets one property", () => {
    let draft = typographyReducer(createDefaultDraft(), {
      type: "override",
      variant: "h3",
      patch: { weight: 600, tracking: 0 },
    });
    expect(draft.overrides.h3).toEqual({ tracking: 0 });
    draft = typographyReducer(draft, {
      type: "override",
      variant: "h3",
      patch: { transform: "uppercase" },
    });
    draft = typographyReducer(draft, {
      type: "resetOverride",
      variant: "h3",
      property: "tracking",
    });
    expect(draft.overrides.h3).toEqual({ transform: "uppercase" });
    draft = typographyReducer(draft, {
      type: "resetOverride",
      variant: "h3",
      property: "transform",
    });
    expect(draft.overrides.h3).toBeUndefined();
  });

  it("resets to the default", () => {
    const edited = typographyReducer(createDefaultDraft(), { type: "name", name: "Docs" });
    expect(typographyReducer(edited, { type: "reset" })).toEqual(createDefaultDraft());
  });
});

import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import {
  importTypography,
  knownVariables,
  parseFontStack,
  parseTypographyCss,
} from "./parse-typography";
import { resolveTypography } from "./resolve-typography";
import { serializeTypography } from "./serialize-typography";
import type { TypographyDraft } from "./typography-types";

function roundTrip(draft: TypographyDraft) {
  const css = serializeTypography(resolveTypography(draft));
  const result = importTypography(createDefaultDraft(), parseTypographyCss(css));
  if (!result.ok) throw new Error("import failed");
  return { css, result };
}

describe("importTypography", () => {
  it.each([
    ["the default", createDefaultDraft()],
    [
      "a pairing with overrides",
      {
        ...createDefaultDraft(),
        fonts: {
          sans: { kind: "catalog", id: "inter" },
          heading: { kind: "catalog", id: "fraunces" },
          serif: { kind: "system" },
          mono: { kind: "catalog", id: "dm-mono" },
        },
        tracking: 0.01,
        overrides: { h2: { weight: 800, transform: "uppercase" }, lead: { lineHeight: 1.7 } },
      } satisfies TypographyDraft,
    ],
    [
      "a custom font and a generated scale",
      {
        ...createDefaultDraft(),
        base: { kind: "generated" },
        scale: {
          basePx: 17,
          ratio: 1.333,
          fluid: true,
          minViewport: 375,
          maxViewport: 1440,
          minRatio: 1.2,
        },
        fonts: {
          ...createDefaultDraft().fonts,
          heading: { kind: "custom", family: "Comic Neue", fontsource: "@fontsource/comic-neue" },
        },
      } satisfies TypographyDraft,
    ],
  ])("round-trips %s exactly, with nothing ignored or missing", (_label, draft) => {
    const { css, result } = roundTrip(draft);
    expect(result.report.ignored).toEqual([]);
    expect(result.report.missing).toEqual([]);
    expect(result.report.imported).toBe(knownVariables.length);
    const { name: _a, ...expected } = resolveTypography(draft);
    const { name: _b, ...actual } = resolveTypography(result.draft);
    expect(actual.variants).toEqual(expected.variants);
    expect(actual.tracking).toBe(expected.tracking);
    for (const role of ["sans", "heading", "serif", "mono"] as const) {
      expect(actual.fonts[role].stack).toBe(expected.fonts[role].stack);
      expect(actual.fonts[role].fontsource).toBe(expected.fonts[role].fontsource);
    }
    expect(serializeTypography(resolveTypography({ ...result.draft, name: draft.name }))).toBe(css);
  });

  it("reports missing and ignored declarations", () => {
    const css = `:root { --typography-h1-weight: 800; --typography-h2-size: big; --primary: red; --typography-h9-size: 1rem; }`;
    const result = importTypography(createDefaultDraft(), parseTypographyCss(css));
    if (!result.ok) throw new Error("import failed");
    expect(result.report.imported).toBe(1);
    expect(result.report.ignored).toEqual([
      "--typography-h2-size",
      "--primary",
      "--typography-h9-size",
    ]);
    expect(result.report.missing).toContain("--typography-body-size");
    expect(result.draft.overrides.h1).toEqual({ weight: 800 });
  });

  it("rejects CSS without typography variables", () => {
    const before = createDefaultDraft();
    expect(
      importTypography(before, parseTypographyCss(":root { --primary: oklch(0.5 0.2 260); }")),
    ).toEqual({ ok: false });
    expect(importTypography(before, parseTypographyCss(".a { color: red }"))).toEqual({
      ok: false,
    });
  });

  it("recovers a custom font's package from its import", () => {
    expect(
      parseFontStack("sans", '"Comic Neue", sans-serif', ["@fontsource-variable/comic-neue"]),
    ).toEqual({
      kind: "custom",
      family: "Comic Neue",
      fontsource: "@fontsource-variable/comic-neue",
    });
    expect(parseFontStack("sans", '"Inter Variable", sans-serif', [])).toEqual({
      kind: "catalog",
      id: "inter",
    });
    expect(parseFontStack("mono", '"Geist Mono", monospace', [])).toEqual({ kind: "bundled" });
    expect(parseFontStack("sans", "var(--other)", [])).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import { findCatalogFont } from "./font-catalog";
import {
  bundledStacks,
  fontsourceSlug,
  guessFontsource,
  isValidFamily,
  isValidFontsource,
  resolveFont,
  webFontStack,
} from "./font-stack";
import { catalogFontsUrl, googleFontsUrl } from "./google-fonts-url";
import { installCommand, unverifiedPackages } from "./install-command";
import { resolveFonts } from "./resolve-typography";

describe("font stacks", () => {
  it("lists the variable and static names of a variable font", () => {
    expect(resolveFont("sans", { kind: "catalog", id: "inter" }).stack).toBe(
      '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
    );
    expect(webFontStack("Lato", false, "sans")).toBe(
      '"Lato", ui-sans-serif, system-ui, sans-serif',
    );
  });

  it("uses the package stacks for bundled fonts", () => {
    expect(resolveFont("sans", { kind: "bundled" }).stack).toBe(bundledStacks.sans);
    expect(resolveFont("mono", { kind: "bundled" }).stack).toContain('"Geist Mono Variable"');
    expect(bundledStacks.heading).toBe("var(--typography-font-sans)");
  });

  it("makes a bundled heading follow the text font", () => {
    const draft = createDefaultDraft();
    draft.fonts.sans = { kind: "catalog", id: "inter" };
    const fonts = resolveFonts(draft);
    expect(fonts.heading.stack).toBe("var(--typography-font-sans)");
    expect(fonts.heading.family).toBe("Inter");
    expect(fonts.heading.fontsource).toBeUndefined();
  });

  it("proposes an unverified static package for a custom family", () => {
    expect(fontsourceSlug(" Atkinson Hyperlegible Next ")).toBe("atkinson-hyperlegible-next");
    expect(guessFontsource("Comic Neue")).toBe("@fontsource/comic-neue");
    const custom = resolveFont("heading", {
      kind: "custom",
      family: "Comic Neue",
      fontsource: "@fontsource/comic-neue",
    });
    expect(custom.verified).toBe(false);
    expect(custom.stack).toBe('"Comic Neue", ui-sans-serif, system-ui, sans-serif');
  });

  it("validates families and package names", () => {
    expect(isValidFamily("Source Serif 4")).toBe(true);
    expect(isValidFamily("Bad; font")).toBe(false);
    expect(isValidFontsource("@fontsource-variable/inter")).toBe(true);
    expect(isValidFontsource("left-pad")).toBe(false);
  });
});

describe("Google Fonts URL (preview only)", () => {
  it("requests nothing for bundled fonts", () => {
    expect(googleFontsUrl(resolveFonts(createDefaultDraft()))).toBeUndefined();
  });

  it("requests a weight range for variable fonts and a list for static ones", () => {
    const draft = createDefaultDraft();
    draft.fonts.sans = { kind: "catalog", id: "inter" };
    draft.fonts.mono = { kind: "catalog", id: "dm-mono" };
    expect(googleFontsUrl(resolveFonts(draft))).toBe(
      "https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Inter:wght@100..900&display=swap",
    );
  });

  it("loads one page of the explorer", () => {
    const inter = findCatalogFont("inter");
    if (!inter) throw new Error("missing");
    expect(catalogFontsUrl([inter])).toContain("family=Inter:wght@100..900");
    expect(catalogFontsUrl([])).toBeUndefined();
  });
});

describe("install command", () => {
  it("is empty for the default and sorted for a pairing", () => {
    const draft = createDefaultDraft();
    expect(installCommand({ fonts: resolveFonts(draft) })).toBeUndefined();
    draft.fonts.sans = { kind: "catalog", id: "inter" };
    draft.fonts.mono = { kind: "catalog", id: "jetbrains-mono" };
    draft.fonts.heading = {
      kind: "custom",
      family: "Comic Neue",
      fontsource: "@fontsource/comic-neue",
    };
    const fonts = resolveFonts(draft);
    expect(installCommand({ fonts })).toBe(
      "pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono @fontsource/comic-neue",
    );
    expect(unverifiedPackages({ fonts })).toEqual(["@fontsource/comic-neue"]);
  });
});

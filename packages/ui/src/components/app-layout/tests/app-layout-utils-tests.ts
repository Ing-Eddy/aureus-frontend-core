import { afterEach, describe, expect, it, vi } from "vitest";
import * as classes from "../utils/app-layout-classes";
import { firstLetter } from "../utils/first-letter";
import { readPersistedState, writePersistedState } from "../utils/persisted-state";
import { oppositeSide, resolvePhysicalSide } from "../utils/resolve-physical-side";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("firstLetter", () => {
  it.each([
    ["Usuarios", "U"],
    ["ítems", "Í"],
    ["  espacio", "E"],
    ["🚀 Lanzamientos", "🚀"],
    ["👨‍👩‍👧 Familia", "👨‍👩‍👧"],
    ["", ""],
  ])("%s → %s", (label, letter) => {
    expect(firstLetter(label)).toBe(letter);
  });

  it("falls back to the first code point without Intl.Segmenter", () => {
    vi.stubGlobal("Intl", { ...Intl, Segmenter: undefined });
    expect(firstLetter("ítems")).toBe("Í");
    expect(firstLetter("🚀 Lanzamientos")).toBe("🚀");
  });
});

describe("resolvePhysicalSide", () => {
  it.each([
    ["start", "ltr", "left"],
    ["start", "rtl", "right"],
    ["end", "ltr", "right"],
    ["end", "rtl", "left"],
  ] as const)("%s in %s is %s", (side, direction, physical) => {
    expect(resolvePhysicalSide(side, direction)).toBe(physical);
  });

  it("gives the opposite edge", () => {
    expect(oppositeSide("left")).toBe("right");
    expect(oppositeSide("right")).toBe("left");
  });
});

describe("persisted state", () => {
  it("round-trips open and side", () => {
    writePersistedState("k", { open: false, side: "end" });
    expect(readPersistedState("k")).toEqual({ open: false, side: "end" });
  });

  it("ignores a missing key and invalid values", () => {
    expect(readPersistedState(undefined)).toBeUndefined();
    expect(readPersistedState("missing")).toBeUndefined();
    localStorage.setItem("bad", "{not json");
    expect(readPersistedState("bad")).toBeUndefined();
    localStorage.setItem("odd", JSON.stringify({ open: "yes", side: "left" }));
    expect(readPersistedState("odd")).toEqual({ open: undefined, side: undefined });
  });

  it("survives a throwing storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readPersistedState("k")).toBeUndefined();
    expect(() => writePersistedState("k", { open: true })).not.toThrow();
  });
});

describe("classes", () => {
  const all = Object.values(classes as Record<string, unknown>)
    .filter((value): value is string | Record<string, string> => typeof value !== "function")
    .flatMap((value) => (typeof value === "string" ? [value] : Object.values(value)));
  const functionOutputs = [
    classes.sidebarWidthClassName(true, "icon", "floating"),
    classes.sidebarContainerVariantClassName("sidebar", "start"),
    classes.sidebarContainerVariantClassName("sidebar", "end"),
    classes.insetVariantClassName("start", true),
    classes.insetVariantClassName("end", false),
    classes.menuButtonEndPadding(true, true),
    classes.menuBadgeOffsetClassName(true),
  ];

  it("uses no physical side utilities", () => {
    const physical =
      /(^|[\s:])-?(left|right|pl|pr|ml|mr|border-l|border-r|rounded-l|rounded-r)-|(^|[\s:])(border-l|border-r|text-left|text-right)(\s|$)/;
    for (const value of [...all, ...functionOutputs]) expect(value).not.toMatch(physical);
  });

  it("keeps the padding with every max width", () => {
    for (const value of Object.values(classes.mainMaxWidthClassNames)) {
      expect(value).not.toMatch(/(^|\s)p[xytrbse]?-/);
    }
    expect(classes.mainContentClassName).toContain("p-4");
  });
});

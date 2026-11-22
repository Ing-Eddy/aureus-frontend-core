import { describe, expect, it } from "vitest";
import type { DraftStorage } from "../../shared/storage";
import { createDefaultDraft } from "./default-typography";
import {
  typographyStorageKey,
  typographyStore,
  validateTypographyDraft,
} from "./typography-storage";
import type { TypographyDraft } from "./typography-types";

function memoryStorage(): DraftStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

const edited = (): TypographyDraft => ({
  ...createDefaultDraft(),
  name: "Docs",
  base: { kind: "generated" },
  fonts: {
    sans: { kind: "catalog", id: "inter" },
    heading: { kind: "custom", family: "Comic Neue", fontsource: "@fontsource/comic-neue" },
    serif: { kind: "system" },
    mono: { kind: "bundled" },
  },
  scale: {
    basePx: 17,
    ratio: 1.333,
    fluid: false,
    minViewport: 360,
    maxViewport: 1280,
    minRatio: 1.2,
  },
  tracking: 0.01,
  overrides: {
    h2: { weight: 800, size: { kind: "fluid", min: 1.5, max: 2, intercept: 1.2, slope: 1 } },
  },
});

describe("typography draft storage", () => {
  it("round-trips a valid draft", () => {
    const storage = memoryStorage();
    typographyStore(storage).save(edited());
    expect(typographyStore(storage).load()).toEqual(edited());
  });

  const invalid: [string, (draft: TypographyDraft) => unknown][] = [
    ["a wrong version", (draft) => ({ ...draft, version: 2 })],
    [
      "an unknown catalog font",
      (draft) => ({ ...draft, fonts: { ...draft.fonts, sans: { kind: "catalog", id: "nope" } } }),
    ],
    [
      "an invalid custom package",
      (draft) => ({
        ...draft,
        fonts: {
          ...draft.fonts,
          heading: { kind: "custom", family: "X Y", fontsource: "left-pad" },
        },
      }),
    ],
    ["a base size out of range", (draft) => ({ ...draft, scale: { ...draft.scale, basePx: 40 } })],
    ["an unknown variant override", (draft) => ({ ...draft, overrides: { h9: { weight: 700 } } })],
    ["an unknown property", (draft) => ({ ...draft, overrides: { h1: { color: "red" } } })],
    [
      "an invalid size",
      (draft) => ({
        ...draft,
        overrides: { h1: { size: { kind: "fluid", min: 3, max: 2, intercept: 0, slope: 1 } } },
      }),
    ],
    ["a missing field", ({ fonts: _fonts, ...rest }) => rest],
  ];
  it.each(invalid)("falls back to the default with %s", (_label, mutate) => {
    expect(validateTypographyDraft(mutate(edited()))).toBeUndefined();
    const storage = memoryStorage();
    storage.setItem(typographyStorageKey, JSON.stringify(mutate(edited())));
    expect(typographyStore(storage).load()).toEqual(createDefaultDraft());
  });
});

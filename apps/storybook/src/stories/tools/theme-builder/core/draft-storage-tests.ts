import { afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultDraft } from "./default-theme";
import {
  clearDraft,
  createDraftSaver,
  type DraftStorage,
  draftStorageKey,
  loadDraft,
  saveDraft,
} from "./draft-storage";
import type { ThemeDraft } from "./theme-types";

function memoryStorage(): DraftStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

const throwing: DraftStorage = {
  getItem: () => {
    throw new Error("denied");
  },
  setItem: () => {
    throw new Error("denied");
  },
  removeItem: () => {
    throw new Error("denied");
  },
};

const edited = (): ThemeDraft => ({
  ...createDefaultDraft(),
  name: "Edited",
  base: { kind: "generated" },
  inputs: {
    ...createDefaultDraft().inputs,
    achromaticPrimary: false,
    primary: "oklch(0.6 0.2 30)",
  },
  overrides: { light: { accent: "oklch(0.9 0.05 90)" }, dark: {} },
});

describe("draft storage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips a valid draft", () => {
    const storage = memoryStorage();
    saveDraft(storage, edited());
    expect(loadDraft(storage)).toEqual(edited());
  });

  it("returns the default draft when nothing is stored", () => {
    expect(loadDraft(memoryStorage())).toEqual(createDefaultDraft());
    expect(loadDraft(undefined)).toEqual(createDefaultDraft());
  });

  const corrupt: [string, (draft: ThemeDraft) => unknown][] = [
    ["a wrong version", (draft) => ({ ...draft, version: 2 })],
    ["an unknown palette", (draft) => ({ ...draft, inputs: { ...draft.inputs, neutral: "pink" } })],
    ["an unknown base", (draft) => ({ ...draft, base: { kind: "preset", id: "other" } })],
    [
      "an unparseable color",
      (draft) => ({ ...draft, inputs: { ...draft.inputs, primary: "nope" } }),
    ],
    [
      "an override of an unknown token",
      (draft) => ({ ...draft, overrides: { light: { brand: "oklch(0.5 0.1 10)" }, dark: {} } }),
    ],
    ["a missing field", ({ inputs: _inputs, ...rest }) => rest],
  ];
  it.each(corrupt)("falls back to the default with %s", (_label, mutate) => {
    const storage = memoryStorage();
    storage.setItem(draftStorageKey, JSON.stringify(mutate(edited())));
    expect(loadDraft(storage)).toEqual(createDefaultDraft());
  });

  it("falls back to the default with corrupt JSON", () => {
    const storage = memoryStorage();
    storage.setItem(draftStorageKey, "{not json");
    expect(loadDraft(storage)).toEqual(createDefaultDraft());
  });

  it("never throws when storage throws", () => {
    expect(loadDraft(throwing)).toEqual(createDefaultDraft());
    expect(() => saveDraft(throwing, edited())).not.toThrow();
    expect(() => clearDraft(throwing)).not.toThrow();
  });

  it("clears the stored draft", () => {
    const storage = memoryStorage();
    saveDraft(storage, edited());
    clearDraft(storage);
    expect(storage.data.size).toBe(0);
  });

  it("debounces saves", () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const saver = createDraftSaver(storage, 300);
    saver.save({ ...edited(), name: "a" });
    saver.save({ ...edited(), name: "b" });
    expect(storage.data.size).toBe(0);
    vi.advanceTimersByTime(300);
    expect(loadDraft(storage).name).toBe("b");
    saver.save({ ...edited(), name: "c" });
    saver.cancel();
    vi.advanceTimersByTime(300);
    expect(loadDraft(storage).name).toBe("b");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore, type DraftStorage } from "./draft-storage";

interface Draft {
  version: 2;
  name: string;
}

function memoryStorage(
  initial: Record<string, string> = {},
): DraftStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
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

const validate = (value: unknown): Draft | undefined =>
  typeof value === "object" &&
  value !== null &&
  (value as Draft).version === 2 &&
  typeof (value as Draft).name === "string"
    ? (value as Draft)
    : undefined;

const options = {
  key: "tool:draft:v2",
  validate,
  create: (): Draft => ({ version: 2, name: "custom" }),
  legacy: [
    {
      key: "tool:draft:v1",
      migrate: (value: unknown) =>
        typeof value === "object" && value !== null && "title" in value
          ? { version: 2, name: String((value as { title: unknown }).title) }
          : undefined,
    },
  ],
};

describe("createStore", () => {
  it("round-trips a valid draft", () => {
    const storage = memoryStorage();
    const store = createStore(storage, options);
    store.save({ version: 2, name: "Ocean" });
    expect(store.load()).toEqual({ version: 2, name: "Ocean" });
    store.clear();
    expect(store.load()).toEqual({ version: 2, name: "custom" });
  });

  it("falls back to the default on corrupt JSON or an invalid shape", () => {
    expect(createStore(memoryStorage({ "tool:draft:v2": "{oops" }), options).load().name).toBe(
      "custom",
    );
    expect(
      createStore(memoryStorage({ "tool:draft:v2": '{"version":1}' }), options).load().name,
    ).toBe("custom");
  });

  it("keeps working when storage throws", () => {
    const store = createStore(throwing, options);
    expect(store.load().name).toBe("custom");
    expect(() => store.save({ version: 2, name: "x" })).not.toThrow();
    expect(() => store.clear()).not.toThrow();
  });

  it("migrates a legacy draft, saves it under the new key and removes the old one", () => {
    const storage = memoryStorage({ "tool:draft:v1": '{"title":"Old"}' });
    expect(createStore(storage, options).load()).toEqual({ version: 2, name: "Old" });
    expect(storage.data.has("tool:draft:v1")).toBe(false);
    expect(JSON.parse(storage.data.get("tool:draft:v2") ?? "")).toEqual({
      version: 2,
      name: "Old",
    });
  });

  it("discards a legacy draft that cannot be migrated", () => {
    const storage = memoryStorage({ "tool:draft:v1": '{"other":1}' });
    expect(createStore(storage, options).load().name).toBe("custom");
    expect(storage.data.has("tool:draft:v1")).toBe(false);
  });

  it("prefers the current key over a legacy one", () => {
    const storage = memoryStorage({
      "tool:draft:v1": '{"title":"Old"}',
      "tool:draft:v2": '{"version":2,"name":"New"}',
    });
    expect(createStore(storage, options).load().name).toBe("New");
  });
});

describe("saver", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("debounces saves, flushes on demand and cancels", () => {
    const storage = memoryStorage();
    const saver = createStore(storage, options).saver(300);
    saver.save({ version: 2, name: "a" });
    saver.save({ version: 2, name: "b" });
    expect(storage.data.size).toBe(0);
    vi.advanceTimersByTime(300);
    expect(JSON.parse(storage.data.get("tool:draft:v2") ?? "").name).toBe("b");

    saver.save({ version: 2, name: "c" });
    saver.flush();
    expect(JSON.parse(storage.data.get("tool:draft:v2") ?? "").name).toBe("c");

    saver.save({ version: 2, name: "d" });
    saver.cancel();
    vi.advanceTimersByTime(300);
    expect(JSON.parse(storage.data.get("tool:draft:v2") ?? "").name).toBe("c");
  });
});

import { describe, expect, it } from "vitest";
import { mergeValues } from "../utils/helpers";

describe("mergeValues", () => {
  it("merges nested objects", () => {
    const defaults = { name: "", address: { city: "", street: "" } };
    expect(mergeValues(defaults, { name: "Acme", address: { city: "Lima" } })).toEqual({
      name: "Acme",
      address: { city: "Lima", street: "" },
    });
  });

  it("replaces arrays and dates", () => {
    const date = new Date("2026-01-02T00:00:00Z");
    const defaults = { tags: ["a", "b"], items: [{ name: "", qty: 0 }], at: new Date(0) };
    const merged = mergeValues(defaults, { tags: ["c"], items: [{ name: "x" }], at: date });
    expect(merged).toEqual({ tags: ["c"], items: [{ name: "x" }], at: date });
    expect(merged.at).toBe(date);
  });

  it("keeps the default for undefined and keeps null", () => {
    const defaults = { name: "x", note: "n" as string | null };
    expect(mergeValues(defaults, { name: undefined, note: null })).toEqual({
      name: "x",
      note: null,
    });
  });

  it("merges objects with a null prototype", () => {
    const values = Object.assign(Object.create(null) as Record<string, unknown>, { a: 1 });
    expect(mergeValues({ a: 0, b: 2 }, values)).toEqual({ a: 1, b: 2 });
  });

  it("returns the defaults when values is undefined", () => {
    const defaults = { a: 1 };
    expect(mergeValues(defaults, undefined)).toBe(defaults);
  });

  it("mutates neither input", () => {
    const defaults = { a: { b: 1, c: 2 } };
    const values = { a: { b: 5 } };
    const merged = mergeValues(defaults, values);
    expect(defaults).toEqual({ a: { b: 1, c: 2 } });
    expect(values).toEqual({ a: { b: 5 } });
    expect(merged.a).not.toBe(defaults.a);
  });
});

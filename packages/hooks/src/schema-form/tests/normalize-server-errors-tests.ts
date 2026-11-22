import { afterEach, describe, expect, it, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import { normalizeServerErrors } from "../utils/helpers";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

describe("normalizeServerErrors", () => {
  it("accepts a string or an array of messages", () => {
    expect(normalizeServerErrors({ a: "One", b: ["Two", "Three"] }, "test")).toEqual([
      { name: "a", messages: ["One"] },
      { name: "b", messages: ["Two", "Three"] },
    ]);
  });

  it("removes empty messages and drops keys without messages", () => {
    expect(
      normalizeServerErrors({ a: ["", "  ", "Kept"], b: [], c: null, d: undefined, e: "" }, "test"),
    ).toEqual([{ name: "a", messages: ["Kept"] }]);
  });

  it("keeps dot paths and root keys as given", () => {
    const names = normalizeServerErrors(
      { "items.0.name": "x", "address.city": "y", root: "z", "root.server": "w" },
      "test",
    ).map(({ name }) => name);
    expect(names).toEqual(["items.0.name", "address.city", "root", "root.server"]);
  });

  it("returns nothing for null and undefined", () => {
    expect(normalizeServerErrors(null, "test")).toEqual([]);
    expect(normalizeServerErrors(undefined, "test")).toEqual([]);
  });

  it("ignores a value that is not an object, with one warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeServerErrors(["email"], "useSchemaForm")).toEqual([]);
    expect(normalizeServerErrors("oops", "useSchemaForm")).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/^\[useSchemaForm\] /);
  });
});

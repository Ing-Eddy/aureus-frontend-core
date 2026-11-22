import { describe, expect, it } from "vitest";
import { fill, placeholders } from "./fill";

describe("fill", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fill("{count} of {total} ({other})", { count: 2, total: "5" })).toBe("2 of 5 ({other})");
  });

  it("lists the placeholders sorted", () => {
    expect(placeholders("{b} and {a} and {b}")).toEqual(["a", "b", "b"]);
  });
});

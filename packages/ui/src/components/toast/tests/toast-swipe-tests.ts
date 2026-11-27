import { describe, expect, it } from "vitest";
import { resolveSwipeDirections } from "../utils/helpers";

describe("swipe directions", () => {
  it.each([
    ["bottom-end", "ltr", ["down", "right"]],
    ["bottom-end", "rtl", ["down", "left"]],
    ["bottom-start", "ltr", ["down", "left"]],
    ["top-start", "rtl", ["up", "right"]],
    ["top-end", "ltr", ["up", "right"]],
    ["top-center", "ltr", ["up"]],
    ["bottom-center", "rtl", ["down"]],
  ] as const)("%s in %s swipes toward its edges", (position, direction, expected) => {
    expect(resolveSwipeDirections(position, direction)).toEqual(expected);
  });
});

import { describe, expect, it } from "vitest";
import { isValidGroups, toBlocks } from "./otp-groups";

describe("otp groups", () => {
  it("splits the slots into the given blocks", () => {
    expect(toBlocks(6, [3, 3])).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ]);
    expect(toBlocks(6, [2, 2, 2])).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ]);
  });

  it("uses one block without groups or with groups that do not split the length", () => {
    expect(toBlocks(4)).toEqual([[0, 1, 2, 3]]);
    expect(toBlocks(6, [3, 2])).toEqual([[0, 1, 2, 3, 4, 5]]);
    expect(toBlocks(4, [4, 0])).toEqual([[0, 1, 2, 3]]);
    expect(isValidGroups(6, [3, 2])).toBe(false);
    expect(isValidGroups(6, [3, 3])).toBe(true);
  });
});

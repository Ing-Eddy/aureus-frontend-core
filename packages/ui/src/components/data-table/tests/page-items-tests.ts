import { describe, expect, it } from "vitest";
import { pageItems } from "../utils/page-items";

describe("pageItems", () => {
  it("lists every page when they fit", () => {
    expect(pageItems(1, 1, 1)).toEqual([1]);
    expect(pageItems(4, 7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("keeps the first and last pages, the siblings and the gaps", () => {
    expect(pageItems(1, 20, 1)).toEqual([1, 2, 3, 4, 5, "end-gap", 20]);
    expect(pageItems(4, 20, 1)).toEqual([1, 2, 3, 4, 5, "end-gap", 20]);
    expect(pageItems(10, 20, 1)).toEqual([1, "start-gap", 9, 10, 11, "end-gap", 20]);
    expect(pageItems(17, 20, 1)).toEqual([1, "start-gap", 16, 17, 18, 19, 20]);
    expect(pageItems(20, 20, 1)).toEqual([1, "start-gap", 16, 17, 18, 19, 20]);
  });

  it("keeps the same length while the current page moves", () => {
    for (let page = 1; page <= 20; page++) {
      expect(pageItems(page, 20, 1)).toHaveLength(7);
      expect(pageItems(page, 20, 0)).toHaveLength(5);
    }
  });

  it("without siblings, for narrow tables", () => {
    expect(pageItems(1, 6, 0)).toEqual([1, 2, 3, "end-gap", 6]);
    expect(pageItems(3, 6, 0)).toEqual([1, 2, 3, "end-gap", 6]);
    expect(pageItems(4, 6, 0)).toEqual([1, "start-gap", 4, 5, 6]);
    expect(pageItems(10, 20, 0)).toEqual([1, "start-gap", 10, "end-gap", 20]);
  });
});

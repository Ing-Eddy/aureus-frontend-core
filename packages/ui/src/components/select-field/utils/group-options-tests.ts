import { describe, expect, it } from "vitest";
import { groupOptions } from "./group-options";

describe("groupOptions", () => {
  it("puts ungrouped options first and keeps the order of first appearance", () => {
    const groups = groupOptions([
      { value: "es", label: "España", group: "Europa" },
      { value: "any", label: "Cualquiera" },
      { value: "mx", label: "México", group: "América" },
      { value: "fr", label: "Francia", group: "Europa" },
    ]);
    expect(groups.map((group) => group.title)).toEqual([undefined, "Europa", "América"]);
    expect(groups[1]?.options.map((option) => option.value)).toEqual(["es", "fr"]);
  });

  it("returns a single untitled group without groups", () => {
    expect(groupOptions([{ value: "a", label: "A" }])).toEqual([
      { options: [{ value: "a", label: "A" }] },
    ]);
  });
});

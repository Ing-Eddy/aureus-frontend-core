import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { radioGroupProblems, useRadioGroupWarnings } from "./use-radio-group-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useRadioGroupWarnings", () => {
  it("lists a missing group name and a missing input label", () => {
    expect(radioGroupProblems({ label: "Plan" })).toEqual([]);
    expect(radioGroupProblems({ "aria-label": "Plan" })).toEqual([]);
    expect(radioGroupProblems({})).toHaveLength(1);
    expect(radioGroupProblems({ label: "Plan", otherOption: { inputLabel: "" } })).toEqual([
      "`otherOption` needs `inputLabel`",
    ]);
  });

  it("warns once per problem", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useRadioGroupWarnings("RadioGroupField", {}));
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("RadioGroupField: the group has no accessible name"),
    );
  });
});

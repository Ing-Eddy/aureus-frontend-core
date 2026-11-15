import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hasGroupName, useCheckboxGroupWarnings } from "./use-checkbox-group-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useCheckboxGroupWarnings", () => {
  it("knows every prop that can name the group", () => {
    expect(hasGroupName({})).toBe(false);
    expect(hasGroupName({ label: "Channels" })).toBe(true);
    expect(hasGroupName({ "aria-label": "Channels" })).toBe(true);
    expect(hasGroupName({ "aria-labelledby": "heading" })).toBe(true);
  });

  it("warns without a name and stays silent with one", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useCheckboxGroupWarnings("CheckboxGroupField", { label: "Channels" }));
    expect(warn).not.toHaveBeenCalled();
    renderHook(() => useCheckboxGroupWarnings("CheckboxGroupField", {}));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("the group has no accessible name"));
  });
});

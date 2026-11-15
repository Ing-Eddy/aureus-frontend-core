import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hasAccessibleName, useCheckboxWarnings } from "./use-checkbox-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useCheckboxWarnings", () => {
  it("knows every prop that can name the box", () => {
    expect(hasAccessibleName({})).toBe(false);
    expect(hasAccessibleName({ label: "Terms" })).toBe(true);
    expect(hasAccessibleName({ checkboxLabel: "I accept" })).toBe(true);
    expect(hasAccessibleName({ "aria-label": "Select row" })).toBe(true);
    expect(hasAccessibleName({ "aria-labelledby": "heading" })).toBe(true);
  });

  it("warns when the box has no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useCheckboxWarnings("CheckboxField", {}));
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("CheckboxField: the checkbox has no accessible name"),
    );
  });

  it("does not warn when a name is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useCheckboxWarnings("CheckboxField", { checkboxLabel: "I accept" }));
    expect(warn).not.toHaveBeenCalled();
  });
});

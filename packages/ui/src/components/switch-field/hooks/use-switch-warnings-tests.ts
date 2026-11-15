import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hasSwitchName, useSwitchWarnings } from "./use-switch-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useSwitchWarnings", () => {
  it("knows every prop that can name the switch", () => {
    expect(hasSwitchName({})).toBe(false);
    expect(hasSwitchName({ label: "Alerts" })).toBe(true);
    expect(hasSwitchName({ switchLabel: "Alerts" })).toBe(true);
    expect(hasSwitchName({ "aria-label": "Alerts" })).toBe(true);
    expect(hasSwitchName({ "aria-labelledby": "heading" })).toBe(true);
  });

  it("warns without a name and stays silent with one", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useSwitchWarnings("SwitchField", { switchLabel: "Alerts" }));
    expect(warn).not.toHaveBeenCalled();
    renderHook(() => useSwitchWarnings("SwitchField", {}));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("the switch has no accessible name"));
  });
});

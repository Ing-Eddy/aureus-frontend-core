import { describe, expect, it } from "vitest";
import { display, spyWarn } from "./setup";

const labels = { true: "Active", false: "Inactive" };

describe("boolean", () => {
  it("shows the matching label", () => {
    expect(display.boolean(true, labels)).toBe("Active");
    expect(display.boolean(false, labels)).toBe("Inactive");
  });

  it("shows empty for missing values", () => {
    expect(display.boolean(null, labels)).toBe("-");
    expect(display.boolean(undefined, { ...labels, empty: "n/a" })).toBe("n/a");
  });

  it("shows empty for a value that is not a boolean, with a warning", () => {
    const warn = spyWarn();
    expect(display.boolean("true" as unknown as boolean, labels)).toBe("-");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("shows empty when untyped code omits a label, with a warning", () => {
    const warn = spyWarn();
    const untyped = display.boolean as (value: boolean, options?: object) => string;
    expect(untyped(true)).toBe("-");
    expect(untyped(false, { true: "Yes" })).toBe("-");
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

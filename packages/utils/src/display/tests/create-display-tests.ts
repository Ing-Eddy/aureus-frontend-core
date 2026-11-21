import { describe, expect, it } from "vitest";
import * as publicApi from "..";
import { createDisplay } from "..";
import { spyWarn } from "./setup";

describe("createDisplay", () => {
  it("shows empty for every missing value, without warnings", () => {
    const warn = spyWarn();
    const display = createDisplay({ empty: "—" });
    const results = [
      display.text(null),
      display.number(undefined),
      display.boolean(null, { true: "Y", false: "N" }),
      display.date(null),
      display.time(undefined),
      display.dateTime(null),
      display.list(undefined),
    ];
    expect(results).toEqual(Array(7).fill("—"));
    expect(warn).not.toHaveBeenCalled();
  });

  it("a per-call empty does not change the display", () => {
    const display = createDisplay({ empty: "-" });
    expect(display.text(null, { empty: "No notes" })).toBe("No notes");
    expect(display.text(null)).toBe("-");
  });

  it("every language-aware function follows a locale getter", () => {
    let current = "es-ES";
    const display = createDisplay({ empty: "-", locale: () => current });
    const sample = () => [
      display.number(1234.5),
      display.date("2026-11-21", { format: "month" }),
      display.list(["a", "b"]),
    ];
    expect(sample()).toEqual(["1234,5", "noviembre", "a y b"]);
    current = "en-US";
    expect(sample()).toEqual(["1234.5", "November", "a and b"]);
  });

  it("warns and uses an empty string when untyped code omits empty", () => {
    const warn = spyWarn();
    const display = createDisplay({} as publicApi.DisplayConfig);
    expect(display.text(null)).toBe("");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("exports only createDisplay at runtime", () => {
    expect(Object.keys(publicApi)).toEqual(["createDisplay"]);
  });
});

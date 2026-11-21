import { describe, expect, it } from "vitest";
import { display, spyWarn } from "./setup";

describe("text", () => {
  it("trims", () => {
    expect(display.text("  Ana  ")).toBe("Ana");
  });

  it("cuts to maxLength and removes trailing whitespace", () => {
    expect(display.text("Hello world", { maxLength: 6 })).toBe("Hello");
    expect(display.text("Hello", { maxLength: 5 })).toBe("Hello");
  });

  it("appends the ellipsis only when it cuts, counting it", () => {
    expect(display.text("Hello world", { maxLength: 7, ellipsis: "…" })).toBe("Hello…");
    expect(display.text("Hello", { maxLength: 7, ellipsis: "…" })).toBe("Hello");
  });

  it("ignores the ellipsis without maxLength", () => {
    expect(display.text("Hello world", { ellipsis: "…" })).toBe("Hello world");
  });

  it("ignores an ellipsis that is not shorter than maxLength, with a warning", () => {
    const warn = spyWarn();
    expect(display.text("Hello world", { maxLength: 3, ellipsis: "..." })).toBe("Hel");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("does not split an emoji or a combining accent", () => {
    expect(display.text("👍🏽👍🏽👍🏽", { maxLength: 2 })).toBe("👍🏽👍🏽");
    expect(display.text("ééé", { maxLength: 2 })).toBe("éé");
    expect(display.text("👨‍👩‍👧 family", { maxLength: 2, ellipsis: "…" })).toBe("👨‍👩‍👧…");
  });

  it("shows blank text as an empty string, or as empty with blankAsEmpty", () => {
    expect(display.text("   ")).toBe("");
    expect(display.text("   ", { blankAsEmpty: true })).toBe("-");
  });

  it("shows empty for missing values", () => {
    expect(display.text(null)).toBe("-");
    expect(display.text(undefined)).toBe("-");
  });

  it("ignores an invalid maxLength, with a warning", () => {
    const warn = spyWarn();
    expect(display.text("Hello", { maxLength: 0 })).toBe("Hello");
    expect(display.text("Hello", { maxLength: 2.5 })).toBe("Hello");
    expect(display.text("Hello", { maxLength: -1 })).toBe("Hello");
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it("shows empty for a value that is not a string, with a warning", () => {
    const warn = spyWarn();
    expect(display.text(42 as unknown as string)).toBe("-");
    expect(warn.mock.calls[0]?.[0]).toBe(
      "display: text() expected a string but received a number; the empty text is shown.",
    );
  });
});

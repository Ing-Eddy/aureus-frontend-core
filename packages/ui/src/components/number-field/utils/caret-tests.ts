import { describe, expect, it } from "vitest";
import { caretFromCount, countSignificant } from "./caret";
import { getNumberSymbols } from "./number-locale";

const en = getNumberSymbols("en-US");

describe("caret", () => {
  it("counts digits, the decimal separator and the minus before the caret", () => {
    expect(countSignificant("1,234.5", 3, en)).toBe(2);
    expect(countSignificant("-1,234", 2, en)).toBe(2);
    expect(countSignificant("1,234.5", 7, en)).toBe(6);
  });

  it("keeps the caret after the same digit when grouping changes", () => {
    // "1,2|34" + "9" typed → raw "1,29|34" → formatted "12,934": caret after "9".
    const raw = "1,2934";
    const count = countSignificant(raw, 4, en);
    expect(caretFromCount("12,934", count, en)).toBe(4);
  });

  it("handles deleting across a separator", () => {
    // "12,9|34" Backspace → raw "12,34" caret 3 → formatted "1,234": caret after "2".
    const count = countSignificant("12,34", 3, en);
    expect(caretFromCount("1,234", count, en)).toBe(3);
  });

  it("puts the caret at the start or end at the extremes", () => {
    expect(caretFromCount("1,234", 0, en)).toBe(0);
    expect(caretFromCount("1,234", 10, en)).toBe(5);
    expect(caretFromCount("-1,234", 1, en)).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import {
  type FormatOptions,
  formatDisplay,
  formatEditing,
  formatPartial,
  groupDigits,
  sanitize,
} from "./format-number";
import { getNumberSymbols } from "./number-locale";

const en = getNumberSymbols("en-US");
const es = getNumberSymbols("es-ES");
const base: FormatOptions = { symbols: en };

describe("formatDisplay / formatEditing", () => {
  it("is plain by default", () => {
    expect(formatDisplay(122345, base)).toBe("122345");
    expect(formatDisplay(1234.5, base)).toBe("1234.5");
    expect(formatDisplay(null, base)).toBe("");
  });

  it("groups only with grouping", () => {
    expect(formatDisplay(1234567.25, { ...base, grouping: true })).toBe("1,234,567.25");
    expect(formatDisplay(123345, { symbols: es, grouping: true })).toBe("123.345");
  });

  it("pads only with both decimals and padDecimals", () => {
    expect(formatDisplay(12.5, { ...base, decimals: 2, padDecimals: true })).toBe("12.50");
    expect(formatDisplay(12.5, { ...base, decimals: 2 })).toBe("12.5");
    expect(formatDisplay(12.5, { ...base, padDecimals: true })).toBe("12.5");
    expect(
      formatDisplay(1234.5, { symbols: es, grouping: true, decimals: 2, padDecimals: true }),
    ).toBe("1.234,50");
  });

  it("formats negatives with minus or parentheses", () => {
    const options = { ...base, grouping: true, decimals: 2, padDecimals: true };
    expect(formatDisplay(-1234.5, options)).toBe("-1,234.50");
    expect(formatDisplay(-1234.5, { ...options, negativeFormat: "parentheses" })).toBe(
      "(1,234.50)",
    );
    expect(formatEditing(-1234.5, { ...options, negativeFormat: "parentheses" })).toBe("-1,234.50");
  });

  it("never prints exponent notation", () => {
    expect(formatDisplay(1e21, base)).toBe("1000000000000000000000");
    expect(formatDisplay(1e-7, base)).toBe("0.0000001");
  });

  it("groups digit strings", () => {
    expect(groupDigits("1234567", ",")).toBe("1,234,567");
    expect(groupDigits("123", ",")).toBe("123");
  });
});

describe("formatPartial", () => {
  const grouped = { ...base, grouping: true };
  it("keeps what is still being typed", () => {
    expect(formatPartial("-", grouped)).toBe("-");
    expect(formatPartial("1234.", grouped)).toBe("1,234.");
    expect(formatPartial("1234.50", grouped)).toBe("1,234.50");
    expect(formatPartial("-1234567", grouped)).toBe("-1,234,567");
  });

  it("does nothing without grouping", () => {
    expect(formatPartial("1234567.5", base)).toBe("1234567.5");
  });
});

describe("sanitize", () => {
  it("keeps digits, one decimal separator and a leading minus", () => {
    expect(sanitize("1,234.5a", { symbols: en })).toBe("1234.5");
    expect(sanitize("1.2.3", { symbols: en })).toBe("1.23");
    expect(sanitize("-12", { symbols: en })).toBe("-12");
    expect(sanitize("1-2", { symbols: en })).toBe("12");
  });

  it("caps decimals and drops the separator with decimals 0", () => {
    expect(sanitize("1.23456", { symbols: en, decimals: 2 })).toBe("1.23");
    expect(sanitize("12.5", { symbols: en, decimals: 0 })).toBe("125");
  });

  it("drops the minus when negatives are not allowed", () => {
    expect(sanitize("-12", { symbols: en, allowNegative: false })).toBe("12");
  });

  it("uses the locale's decimal separator", () => {
    expect(sanitize("1.234,5", { symbols: es })).toBe("1234,5");
  });

  it("keeps a shorthand suffix only when enabled", () => {
    expect(sanitize("1.5k", { symbols: en, shorthand: true })).toBe("1.5k");
    expect(sanitize("1.5k", { symbols: en })).toBe("1.5");
  });
});

import { describe, expect, it } from "vitest";
import { display, plain, spyWarn } from "./setup";

const es = (value: number, options = {}) =>
  plain(display.number(value, { locale: "es-ES", ...options }));
const en = (value: number, options = {}) =>
  plain(display.number(value, { locale: "en-US", ...options }));

describe("number", () => {
  it("is neutral by default: no grouping, no rounding, no padding", () => {
    expect(es(1234.5678)).toBe("1234,5678");
    expect(es(1234567)).toBe("1234567");
    expect(en(0.1 + 0.2)).toBe("0.30000000000000004");
  });

  it("decimals rounds half away from zero", () => {
    expect(en(1.2345, { decimals: 2 })).toBe("1.23");
    expect(en(2.5, { decimals: 0 })).toBe("3");
    expect(en(-2.5, { decimals: 0 })).toBe("-3");
    expect(en(1.5, { decimals: 2 })).toBe("1.5");
  });

  it("padDecimals pads up to decimals, and does nothing without them", () => {
    expect(en(1.5, { decimals: 2, padDecimals: true })).toBe("1.50");
    expect(en(1.5, { padDecimals: true })).toBe(en(1.5));
  });

  it("grouping groups every number, four-digit ones included", () => {
    expect(es(1234.5, { grouping: true })).toBe("1.234,5");
    expect(en(1234567, { grouping: true })).toBe("1,234,567");
  });

  it("currency adds the symbol and keeps the decimals", () => {
    expect(es(1234.5, { currency: "EUR" })).toBe("1234,5 €");
    expect(en(1234.5, { currency: "USD" })).toBe("$1234.5");
    expect(en(3, { currency: "USD" })).toBe("$3");
  });

  it("parentheses wraps negative values with their symbol", () => {
    expect(en(-5, { negativeFormat: "parentheses" })).toBe("(5)");
    expect(es(-1234.5, { currency: "EUR", negativeFormat: "parentheses" })).toBe("(1234,5 €)");
    expect(en(5, { negativeFormat: "parentheses" })).toBe("5");
  });

  it("combines every option", () => {
    expect(
      en(-1234.5, {
        decimals: 2,
        padDecimals: true,
        grouping: true,
        currency: "USD",
        negativeFormat: "parentheses",
      }),
    ).toBe("($1,234.50)");
  });

  it("never shows a sign for zero", () => {
    expect(en(-0)).toBe("0");
    expect(en(-0.001, { decimals: 2, negativeFormat: "parentheses" })).toBe("0");
    expect(en(-0.001, { decimals: 2 })).toBe("0");
  });

  it("shows empty for missing, non-finite and non-number values, warning for the last two", () => {
    const warn = spyWarn();
    expect(display.number(null)).toBe("-");
    expect(display.number(undefined)).toBe("-");
    expect(warn).not.toHaveBeenCalled();
    expect(display.number(Number.NaN)).toBe("-");
    expect(display.number(Number.POSITIVE_INFINITY)).toBe("-");
    expect(display.number("12" as unknown as number)).toBe("-");
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it("ignores invalid decimals and shows empty for an unknown currency, warning", () => {
    const warn = spyWarn();
    expect(en(1.234, { decimals: 21 })).toBe("1.234");
    expect(display.number(1, { currency: "EURO" })).toBe("-");
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

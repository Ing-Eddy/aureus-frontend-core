import { describe, expect, it } from "vitest";
import { getNumberSymbols } from "./number-locale";
import { parseNumber } from "./parse-number";

const en = getNumberSymbols("en-US");
const es = getNumberSymbols("es-ES");
const ch = getNumberSymbols("de-CH");
const fr = getNumberSymbols("fr-FR");

describe("parseNumber", () => {
  it("parses plain and grouped numbers per locale", () => {
    expect(parseNumber("122345", en)).toBe(122345);
    expect(parseNumber("1,234.5", en)).toBe(1234.5);
    expect(parseNumber("1.234,5", es)).toBe(1234.5);
    expect(parseNumber("1,5", es)).toBe(1.5);
    expect(parseNumber("1’234.50", ch)).toBe(1234.5);
    expect(parseNumber("1 234,5", fr)).toBe(1234.5);
  });

  it("treats a lone separator by the locale", () => {
    expect(parseNumber("1,234", en)).toBe(1234);
    expect(parseNumber("1.234", es)).toBe(1234);
    expect(parseNumber("1.", en)).toBe(1);
    expect(parseNumber(".5", en)).toBe(0.5);
  });

  it("takes the last separator as decimal when both appear", () => {
    expect(parseNumber("1.234,50 €", en)).toBe(1234.5);
    expect(parseNumber("$1,234.50", es)).toBe(1234.5);
  });

  it("ignores currency symbols, codes and spaces", () => {
    expect(parseNumber("$1,234.50", en)).toBe(1234.5);
    expect(parseNumber("USD 99", en)).toBe(99);
    expect(parseNumber(" 1 234 ", en)).toBe(1234);
  });

  it("reads negatives: minus before or after, and accounting parentheses", () => {
    expect(parseNumber("-12", en)).toBe(-12);
    expect(parseNumber("12-", en)).toBe(-12);
    expect(parseNumber("−12", en)).toBe(-12);
    expect(parseNumber("(500)", en)).toBe(-500);
    expect(parseNumber("($1,234.50)", en)).toBe(-1234.5);
    expect(parseNumber("-0", en)).toBe(0);
  });

  it("rejects negatives when not allowed", () => {
    expect(parseNumber("-12", en, { allowNegative: false })).toBeUndefined();
    expect(parseNumber("12", en, { allowNegative: false })).toBe(12);
  });

  it("returns null for empty text and undefined for garbage", () => {
    expect(parseNumber("", en)).toBeNull();
    expect(parseNumber("   ", en)).toBeNull();
    expect(parseNumber("abc", en)).toBeUndefined();
    expect(parseNumber("-", en)).toBeUndefined();
    expect(parseNumber("1.2.3", en)).toBe(123);
  });
});

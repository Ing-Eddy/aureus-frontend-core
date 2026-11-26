import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { evaluateExpression, isExpression } from "./evaluate-expression";
import { getNumberSymbols } from "./number-locale";

const en = getNumberSymbols("en-US");
const es = getNumberSymbols("es-ES");
const value = (text: string, symbols = en) => {
  const result = evaluateExpression(text, symbols);
  return result.ok ? result.value : "invalid";
};

describe("evaluateExpression", () => {
  it("respects precedence, parentheses and a leading =", () => {
    expect(value("=3+3")).toBe(6);
    expect(value("120*3+5")).toBe(365);
    expect(value("2+3*4")).toBe(14);
    expect(value("(2+3)*4")).toBe(20);
    expect(value("10/4")).toBe(2.5);
    expect(value("10-2-3")).toBe(5);
  });

  it("supports unary minus", () => {
    expect(value("=-5")).toBe(-5);
    expect(value("-(2+3)")).toBe(-5);
    expect(value("4*-2")).toBe(-8);
    expect(value("--3")).toBe(3);
  });

  it("reads numbers in the locale format", () => {
    expect(value("1,000*2")).toBe(2000);
    expect(value("=1,5*2", es)).toBe(3);
    expect(value("=1.000+1", es)).toBe(1001);
  });

  it("rejects division by zero and malformed input", () => {
    expect(value("1/0")).toBe("invalid");
    expect(value("=3+*2")).toBe("invalid");
    expect(value("(1+2")).toBe("invalid");
    expect(value("1+2)")).toBe("invalid");
    expect(value("=")).toBe("invalid");
    expect(value("alert(1)")).toBe("invalid");
  });

  it("tells expressions from plain numbers", () => {
    expect(isExpression("-5")).toBe(false);
    expect(isExpression("1,234.5")).toBe(false);
    expect(isExpression("5-3")).toBe(true);
    expect(isExpression("=-5")).toBe(true);
    expect(isExpression("=42")).toBe(true);
  });

  it("reads one amount in accounting parentheses as a number", () => {
    for (const text of ["(5)", "(1,234.50)", "$(1,234.50)", "($ 1,234.50)", "(5.00) BOB"]) {
      expect(isExpression(text), text).toBe(false);
    }
    for (const text of ["(2+3)", "(-5)", "(5)+1", "2(3)", "(2)*(3)", "=(5)", "(5k)"]) {
      expect(isExpression(text), text).toBe(true);
    }
  });

  it("never executes code", () => {
    // jsdom gives `import.meta.url` a non-file scheme; resolve from the test file path instead.
    const here = dirname(fileURLToPath(`file://${new URL(import.meta.url).pathname}`));
    const source = readFileSync(join(here, "evaluate-expression.ts"), "utf8");
    expect(source).not.toMatch(/\beval\s*\(/);
    expect(source).not.toMatch(/\bFunction\s*\(/);
  });
});

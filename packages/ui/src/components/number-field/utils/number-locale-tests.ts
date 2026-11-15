import { describe, expect, it } from "vitest";
import { getCurrencySymbol, getNumberSymbols } from "./number-locale";

describe("number-locale", () => {
  it("reads the separators of each locale", () => {
    expect(getNumberSymbols("en-US")).toEqual({ group: ",", decimal: "." });
    expect(getNumberSymbols("es-ES")).toEqual({ group: ".", decimal: "," });
    // The Swiss group separator is "'" or "’" depending on the ICU version.
    expect(getNumberSymbols("de-CH").group).toMatch(/^['’]$/);
    expect(getNumberSymbols("de-CH").decimal).toBe(".");
    expect(getNumberSymbols("fr-FR")).toEqual({ group: " ", decimal: "," });
  });

  it("memoises per locale", () => {
    expect(getNumberSymbols("en-US")).toBe(getNumberSymbols("en-US"));
  });

  it("reads currency symbols and codes", () => {
    expect(getCurrencySymbol("en-US", "USD")).toBe("$");
    expect(getCurrencySymbol("en-US", "EUR")).toBe("€");
    expect(getCurrencySymbol("en-US", "USD", "code")).toBe("USD");
    expect(getCurrencySymbol("en-CA", "USD", "narrowSymbol")).toBe("$");
    expect(getCurrencySymbol("en-CA", "USD", "symbol")).toBe("US$");
  });
});

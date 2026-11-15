import { describe, expect, it } from "vitest";
import { getNumberSymbols } from "./number-locale";
import { applyShorthand, hasShorthand } from "./shorthand";

const en = getNumberSymbols("en-US");
const es = getNumberSymbols("es-ES");

describe("shorthand", () => {
  it("expands k, m and b, in any case", () => {
    expect(applyShorthand("1.5k", en)).toBe(1500);
    expect(applyShorthand("2M", en)).toBe(2_000_000);
    expect(applyShorthand("1b", en)).toBe(1_000_000_000);
    expect(applyShorthand("1.1k", en)).toBe(1100);
  });

  it("supports negatives and locale separators", () => {
    expect(applyShorthand("-2.5k", en)).toBe(-2500);
    expect(applyShorthand("1,5k", es)).toBe(1500);
  });

  it("ignores text without a suffix", () => {
    expect(applyShorthand("1500", en)).toBeUndefined();
    expect(applyShorthand("k", en)).toBeUndefined();
    expect(hasShorthand("3k")).toBe(true);
    expect(hasShorthand("3")).toBe(false);
  });
});

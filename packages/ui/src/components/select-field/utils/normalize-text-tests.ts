import { describe, expect, it } from "vitest";
import { normalizeText } from "./normalize-text";

describe("normalizeText", () => {
  it("ignores case and diacritics", () => {
    expect(normalizeText("España")).toBe("espana");
    expect(normalizeText("CAFÉ Ñandú")).toBe("cafe nandu");
    expect(normalizeText("Zürich")).toBe("zurich");
  });
});

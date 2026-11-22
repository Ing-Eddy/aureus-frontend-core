import { describe, expect, it } from "vitest";
import { toFileName } from "./to-file-name";

describe("toFileName", () => {
  it.each([
    ["Ocean Breeze", "ocean-breeze.css"],
    ["  Café  Noir!! ", "cafe-noir.css"],
    ["", "custom.css"],
    ["***", "custom.css"],
  ])("%j → %s", (name, file) => {
    expect(toFileName(name)).toBe(file);
  });

  it("uses the tool's fallback when nothing is left", () => {
    expect(toFileName("  ", "typography")).toBe("typography.css");
  });
});

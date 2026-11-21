import { describe, expect, it } from "vitest";
import { resolveLocale } from "../resolve-locale";

describe("resolveLocale", () => {
  it("passes a tag through", () => {
    expect(resolveLocale("es-ES")).toBe("es-ES");
  });

  it("copies a list of tags", () => {
    const tags = ["es-MX", "es"] as const;
    const result = resolveLocale(tags);
    expect(result).toEqual(["es-MX", "es"]);
    expect(result).not.toBe(tags);
  });

  it("calls a getter on every call", () => {
    let current = "es";
    const getter = () => current;
    expect(resolveLocale(getter)).toBe("es");
    current = "en";
    expect(resolveLocale(getter)).toBe("en");
  });

  it("treats a getter returning undefined as the runtime default", () => {
    expect(resolveLocale(() => undefined)).toBeUndefined();
  });

  it("treats no input as the runtime default", () => {
    expect(resolveLocale(undefined)).toBeUndefined();
  });
});

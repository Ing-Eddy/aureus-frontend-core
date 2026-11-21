import { describe, expect, it } from "vitest";
import { dateTimeFormat } from "@/internal/utils/helpers";
import type { DateFormatDefinition } from "../types";
import { resolveDefinition } from "../utils/helpers";

const definition: DateFormatDefinition = {
  needs: "date",
  intl: { dateStyle: "short" },
  patterns: { es: "dd/MM/yyyy", "es-MX": "d-MM-yyyy" },
};

describe("resolveDefinition", () => {
  it("uses the exact form of the full tag", () => {
    expect(resolveDefinition(definition, "es-MX")).toEqual({
      kind: "pattern",
      pattern: "d-MM-yyyy",
    });
  });

  it("falls back to the base language", () => {
    expect(resolveDefinition(definition, "es-AR")).toEqual({
      kind: "pattern",
      pattern: "dd/MM/yyyy",
    });
    expect(resolveDefinition(definition, "es")).toEqual({ kind: "pattern", pattern: "dd/MM/yyyy" });
  });

  it("uses the locale's conventions for a language without an exact form", () => {
    expect(resolveDefinition(definition, "fr")).toEqual({
      kind: "intl",
      options: { dateStyle: "short" },
    });
  });

  it("takes the first supported tag of a list", () => {
    expect(resolveDefinition(definition, ["es-MX", "en"])).toEqual({
      kind: "pattern",
      pattern: "d-MM-yyyy",
    });
  });

  it("ignores patterns when the entry has none", () => {
    expect(resolveDefinition({ needs: "time", intl: { timeStyle: "short" } }, "es")).toEqual({
      kind: "intl",
      options: { timeStyle: "short" },
    });
  });
});

describe("formatter cache", () => {
  it("reuses the Intl instance for the same locale and options", () => {
    const a = dateTimeFormat("es-ES", { dateStyle: "long", timeZone: "UTC" });
    const b = dateTimeFormat("es-ES", { dateStyle: "long", timeZone: "UTC" });
    const c = dateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});

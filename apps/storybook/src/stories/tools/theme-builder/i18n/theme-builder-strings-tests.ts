import { locales } from "@sb/i18n/locale-types";
import { describe, expect, it } from "vitest";
import { fill, placeholders, themeBuilderStrings } from "./theme-builder-strings";

const english = themeBuilderStrings.en;
const keys = Object.keys(english) as (keyof typeof english)[];
const others = locales.filter((locale) => locale !== "en");

describe("theme builder UI strings", () => {
  it.each(others)("%s has exactly the English keys", (locale) => {
    expect(Object.keys(themeBuilderStrings[locale]).sort()).toEqual([...keys].sort());
  });

  it.each(locales.flatMap((locale) => keys.map((key) => [locale, key] as const)))(
    "%s.%s is translated with the same placeholders",
    (locale, key) => {
      const value = themeBuilderStrings[locale][key];
      expect(value?.trim(), `${locale}.${key} is empty`).toBeTruthy();
      expect(placeholders(value ?? ""), `${locale}.${key} placeholders`).toEqual(
        placeholders(english[key]),
      );
    },
  );
});

describe("fill", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fill("{count} of {total} {x}", { count: 2, total: 5 })).toBe("2 of 5 {x}");
  });
});

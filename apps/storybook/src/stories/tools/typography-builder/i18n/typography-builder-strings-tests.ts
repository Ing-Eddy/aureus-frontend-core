import { locales } from "@sb/i18n/locale-types";
import { describe, expect, it } from "vitest";
import { placeholders } from "../../shared/i18n";
import { typographyBuilderStrings } from "./typography-builder-strings";

const english = typographyBuilderStrings.en;
const keys = Object.keys(english) as (keyof typeof english)[];
const others = locales.filter((locale) => locale !== "en");

describe("typography builder UI strings", () => {
  it.each(others)("%s has exactly the English keys", (locale) => {
    expect(Object.keys(typographyBuilderStrings[locale]).sort()).toEqual([...keys].sort());
  });

  it.each(locales.flatMap((locale) => keys.map((key) => [locale, key] as const)))(
    "%s.%s is translated with the same placeholders",
    (locale, key) => {
      const value = typographyBuilderStrings[locale][key];
      expect(value?.trim(), `${locale}.${key} is empty`).toBeTruthy();
      expect(placeholders(value ?? ""), `${locale}.${key} placeholders`).toEqual(
        placeholders(english[key]),
      );
    },
  );
});

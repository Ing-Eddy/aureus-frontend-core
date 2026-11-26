import { locales } from "@sb/i18n/locale-types";
import { describe, expect, it } from "vitest";
import { translationsStrings } from "./translations/translations-strings";

const tools = { "i18n runtime demo": translationsStrings };

describe.each(Object.entries(tools))("%s UI strings", (_name, strings) => {
  const english = Object.keys(strings.en).sort();

  it.each(locales)("%s has exactly the English keys, none empty", (locale) => {
    const entries = Object.entries(strings[locale]);
    expect(entries.map(([key]) => key).sort()).toEqual(english);
    for (const [key, value] of entries) expect(value.trim(), `${locale}.${key}`).toBeTruthy();
  });
});

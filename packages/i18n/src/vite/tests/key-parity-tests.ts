import { describe, expect, it } from "vitest";
import { checkKeyParity, pluralBase } from "../utils/helpers/check-key-parity";
import { flattenKeys } from "../utils/helpers/flatten-keys";
import { formatParityReport } from "../utils/helpers/format-parity-report";
import type { ScanResult } from "../utils/helpers/scan-namespaces";

describe("flattenKeys", () => {
  it("returns nested keys as sorted dot paths, with arrays and scalars as leaves", () => {
    expect(
      flattenKeys({
        login: { title: "Entrar", submit: "Enviar" },
        list: ["a", "b"],
        count: 1,
        empty: {},
      }),
    ).toEqual(["count", "list", "login.submit", "login.title"]);
  });
});

describe("pluralBase", () => {
  it("removes plural and ordinal suffixes only", () => {
    expect(pluralBase("items_one")).toBe("items");
    expect(pluralBase("cart.items_other")).toBe("cart.items");
    expect(pluralBase("place_ordinal_few")).toBe("place");
    expect(pluralBase("user_name")).toBe("user_name");
  });
});

/** A scan whose file paths are the content keys of `files` (`"auth/en"`). */
function setup(
  files: Record<string, Record<string, Record<string, unknown>>>,
  languages: string[],
) {
  const contents = new Map<string, Record<string, unknown>>();
  const scan: ScanResult = {
    languages,
    namespaces: Object.entries(files).map(([name, byLanguage]) => ({
      name,
      dir: `src/features/${name}/locales`,
      files: Object.fromEntries(
        Object.entries(byLanguage).map(([language, content]) => {
          contents.set(`${name}/${language}`, content);
          return [language, `${name}/${language}`];
        }),
      ),
    })),
  };
  return { scan, contentOf: (file: string) => contents.get(file) };
}

describe("checkKeyParity", () => {
  it("reports nothing when languages are in sync", () => {
    const { scan, contentOf } = setup(
      { auth: { es: { login: { title: "Entrar" } }, en: { login: { title: "Sign in" } } } },
      ["en", "es"],
    );
    expect(checkKeyParity(scan, "es", contentOf)).toEqual([]);
  });

  it("reports missing and extra keys", () => {
    const { scan, contentOf } = setup(
      {
        auth: {
          es: { login: { title: "Entrar", submit: "Enviar" } },
          en: { login: { submit: "Send" }, extra: "x" },
        },
      },
      ["en", "es"],
    );
    expect(checkKeyParity(scan, "es", contentOf)).toEqual([
      { kind: "missing", namespace: "auth", language: "en", key: "login.title" },
      { kind: "extra", namespace: "auth", language: "en", key: "extra" },
    ]);
  });

  it("reports missing language files", () => {
    const { scan, contentOf } = setup({ payments: { es: { title: "Pagos" } } }, ["en", "es"]);
    expect(checkKeyParity(scan, "es", contentOf)).toEqual([
      {
        kind: "missing-file",
        namespace: "payments",
        language: "en",
        file: "src/features/payments/locales/en.json",
      },
    ]);
  });

  it("compares plural forms by their base key", () => {
    const { scan, contentOf } = setup(
      {
        cart: {
          en: { items_one: "{{count}} item", items_other: "{{count}} items" },
          ar: {
            items_zero: "0",
            items_one: "1",
            items_two: "2",
            items_few: "few",
            items_many: "many",
            items_other: "other",
          },
        },
      },
      ["ar", "en"],
    );
    expect(checkKeyParity(scan, "en", contentOf)).toEqual([]);
  });

  it("skips files that could not be read", () => {
    const { scan } = setup({ auth: { es: { a: "a" }, en: { b: "b" } } }, ["en", "es"]);
    expect(checkKeyParity(scan, "es", () => undefined)).toEqual([]);
  });
});

describe("formatParityReport", () => {
  it("returns undefined when there is nothing to report", () => {
    expect(formatParityReport([], "es")).toBeUndefined();
  });

  it("groups findings by namespace and language, in a stable order", () => {
    const report = formatParityReport(
      [
        {
          kind: "missing-file",
          namespace: "payments",
          language: "en",
          file: "src/features/payments/locales/en.json",
        },
        { kind: "extra", namespace: "auth", language: "en", key: "old" },
        { kind: "missing", namespace: "auth", language: "fr", key: "login.title" },
        { kind: "missing", namespace: "auth", language: "en", key: "login.title" },
        { kind: "missing", namespace: "auth", language: "en", key: "login.submit" },
      ],
      "es",
    );
    expect(report).toBe(
      [
        '[aureusI18n] The translations are out of sync with "es" (the typesFrom language):',
        "  auth",
        '    en: missing "login.title", "login.submit"',
        '    en: not in "es" "old"',
        '    fr: missing "login.title"',
        "  payments",
        "    en: no file (expected src/features/payments/locales/en.json)",
      ].join("\n"),
    );
  });
});

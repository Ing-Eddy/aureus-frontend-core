import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanNamespaces } from "../utils/helpers/scan-namespaces";
import { createFixtureTree, type FixtureTree, writeFixtureFiles } from "./helpers";

const cleanups: Array<() => void> = [];
afterEach(() => {
  for (const remove of cleanups.splice(0)) remove();
});

function fixture(files: FixtureTree) {
  const tree = createFixtureTree(files);
  cleanups.push(tree.remove);
  return tree.root;
}

const typical: FixtureTree = {
  "src/common/locales/es.json": {},
  "src/common/locales/en.json": {},
  "src/features/auth/locales/es.json": {},
  "src/features/auth/locales/en.json": {},
  "src/features/companies/locales/es.json": {},
  "src/features/companies/locales/en.json": {},
};

const names = (root: string, options?: Parameters<typeof scanNamespaces>[1]) =>
  scanNamespaces(root, options).namespaces.map((ns) => ns.name);

describe("scanNamespaces", () => {
  it("finds every locales folder under src/ with no options", () => {
    const root = fixture(typical);
    const result = scanNamespaces(root);
    expect(result.namespaces.map((ns) => [ns.name, ns.dir])).toEqual([
      ["auth", "src/features/auth/locales"],
      ["common", "src/common/locales"],
      ["companies", "src/features/companies/locales"],
    ]);
    expect(result.languages).toEqual(["en", "es"]);
    expect(result.namespaces[0]?.files).toEqual({
      en: join(root, "src/features/auth/locales/en.json"),
      es: join(root, "src/features/auth/locales/es.json"),
    });
  });

  it("finds nested modules at any depth", () => {
    const root = fixture({ ...typical, "src/features/admin/users/locales/es.json": {} });
    expect(names(root)).toContain("users");
  });

  it("finds a module created after a previous scan", () => {
    const root = fixture(typical);
    expect(names(root)).not.toContain("payments");
    writeFixtureFiles(root, { "src/features/payments/locales/es.json": {} });
    expect(names(root)).toContain("payments");
  });

  it("skips node_modules, dist and hidden folders", () => {
    const root = fixture({
      ...typical,
      "src/vendor/node_modules/lib/locales/es.json": {},
      "src/dist/locales/es.json": {},
      "src/.cache/locales/es.json": {},
    });
    expect(names(root)).toEqual(["auth", "common", "companies"]);
  });

  it("ignores files that are not JSON", () => {
    const root = fixture({
      ...typical,
      "src/common/locales/README.md": "",
      "src/common/locales/fr.yaml": "",
    });
    expect(scanNamespaces(root).languages).toEqual(["en", "es"]);
  });

  it("removes folders matched by exclude", () => {
    const root = fixture({ ...typical, "src/legacy/old/locales/es.json": {} });
    expect(names(root)).toContain("old");
    expect(names(root, { exclude: ["src/legacy/**"] })).not.toContain("old");
  });

  it("searches only where include says", () => {
    const root = fixture(typical);
    expect(names(root, { include: ["src/features/*/locales"] })).toEqual(["auth", "companies"]);
  });

  it("adds folders with an explicit name", () => {
    const root = fixture({
      ...typical,
      "src/shared/i18n/es.json": {},
      "src/shared/i18n/en.json": {},
    });
    const result = scanNamespaces(root, { namespaces: { "./src/shared/i18n/": "shared" } });
    expect(result.namespaces.find((ns) => ns.name === "shared")?.dir).toBe("src/shared/i18n");
  });

  it("an explicit name replaces the discovered one for the same folder", () => {
    const root = fixture(typical);
    expect(names(root, { namespaces: { "src/common/locales": "shared" } })).toEqual([
      "auth",
      "companies",
      "shared",
    ]);
  });

  it("keeps an explicit folder that does not exist yet, with no files", () => {
    const root = fixture(typical);
    const result = scanNamespaces(root, { namespaces: { "src/missing/i18n": "missing" } });
    expect(result.namespaces.find((ns) => ns.name === "missing")?.files).toEqual({});
  });

  it("throws when two folders give the same name, naming both", () => {
    const root = fixture({ ...typical, "src/features/common/locales/es.json": {} });
    expect(() => scanNamespaces(root)).toThrow(
      '[aureusI18n] Two folders give the namespace "common": src/common/locales and src/features/common/locales.',
    );
  });

  it("an explicit name can resolve a collision", () => {
    const root = fixture({ ...typical, "src/features/common/locales/es.json": {} });
    expect(
      names(root, { namespaces: { "src/features/common/locales": "features-common" } }),
    ).toContain("features-common");
  });

  it("throws when nothing is found", () => {
    const root = fixture({ "src/app.ts": "" });
    expect(() => scanNamespaces(root)).toThrow(
      "[aureusI18n] No namespace found. Searched: src/**/locales.",
    );
  });

  it("returns sorted output", () => {
    const root = fixture({
      "src/z/locales/fr.json": {},
      "src/a/locales/es.json": {},
      "src/m/locales/en.json": {},
    });
    const result = scanNamespaces(root);
    expect(result.namespaces.map((ns) => ns.name)).toEqual(["a", "m", "z"]);
    expect(result.languages).toEqual(["en", "es", "fr"]);
  });
});

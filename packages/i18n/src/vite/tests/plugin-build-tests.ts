import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildFixture, createFixtureTree, type FixtureTree, fixtureApp } from "./helpers";

const cleanups: Array<() => void> = [];
afterEach(() => {
  for (const remove of cleanups.splice(0)) remove();
});

function fixture(files: FixtureTree) {
  const tree = createFixtureTree({ ...fixtureApp, ...files });
  cleanups.push(tree.remove);
  return tree.root;
}

const inSync: FixtureTree = {
  "src/common/locales/es.json": { save: "Guardar" },
  "src/common/locales/en.json": { save: "Save" },
  "src/features/auth/locales/es.json": { login: { title: "Entrar" } },
  "src/features/auth/locales/en.json": { login: { title: "Sign in" } },
};

describe("aureusI18n in vite build", () => {
  it("emits one chunk per locale file", async () => {
    const root = fixture(inSync);
    const output = await buildFixture(root, { typesFrom: "es", defaultNamespace: "common" });
    const localeChunks = output.filter(
      (item) => item.type === "chunk" && item.facadeModuleId?.endsWith(".json"),
    );
    expect(localeChunks).toHaveLength(4);
    const entry = output.find((item) => item.type === "chunk" && item.isEntry);
    expect(entry?.type === "chunk" && entry.code).not.toContain("Sign in");
  });

  it("writes the declaration file, and does not rewrite it on a second build", async () => {
    const root = fixture(inSync);
    await buildFixture(root, { typesFrom: "es", defaultNamespace: "common" });
    const file = join(root, "src/types/i18next.d.ts");
    const content = readFileSync(file, "utf8");
    expect(content).toContain("auth: {");
    expect(content).toContain('title: "Entrar";');
    expect(content).toContain('defaultNS: "common";');
    const { mtimeMs } = statSync(file);

    await buildFixture(root, { typesFrom: "es", defaultNamespace: "common" });
    expect(statSync(file).mtimeMs).toBe(mtimeMs);
  });

  it("writes the declaration file at typesFile", async () => {
    const root = fixture(inSync);
    await buildFixture(root, { typesFrom: "es", typesFile: "types/locales.d.ts" });
    expect(readFileSync(join(root, "types/locales.d.ts"), "utf8")).toContain(
      "ResourceNamespaceMap",
    );
  });

  it("fails when a language is missing a key, listing namespace, language and key", async () => {
    const root = fixture({ ...inSync, "src/features/auth/locales/en.json": { login: {} } });
    await expect(buildFixture(root, { typesFrom: "es" })).rejects.toThrow(
      /auth\n {4}en: missing "login.title"/,
    );
  });

  it("fails when a namespace is missing a language file", async () => {
    const root = fixture({
      ...inSync,
      "src/features/payments/locales/es.json": { title: "Pagos" },
    });
    await expect(buildFixture(root, { typesFrom: "es" })).rejects.toThrow(
      "en: no file (expected src/features/payments/locales/en.json)",
    );
  });

  it("fails on a namespace collision, naming both folders", async () => {
    const root = fixture({ ...inSync, "src/features/common/locales/es.json": {} });
    await expect(buildFixture(root, { typesFrom: "es" })).rejects.toThrow(
      'Two folders give the namespace "common": src/common/locales and src/features/common/locales',
    );
  });

  it("fails when typesFrom is not a discovered language", async () => {
    const root = fixture(inSync);
    await expect(buildFixture(root, { typesFrom: "fr" })).rejects.toThrow(
      'typesFrom is "fr", but no fr.json file was found. Discovered languages: "en", "es".',
    );
  });

  it("fails when defaultNamespace is not a discovered namespace", async () => {
    const root = fixture(inSync);
    await expect(
      buildFixture(root, { typesFrom: "es", defaultNamespace: "shared" }),
    ).rejects.toThrow('defaultNamespace is "shared", but no such namespace was found.');
  });

  it("fails on invalid JSON, naming the file", async () => {
    const root = fixture({ ...inSync, "src/features/auth/locales/en.json": "{ nope" });
    await expect(buildFixture(root, { typesFrom: "es" })).rejects.toThrow(
      "src/features/auth/locales/en.json is not valid JSON",
    );
  });

  it("applies exclude and namespaces", async () => {
    const root = fixture({
      ...inSync,
      "src/legacy/old/locales/es.json": { a: "a" },
      "src/shared/i18n/es.json": { b: "b" },
      "src/shared/i18n/en.json": { b: "b" },
    });
    await buildFixture(root, {
      typesFrom: "es",
      exclude: ["src/legacy/**"],
      namespaces: { "src/shared/i18n": "shared" },
    });
    const content = readFileSync(join(root, "src/types/i18next.d.ts"), "utf8");
    expect(content).toContain("shared: {");
    expect(content).not.toContain("old:");
  });
});

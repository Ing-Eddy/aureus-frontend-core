import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadLocales, renderTypesFile, scanNamespaces, toPosixPath } from "../utils/helpers";

// The runtime type tests run against a committed declaration file. This test keeps that file
// exactly what the plugin generates from the fixture app, so the two cannot drift apart.
const fixtures = new URL("../../runtime/tests/fixtures/", import.meta.url);
const root = fileURLToPath(new URL("app/", fixtures));

describe("runtime type-test fixture", () => {
  it("is what renderTypesFile generates from the fixture app", () => {
    const scan = scanNamespaces(root);
    const contents = loadLocales(root, scan, (error) => {
      throw error;
    });
    const generated = renderTypesFile(
      scan,
      { typesFrom: "es", defaultNamespace: "common" },
      (file) => contents.get(toPosixPath(file)),
    );
    expect(generated).toBe(readFileSync(new URL("i18next-fixture.d.ts", fixtures), "utf8"));
  });
});

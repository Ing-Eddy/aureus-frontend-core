import { describe, expect, it, vi } from "vitest";
import type { I18nResources } from "@/internal/types";
import { renderVirtualModule } from "../utils/helpers/render-virtual-module";
import type { ScanResult } from "../utils/helpers/scan-namespaces";

const scan: ScanResult = {
  languages: ["en", "es"],
  namespaces: [
    {
      name: "auth",
      dir: "src/features/auth/locales",
      files: {
        en: "/app/src/features/auth/locales/en.json",
        es: "/app/src/features/auth/locales/es.json",
      },
    },
    {
      name: "common",
      dir: "src/common/locales",
      files: { es: "C:\\app\\src\\common\\locales\\es.json" },
    },
  ],
};

/** Evaluates the generated module, with `import()` replaced by `importFile`. */
function evaluate(code: string, importFile: (path: string) => Promise<unknown>): I18nResources {
  const body = code.replace("export default", "return").replaceAll("import(", "importFile(");
  return new Function("importFile", body)(importFile) as I18nResources;
}

describe("renderVirtualModule", () => {
  it("has one static import per locale file, with / separators", () => {
    const code = renderVirtualModule(scan, { dev: false });
    expect(code).toContain('"en/auth": () => import("/app/src/features/auth/locales/en.json"),');
    expect(code).toContain('"es/auth": () => import("/app/src/features/auth/locales/es.json"),');
    expect(code).toContain('"es/common": () => import("C:/app/src/common/locales/es.json"),');
    expect(code.match(/import\(/g)).toHaveLength(3);
  });

  it("exposes languages, namespaces and the default namespace", () => {
    const withDefault = evaluate(
      renderVirtualModule(scan, { dev: false, defaultNamespace: "common" }),
      vi.fn(),
    );
    expect(withDefault.languages).toEqual(["en", "es"]);
    expect(withDefault.namespaces).toEqual(["auth", "common"]);
    expect(withDefault.defaultNamespace).toBe("common");
    expect(evaluate(renderVirtualModule(scan, { dev: false }), vi.fn())).not.toHaveProperty(
      "defaultNamespace",
    );
  });

  it("loads only the requested file, and resolves {} for a missing pair", async () => {
    const importFile = vi.fn(async (path: string) => ({ default: { path } }));
    const resources = evaluate(renderVirtualModule(scan, { dev: false }), importFile);

    await expect(resources.load("es", "auth")).resolves.toEqual({
      path: "/app/src/features/auth/locales/es.json",
    });
    expect(importFile).toHaveBeenCalledTimes(1);
    await expect(resources.load("en", "common")).resolves.toEqual({});
    await expect(resources.load("toString", "")).resolves.toEqual({});
    expect(importFile).toHaveBeenCalledTimes(1);
  });

  it("onUpdate returns an unsubscribe function", () => {
    const resources = evaluate(renderVirtualModule(scan, { dev: false }), vi.fn());
    const unsubscribe = resources.onUpdate(() => {});
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });

  it("adds the HMR listener only in development", () => {
    expect(renderVirtualModule(scan, { dev: true })).toContain(
      'import.meta.hot.on("aureus-i18n:update"',
    );
    expect(renderVirtualModule(scan, { dev: false })).not.toContain("import.meta.hot");
  });
});

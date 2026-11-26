import i18next from "i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import {
  createLanguageDetector,
  createResourcesBackend,
  matchLanguage,
  syncDocument,
  withoutManagedOptions,
} from "../utils/helpers";
import { createFakeResources } from "./helpers";

describe("matchLanguage", () => {
  const supported = ["en", "es", "pt-BR"];

  it("prefers an exact match, ignoring case", () => {
    expect(matchLanguage(["ES"], supported)).toBe("es");
    expect(matchLanguage(["pt-br"], supported)).toBe("pt-BR");
  });

  it("falls back to the base language, and to a supported language with the same base", () => {
    expect(matchLanguage(["es-MX"], supported)).toBe("es");
    expect(matchLanguage(["pt"], supported)).toBe("pt-BR");
  });

  it("uses the first candidate that matches", () => {
    expect(matchLanguage(["fr-FR", "en-US", "es"], supported)).toBe("en");
  });

  it("returns undefined when nothing matches", () => {
    expect(matchLanguage(["fr", "de"], supported)).toBeUndefined();
    expect(matchLanguage([], supported)).toBeUndefined();
  });
});

describe("createResourcesBackend", () => {
  it("reads through resources.load", async () => {
    const fake = createFakeResources({ es: { auth: { title: "Entrar" } } });
    const backend = createResourcesBackend(fake.resources);
    const read = backend.read as unknown as (
      language: string,
      namespace: string,
    ) => Promise<unknown>;
    await expect(read("es", "auth")).resolves.toEqual({ title: "Entrar" });
    expect(fake.load).toHaveBeenCalledWith("es", "auth");
  });

  it("passes a failed load to i18next", async () => {
    const fake = createFakeResources({ es: {} });
    fake.load.mockRejectedValueOnce(new Error("offline"));
    const read = createResourcesBackend(fake.resources).read as unknown as (
      l: string,
      n: string,
    ) => Promise<unknown>;
    await expect(read("es", "auth")).rejects.toThrow("offline");
  });
});

describe("createLanguageDetector", () => {
  const languages = ["en", "es"];
  const setBrowser = (list: string[]) =>
    vi.spyOn(navigator, "languages", "get").mockReturnValue(list);

  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("uses the stored language when it is still supported", () => {
    setBrowser(["es"]);
    localStorage.setItem("aureus-i18n-language", "en");
    expect(createLanguageDetector({ languages, storageKey: "aureus-i18n-language" }).detect()).toBe(
      "en",
    );
  });

  it("ignores a stored language that is no longer supported", () => {
    setBrowser(["es-MX", "en"]);
    localStorage.setItem("aureus-i18n-language", "fr");
    expect(createLanguageDetector({ languages, storageKey: "aureus-i18n-language" }).detect()).toBe(
      "es",
    );
  });

  it("returns undefined when nothing matches, so i18next uses fallbackLng", () => {
    setBrowser(["de"]);
    expect(createLanguageDetector({ languages, storageKey: "k" }).detect()).toBeUndefined();
  });

  it("stores the language under the given key", () => {
    createLanguageDetector({ languages, storageKey: "app-language" }).cacheUserLanguage?.("en");
    expect(localStorage.getItem("app-language")).toBe("en");
  });

  it("keeps working when localStorage throws", () => {
    setBrowser(["en"]);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const detector = createLanguageDetector({ languages, storageKey: "k" });
    expect(detector.detect()).toBe("en");
    expect(() => detector.cacheUserLanguage?.("es")).not.toThrow();
  });
});

describe("syncDocument", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
  });

  it("sets lang and dir after init and on every change", async () => {
    const instance = i18next.createInstance();
    syncDocument(instance);
    await instance.init({ lng: "es", supportedLngs: ["es", "ar"], resources: { es: {}, ar: {} } });
    expect(document.documentElement.lang).toBe("es");
    expect(document.documentElement.dir).toBe("ltr");
    await instance.changeLanguage("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("applies immediately to an instance that is already initialized", async () => {
    const instance = i18next.createInstance();
    await instance.init({ lng: "ar", resources: { ar: {} } });
    syncDocument(instance);
    expect(document.documentElement.dir).toBe("rtl");
  });
});

describe("withoutManagedOptions", () => {
  afterEach(() => {
    resetWarnings();
    vi.restoreAllMocks();
  });

  it("keeps other options and drops managed ones, warning once per name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const options = { supportedLngs: ["fr"], interpolation: { escapeValue: false } };
    expect(withoutManagedOptions(options)).toEqual({ interpolation: { escapeValue: false } });
    withoutManagedOptions(options);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toBe(
      '[createI18n] "supportedLngs" is managed by createI18n and was ignored: it is set from the resources of the Vite plugin.',
    );
  });

  it("points lng and fallbackLng to the createI18n config", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    withoutManagedOptions({ lng: "es" });
    expect(warn.mock.calls[0]?.[0]).toContain("pass it as createI18n({ lng }) instead");
  });
});

import { act, render, screen, waitFor } from "@testing-library/react";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import { createI18n } from "../runtime";
import { createFakeResources, type FakeLocales } from "./helpers";

const locales: FakeLocales = {
  en: { common: { save: "Save" }, auth: { title: "Sign in" } },
  es: { common: { save: "Guardar" }, auth: { title: "Entrar" } },
};

// Keys are typed by `fixtures/i18next-fixture.d.ts`, the declaration file of the fixture app.
function Common() {
  const { t } = useTranslation("common");
  return <p>{t("save")}</p>;
}

function Auth() {
  const { t } = useTranslation("auth");
  return <h1>{t("title")}</h1>;
}

function App({ showAuth = false }: { showAuth?: boolean }) {
  return (
    <Suspense fallback={<span>loading</span>}>
      <Common />
      {showAuth && <Auth />}
    </Suspense>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation("common");
  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      {t("save")} {count}
    </button>
  );
}

const setBrowser = (list: string[]) =>
  vi.spyOn(navigator, "languages", "get").mockReturnValue(list);

beforeEach(() => {
  localStorage.clear();
  setBrowser(["es-ES"]);
});

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

describe("createI18n", () => {
  it("renders the default namespace of the detected language inside Suspense", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    createI18n({ resources: fake.resources, fallbackLng: "en" });
    render(<App />);
    expect(await screen.findByText("Guardar")).toBeTruthy();
  });

  it("loads a namespace only when a component uses it", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    createI18n({ resources: fake.resources, fallbackLng: "en" });
    const view = render(<App />);
    await screen.findByText("Guardar");
    expect(fake.load.mock.calls.map(([, namespace]) => namespace)).not.toContain("auth");

    view.rerender(<App showAuth />);
    expect(await screen.findByText("Entrar")).toBeTruthy();
    expect(fake.load).toHaveBeenCalledWith("es", "auth");
  });

  it("does not request content that is already loaded", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    createI18n({ resources: fake.resources, fallbackLng: "es", lng: "es" });
    const view = render(<App showAuth />);
    await screen.findByText("Entrar");
    view.rerender(<App />);
    view.rerender(<App showAuth />);
    await screen.findByText("Entrar");
    expect(fake.load.mock.calls.filter(([l, n]) => l === "es" && n === "auth")).toHaveLength(1);
  });

  it("a language change loads the namespaces in use", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    const i18n = createI18n({ resources: fake.resources, fallbackLng: "es", lng: "es" });
    render(<App showAuth />);
    await screen.findByText("Entrar");
    await act(() => i18n.changeLanguage("en"));
    expect(await screen.findByText("Sign in")).toBeTruthy();
    expect(screen.getByText("Save")).toBeTruthy();
    expect(fake.load).toHaveBeenCalledWith("en", "auth");
  });

  it("an unsupported language shows the fallback texts", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    const i18n = createI18n({ resources: fake.resources, fallbackLng: "en", lng: "es" });
    render(<App />);
    await screen.findByText("Guardar");
    await act(() => i18n.changeLanguage("fr"));
    expect(await screen.findByText("Save")).toBeTruthy();
    expect(fake.load).not.toHaveBeenCalledWith("fr", expect.anything());
  });

  it("a language with a region resolves to its base language", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    const i18n = createI18n({ resources: fake.resources, fallbackLng: "en", lng: "es-ES" });
    render(<App />);
    expect(await screen.findByText("Guardar")).toBeTruthy();
    expect(i18n.resolvedLanguage).toBe("es");
    expect(fake.load).not.toHaveBeenCalledWith("es-ES", expect.anything());
  });

  it("remembers the language and uses it on the next visit", async () => {
    const first = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
    });
    await first.changeLanguage("en");
    expect(localStorage.getItem("aureus-i18n-language")).toBe("en");

    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    createI18n({ resources: fake.resources, fallbackLng: "es" });
    render(<App />);
    expect(await screen.findByText("Save")).toBeTruthy();
  });

  it("uses a custom storage key", async () => {
    const i18n = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
      detection: { storageKey: "app-language" },
    });
    await i18n.changeLanguage("en");
    expect(localStorage.getItem("app-language")).toBe("en");
  });

  it("with detection off, starts on fallbackLng and stores nothing", async () => {
    setBrowser(["en"]);
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    const i18n = createI18n({ resources: fake.resources, fallbackLng: "es", detection: false });
    render(<App />);
    expect(await screen.findByText("Guardar")).toBeTruthy();
    await act(() => i18n.changeLanguage("en"));
    expect(localStorage.length).toBe(0);
  });

  it("an explicit lng wins over detection and stores nothing", async () => {
    localStorage.setItem("aureus-i18n-language", "es");
    const i18n = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
      lng: "en",
    });
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
    expect(localStorage.getItem("aureus-i18n-language")).toBe("es");
  });

  it("passes other options to i18next", () => {
    const i18n = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
      options: { interpolation: { escapeValue: false }, keySeparator: ">" },
    });
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
    expect(i18n.options.keySeparator).toBe(">");
  });

  it("keeps managed options and warns about each override", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const i18n = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
      options: { supportedLngs: ["fr"] },
    });
    expect(i18n.options.supportedLngs).toEqual(["en", "es", "cimode"]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[createI18n] "supportedLngs" is managed'),
    );
  });

  it("syncDocument keeps <html lang dir> in sync", async () => {
    const i18n = createI18n({
      resources: createFakeResources({ ...locales, ar: { common: {} } }).resources,
      fallbackLng: "es",
      lng: "es",
      syncDocument: true,
    });
    await waitFor(() => expect(document.documentElement.lang).toBe("es"));
    await i18n.changeLanguage("ar");
    expect(document.documentElement.dir).toBe("rtl");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
  });

  it("does not touch the document without syncDocument", async () => {
    const i18n = createI18n({
      resources: createFakeResources(locales).resources,
      fallbackLng: "es",
      lng: "es",
    });
    await i18n.changeLanguage("en");
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
  });

  it("a development update re-renders the new text without changing the language", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    const i18n = createI18n({ resources: fake.resources, fallbackLng: "es" });
    render(<App showAuth />);
    await screen.findByText("Entrar");
    // Spied after the first render: i18next's own init calls changeLanguage once.
    const changeLanguage = vi.spyOn(i18n, "changeLanguage");
    act(() =>
      fake.emit({ language: "es", namespace: "auth", content: { title: "Iniciar sesión" } }),
    );
    expect(await screen.findByText("Iniciar sesión")).toBeTruthy();
    expect(changeLanguage).not.toHaveBeenCalled();
    expect(i18n.language).toBe("es");
  });

  it("does not subscribe to updates in production builds", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { createI18n: productionCreateI18n } = await import("../runtime");
    const fake = createFakeResources(locales);
    productionCreateI18n({ resources: fake.resources, fallbackLng: "es" });
    expect(fake.listenerCount()).toBe(0);
    vi.unstubAllEnvs();
  });

  it("keeps state in a component across a development update", async () => {
    const fake = createFakeResources(locales, { defaultNamespace: "common" });
    createI18n({ resources: fake.resources, fallbackLng: "es", lng: "es" });
    render(
      <Suspense fallback={null}>
        <Counter />
      </Suspense>,
    );
    const button = await screen.findByRole("button");
    act(() => button.click());
    act(() => fake.emit({ language: "es", namespace: "common", content: { save: "Guardar ya" } }));
    expect(await screen.findByText("Guardar ya 1")).toBeTruthy();
  });
});

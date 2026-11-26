import type { i18n } from "i18next";

/**
 * Keeps `<html lang dir>` in sync with the active language of `instance`, now and on every
 * language change. Does nothing where there is no `document`.
 */
export function syncDocument(instance: i18n): void {
  const apply = () => {
    if (typeof document === "undefined") return;
    const language = instance.resolvedLanguage ?? instance.language;
    if (!language) return;
    document.documentElement.lang = language;
    document.documentElement.dir = instance.dir(language);
  };
  instance.on("languageChanged", apply);
  if (instance.isInitialized) apply();
}

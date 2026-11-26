import type { Locale } from "@sb/i18n/locale-types";

/**
 * Texts of the i18n runtime demo itself (labels around the example app), following the docs
 * locale. The example app's own texts play the role of its locale files and live in
 * `translations-locales.ts`. Spanish is typed from the English keys.
 */
const en = {
  appLanguage: "Example app language",
  appLanguageHelp:
    "The example app has its own i18next instance, created with createI18n. Its languages and namespaces come from in-memory resources, like the ones the Vite plugin serves.",
  preview: "Example app",
  openPayments: "Open the payments screen",
  loading: "Loading texts…",
  loadingPayments: "Loading the payments namespace…",
  loadedFiles: "Files loaded, in order",
  loadedFilesHelp:
    "Each language and namespace is loaded the first time it is needed: payments only after you open its screen, and a new language only for the namespaces in use.",
  noneLoaded: "Nothing loaded yet.",
};

const es: Record<keyof typeof en, string> = {
  appLanguage: "Idioma de la app de ejemplo",
  appLanguageHelp:
    "La app de ejemplo tiene su propia instancia de i18next, creada con createI18n. Sus idiomas y namespaces vienen de recursos en memoria, como los que sirve el plugin de Vite.",
  preview: "App de ejemplo",
  openPayments: "Abrir la pantalla de pagos",
  loading: "Cargando textos…",
  loadingPayments: "Cargando el namespace de pagos…",
  loadedFiles: "Archivos cargados, en orden",
  loadedFilesHelp:
    "Cada idioma y namespace se carga la primera vez que hace falta: pagos solo después de abrir su pantalla, y un idioma nuevo solo para los namespaces en uso.",
  noneLoaded: "Todavía no se cargó nada.",
};

export const translationsStrings: Record<Locale, typeof en> = { en, es };

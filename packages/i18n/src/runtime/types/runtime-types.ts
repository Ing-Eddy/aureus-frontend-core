import type { FallbackLng, InitOptions } from "i18next";
import type { I18nResources } from "@/internal/types";

export type { I18nResourceContent, I18nResources, I18nUpdate } from "@/internal/types";

/** Language detection of `createI18n`. */
export interface I18nDetectionOptions {
  /**
   * The `localStorage` key where the user's language is remembered.
   *
   * @default "aureus-i18n-language"
   */
  storageKey?: string;
}

/** Configuration of `createI18n`. Only `resources` and `fallbackLng` are required. */
export interface CreateI18nConfig {
  /** The default export of `virtual:aureus-i18n`, served by the `@aureus-core/i18n/vite` plugin. */
  resources: I18nResources;
  /**
   * The language used when the active one has no text for a key, or is not supported. It is
   * required: the library never chooses a language for you.
   */
  fallbackLng: FallbackLng;
  /** Forces the initial language. Language detection is off when it is given. */
  lng?: string;
  /**
   * How the initial language is chosen when `lng` is not given. By default (or with an object): the
   * language stored by a previous visit if it is still supported, else the first of the browser's
   * preferred languages that matches a discovered language (`es-MX` → `es`), else `fallbackLng`.
   * Every language i18next sets is stored in `localStorage`, including the one detected on the
   * first visit. `false` turns detection off: the initial language is `fallbackLng` and nothing is
   * stored.
   */
  detection?: false | I18nDetectionOptions;
  /**
   * Keeps the `lang` and `dir` attributes of `<html>` in sync with the active language (for
   * example `dir="rtl"` for Arabic).
   *
   * @default false
   */
  syncDocument?: boolean;
  /**
   * Any other i18next init option, passed as is. The options `createI18n` manages itself
   * (`supportedLngs`, `nonExplicitSupportedLngs`, `load`, `ns`, `defaultNS`, `backend`,
   * `resources`, `partialBundledLanguages`, `lng` and `fallbackLng`) are ignored here, with a
   * development warning.
   */
  options?: InitOptions;
}

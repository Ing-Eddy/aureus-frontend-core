import type { LanguageDetectorModule } from "i18next";
import { matchLanguage } from "./match-language";

/** The default `localStorage` key of the remembered language. */
export const DEFAULT_STORAGE_KEY = "aureus-i18n-language";

/** `localStorage`, or `undefined` where it does not exist or access to it throws. */
function storage(): Storage | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

function readStored(key: string): string | undefined {
  try {
    return storage()?.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function browserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages && navigator.languages.length > 0) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

export interface LanguageDetectorOptions {
  /** The discovered languages. */
  readonly languages: readonly string[];
  readonly storageKey: string;
}

/**
 * An i18next language detector: the stored language if it is still supported, else the first
 * browser language that matches a discovered one, else nothing (i18next then uses `fallbackLng`).
 * Every language change is stored. A `localStorage` that is missing or throws is ignored.
 */
export function createLanguageDetector({
  languages,
  storageKey,
}: LanguageDetectorOptions): LanguageDetectorModule {
  return {
    type: "languageDetector",
    detect() {
      const stored = readStored(storageKey);
      const remembered = stored ? matchLanguage([stored], languages) : undefined;
      return remembered ?? matchLanguage(browserLanguages(), languages);
    },
    cacheUserLanguage(language: string) {
      try {
        storage()?.setItem(storageKey, language);
      } catch {
        // Storage full, disabled or blocked: the language is simply not remembered.
      }
    },
  };
}

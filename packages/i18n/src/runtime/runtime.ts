import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { isDev } from "@/internal/utils/constants";
import type { CreateI18nConfig } from "./types";
import {
  createLanguageDetector,
  createResourcesBackend,
  DEFAULT_STORAGE_KEY,
  syncDocument,
  withoutManagedOptions,
} from "./utils/helpers";

/**
 * Creates the app's i18next instance from the resources of the `@aureus-core/i18n/vite` plugin,
 * with React bindings attached. Each language and namespace is loaded the first time it is needed,
 * so wrap the app in `Suspense`. Returns i18next's own instance, already initializing.
 *
 * ```ts
 * // src/i18n.ts
 * import { createI18n } from "@aureus-core/i18n/runtime";
 * import resources from "virtual:aureus-i18n";
 *
 * export const i18n = createI18n({ resources, fallbackLng: "es" });
 * ```
 *
 * The instance is isolated from i18next's global one: outside React, import it from this file
 * instead of `"i18next"`.
 */
export function createI18n(config: CreateI18nConfig): i18n {
  const { resources } = config;
  const defaultNamespace = resources.defaultNamespace;
  const instance = i18next.createInstance();

  instance.use(createResourcesBackend(resources));
  if (config.lng === undefined && config.detection !== false) {
    const storageKey = config.detection?.storageKey ?? DEFAULT_STORAGE_KEY;
    instance.use(createLanguageDetector({ languages: resources.languages, storageKey }));
  }
  instance.use(initReactI18next);
  if (config.syncDocument) syncDocument(instance);

  if (isDev) {
    resources.onUpdate(({ language, namespace, content }) => {
      // i18next reads bundles under the canonical code (`pt-br.json` is `pt-BR`).
      const code = instance.services.languageUtils.formatLanguageCode(language);
      instance.addResourceBundle(code, namespace, content, false, true);
      // Re-renders the components bound to the instance without changing (or storing) the language.
      instance.emit("languageChanged", instance.language);
    });
  }

  void instance.init({
    ...withoutManagedOptions(config.options),
    fallbackLng: config.fallbackLng,
    ...(config.lng === undefined ? {} : { lng: config.lng }),
    // Exactly the discovered languages. i18next's defaults then do the rest: `es-ES` uses `es`,
    // and a region-only language such as `pt-BR` is loaded under its full name.
    supportedLngs: [...resources.languages],
    ns: defaultNamespace === undefined ? [] : [defaultNamespace],
    defaultNS: defaultNamespace ?? false,
  });
  return instance;
}

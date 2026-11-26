import type { BackendModule } from "i18next";
import type { I18nResources } from "@/internal/types";

/**
 * An i18next backend that loads each language and namespace through the virtual module, on demand.
 * i18next asks with the canonical code, so the language is matched to a discovered one ignoring
 * case (`pt-BR` loads `pt-br.json`). A failed load is passed to i18next, which does not retry it: the keys come from the fallback
 * language.
 */
export function createResourcesBackend(resources: I18nResources): BackendModule {
  const discovered = new Map(
    resources.languages.map((language) => [language.toLowerCase(), language]),
  );
  return {
    type: "backend",
    callbackApi: false,
    init() {},
    read(language: string, namespace: string) {
      return resources.load(discovered.get(language.toLowerCase()) ?? language, namespace);
    },
  };
}

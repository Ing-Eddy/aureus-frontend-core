import type { BackendModule } from "i18next";
import type { I18nResources } from "@/internal/types";

/**
 * An i18next backend that loads each language and namespace through the virtual module, on demand.
 * A failed load is passed to i18next, which does not retry it: the keys come from the fallback
 * language.
 */
export function createResourcesBackend(resources: I18nResources): BackendModule {
  return {
    type: "backend",
    callbackApi: false,
    init() {},
    read(language: string, namespace: string) {
      return resources.load(language, namespace);
    },
  };
}

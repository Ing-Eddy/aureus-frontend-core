import type { BackendModule } from "i18next";
import type { I18nResources } from "@/internal/types";

/**
 * An i18next backend that loads each language and namespace through the virtual module, on
 * demand. A failed load is passed to i18next, which applies its own retry and fallback.
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

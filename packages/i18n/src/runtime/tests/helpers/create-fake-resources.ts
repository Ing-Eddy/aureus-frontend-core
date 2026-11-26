import { vi } from "vitest";
import type { I18nResourceContent, I18nResources, I18nUpdate } from "../../types";

/** language → namespace → content. */
export type FakeLocales = Record<string, Record<string, I18nResourceContent>>;

/**
 * In-memory `I18nResources`, like the virtual module of the plugin. `load` is a spy, and `emit`
 * plays the plugin's development update.
 */
export function createFakeResources(
  locales: FakeLocales,
  options: { defaultNamespace?: string } = {},
) {
  const listeners = new Set<(update: I18nUpdate) => void>();
  const languages = Object.keys(locales).sort();
  const namespaces = [
    ...new Set(Object.values(locales).flatMap((byNamespace) => Object.keys(byNamespace))),
  ].sort();
  const load = vi.fn(
    async (language: string, namespace: string) => locales[language]?.[namespace] ?? {},
  );
  const resources: I18nResources = {
    languages,
    namespaces,
    ...(options.defaultNamespace ? { defaultNamespace: options.defaultNamespace } : {}),
    load,
    onUpdate(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  return {
    resources,
    load,
    listenerCount: () => listeners.size,
    emit: (update: I18nUpdate) => {
      for (const listener of listeners) listener(update);
    },
  };
}

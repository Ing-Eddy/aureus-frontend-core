import type { InitOptions } from "i18next";
import { warnOnce } from "@/internal/utils/helpers";

/** i18next options that `createI18n` sets itself. */
export const MANAGED_OPTIONS = [
  "supportedLngs",
  "nonExplicitSupportedLngs",
  "load",
  "ns",
  "defaultNS",
  "backend",
  "resources",
  "partialBundledLanguages",
  "lng",
  "fallbackLng",
] as const;

/** `options` without the managed ones. Each managed option found is warned about once. */
export function withoutManagedOptions(options: InitOptions = {}): InitOptions {
  const rest: Record<string, unknown> = { ...options };
  for (const name of MANAGED_OPTIONS) {
    if (!(name in rest)) continue;
    delete rest[name];
    const hint =
      name === "lng" || name === "fallbackLng"
        ? `pass it as createI18n({ ${name} }) instead`
        : "it is set from the resources of the Vite plugin";
    warnOnce(
      `managed-option:${name}`,
      `[createI18n] "${name}" is managed by createI18n and was ignored: ${hint}.`,
    );
  }
  return rest as InitOptions;
}

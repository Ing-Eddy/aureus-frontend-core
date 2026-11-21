import type { LocaleInput } from "../../types";

/**
 * The locale to hand to `Intl`: a function is called now (never cached), and `undefined` means
 * the runtime's default locale.
 */
export function resolveLocale(input: LocaleInput | undefined): string | string[] | undefined {
  const value = typeof input === "function" ? input() : input;
  if (value === undefined) return undefined;
  return typeof value === "string" ? value : [...value];
}

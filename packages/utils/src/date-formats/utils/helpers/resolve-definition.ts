import { dateTimeFormat } from "@/internal/utils/helpers";
import type { DateFormatDefinition } from "../../types";

type Locale = string | string[] | undefined;

export type ResolvedDefinition =
  | { kind: "pattern"; pattern: string }
  | { kind: "intl"; options: Intl.DateTimeFormatOptions };

/** The tag the runtime actually uses for `locale` (for example `"es"` → `"es"`, `"es-419"`). */
export function resolvedTag(locale: Locale): string {
  return dateTimeFormat(locale, {}).resolvedOptions().locale;
}

/**
 * How `definition` is written in `locale`: the exact form for the full resolved tag, else for its
 * base language, else the locale's conventional form (`intl`).
 */
export function resolveDefinition(
  definition: DateFormatDefinition,
  locale: Locale,
): ResolvedDefinition {
  const { patterns } = definition;
  if (patterns) {
    const tag = resolvedTag(locale);
    const pattern = patterns[tag] ?? patterns[new Intl.Locale(tag).language];
    if (pattern !== undefined) return { kind: "pattern", pattern };
  }
  return { kind: "intl", options: definition.intl };
}

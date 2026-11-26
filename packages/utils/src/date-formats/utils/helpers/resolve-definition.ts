import { dateTimeFormat } from "@/internal/utils/helpers";
import type { DateFormatDefinition } from "../../types";

/** A locale as `Intl` accepts it; `undefined` is the runtime's default. */
type Locale = string | string[] | undefined;

/**
 * How a catalog format is written for one locale: with an exact pattern, or with `Intl` options.
 */
export type ResolvedDefinition =
  | {
      /** An exact form written with pattern tokens, or `Intl` options for the conventional one. */
      kind: "pattern";
      /** The pattern for `formatPattern`. */
      pattern: string;
    }
  | {
      kind: "intl";
      /** Options for `Intl.DateTimeFormat`, without the time zone. */
      options: Intl.DateTimeFormatOptions;
    };

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

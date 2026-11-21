import type { DateFormatDefinition } from "../../types/date-formats-types";

/**
 * The single definition of how every Aureus app shows dates and times. Apps pick a name; they
 * never define a format. Each name uses the locale's conventions (`intl`), so it is right in any
 * language; add `patterns` only when a language must look exactly one way, for example
 * `patterns: { es: "dd/MM/yyyy" }`. Changing this file changes every app: add a changeset.
 */
export const dateFormatCatalog = {
  short: { needs: "date", intl: { dateStyle: "short" } },
  medium: { needs: "date", intl: { dateStyle: "medium" } },
  long: { needs: "date", intl: { dateStyle: "long" } },
  full: { needs: "date", intl: { dateStyle: "full" } },
  numericDate: { needs: "date", intl: { day: "2-digit", month: "2-digit", year: "numeric" } },
  dayMonth: { needs: "date", intl: { day: "numeric", month: "short" } },
  monthYear: { needs: "date", intl: { month: "long", year: "numeric" } },
  weekday: { needs: "date", intl: { weekday: "long" } },
  month: { needs: "date", intl: { month: "long" } },
  year: { needs: "date", intl: { year: "numeric" } },
  time: { needs: "time", intl: { timeStyle: "short" } },
  timeWithSeconds: { needs: "time", intl: { timeStyle: "medium" } },
  shortDateTime: { needs: "both", intl: { dateStyle: "short", timeStyle: "short" } },
  mediumDateTime: { needs: "both", intl: { dateStyle: "medium", timeStyle: "short" } },
  longDateTime: { needs: "both", intl: { dateStyle: "long", timeStyle: "short" } },
} as const satisfies Record<string, DateFormatDefinition>;

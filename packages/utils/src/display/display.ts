import { createDateFormatter } from "@/date-formats";
import { warnOnce } from "@/internal/utils/helpers";
import {
  displayBoolean,
  displayDateValue,
  displayList,
  displayNumber,
  displayText,
} from "./formatters";
import type { Display, DisplayConfig } from "./types";

/**
 * The functions an app uses to show values. Configure it once; `locale` may be a getter, so the
 * output follows a language that changes at runtime.
 *
 * ```ts
 * export const display = createDisplay({ empty: "-", locale: () => i18n.resolvedLanguage });
 * display.text(user.name, { maxLength: 40, ellipsis: "…" });
 * display.date(order.date, { format: "long" });
 * ```
 */
export function createDisplay(config: DisplayConfig): Display {
  if (typeof config?.empty !== "string") {
    warnOnce(
      "display:config:empty",
      "display: createDisplay() needs an `empty` text; an empty string is used.",
    );
    config = { ...config, empty: "" };
  }
  const dates = createDateFormatter({ locale: config.locale, timeZone: config.timeZone });

  return {
    text: (value, options) => displayText(value, options, config),
    number: (value, options) => displayNumber(value, options, config),
    boolean: (value, options) => displayBoolean(value, options, config),
    date: (value, options) => displayDateValue(value, options, config, dates, "short"),
    time: (value, options) => displayDateValue(value, options, config, dates, "time"),
    dateTime: (value, options) => displayDateValue(value, options, config, dates, "shortDateTime"),
    list: (values, options) => displayList(values, options, config),
  };
}

import { isNil, listFormat, resolveLocale } from "@/internal/utils/helpers";
import type { DisplayConfig, ListOptions } from "../types";
import { emptyText, integerOption, warnType } from "../utils/helpers";

export function displayList(
  values: unknown,
  options: ListOptions | undefined,
  config: DisplayConfig,
): string {
  const empty = emptyText(options, config);
  if (isNil(values)) return empty;
  if (!Array.isArray(values)) {
    warnType("list", "an array", values);
    return empty;
  }

  const items: string[] = [];
  for (const item of values) {
    if (isNil(item)) continue;
    if (typeof item !== "string") {
      warnType("list", "string items", item);
      continue;
    }
    const text = item.trim();
    if (text) items.push(text);
  }
  if (items.length === 0) return empty;

  const maxItems = integerOption("list", "maxItems", options?.maxItems, 1);
  const shown =
    maxItems !== undefined && items.length > maxItems && options?.more
      ? [...items.slice(0, maxItems), options.more(items.length - maxItems)]
      : items;

  const locale = resolveLocale(options?.locale ?? config.locale);
  return listFormat(locale, {
    type: options?.type ?? "conjunction",
    style: options?.style ?? "long",
  }).format(shown);
}

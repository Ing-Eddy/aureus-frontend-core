import { isNil, warnOnce } from "@/internal/utils/helpers";
import type { DisplayConfig, TextOptions } from "../types";
import { emptyText, graphemes, integerOption, truncateGraphemes, warnType } from "../utils/helpers";

/**
 * `Display.text`: the trimmed string, cut to `maxLength` graphemes. A blank string stays `""`
 * unless `blankAsEmpty`; a value of another type gives the `empty` text with a development warning.
 */
export function displayText(
  value: unknown,
  options: TextOptions | undefined,
  config: DisplayConfig,
): string {
  const empty = emptyText(options, config);
  if (isNil(value)) return empty;
  if (typeof value !== "string") {
    warnType("text", "a string", value);
    return empty;
  }

  const text = value.trim();
  if (text === "") return options?.blankAsEmpty ? empty : "";

  const maxLength = integerOption("text", "maxLength", options?.maxLength, 1);
  if (maxLength === undefined) return text;

  let ellipsis = options?.ellipsis ?? "";
  if (ellipsis && graphemes(ellipsis).length >= maxLength) {
    warnOnce(
      `display:ellipsis:${ellipsis}:${maxLength}`,
      `display: text() ignores ellipsis "${ellipsis}": it is not shorter than maxLength (${maxLength}).`,
    );
    ellipsis = "";
  }
  return truncateGraphemes(text, maxLength, ellipsis);
}

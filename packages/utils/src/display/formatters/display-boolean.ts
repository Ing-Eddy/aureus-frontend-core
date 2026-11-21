import { isNil, warnOnce } from "@/internal/utils/helpers";
import type { BooleanOptions, DisplayConfig } from "../types";
import { emptyText, warnType } from "../utils/helpers";

export function displayBoolean(
  value: unknown,
  options: BooleanOptions,
  config: DisplayConfig,
): string {
  const empty = emptyText(options, config);
  if (isNil(value)) return empty;
  if (typeof value !== "boolean") {
    warnType("boolean", "a boolean", value);
    return empty;
  }
  const label = value ? options?.true : options?.false;
  if (typeof label !== "string") {
    warnOnce(
      `display:boolean:label:${value}`,
      `display: boolean() needs a \`${value}\` label; the empty text is shown.`,
    );
    return empty;
  }
  return label;
}

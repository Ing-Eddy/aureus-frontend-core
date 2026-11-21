import { warnOnce } from "@/internal/utils/helpers";
import type { DisplayConfig } from "../../types";

/** The `empty` text of a call: its own, else the display's. */
export function emptyText(options: { empty?: string } | undefined, config: DisplayConfig): string {
  return options?.empty ?? config.empty;
}

function typeName(value: unknown): string {
  if (Array.isArray(value)) return "an array";
  const type = typeof value;
  return `${/^[aeiou]/.test(type) ? "an" : "a"} ${type}`;
}

/** Warns once that `fn` received a value of the wrong type. */
export function warnType(fn: string, expected: string, value: unknown): void {
  const received = typeName(value);
  warnOnce(
    `display:type:${fn}:${received}`,
    `display: ${fn}() expected ${expected} but received ${received}; the empty text is shown.`,
  );
}

/** `value` when it is an integer within `[min, max]`; otherwise warns once and returns `undefined`. */
export function integerOption(
  fn: string,
  name: string,
  value: number | undefined,
  min: number,
  max = Number.MAX_SAFE_INTEGER,
): number | undefined {
  if (value === undefined) return undefined;
  if (Number.isInteger(value) && value >= min && value <= max) return value;
  warnOnce(
    `display:option:${fn}:${name}:${value}`,
    `display: ${fn}() ignores ${name}: ${value}; it must be an integer from ${min}${max === Number.MAX_SAFE_INTEGER ? " up" : ` to ${max}`}.`,
  );
  return undefined;
}

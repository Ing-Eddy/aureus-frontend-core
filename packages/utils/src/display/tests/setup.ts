import { afterEach, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import { createDisplay } from "..";

/** ICU writes narrow / no-break spaces (`2:30 PM`, `1234,5 €`); compare them as plain spaces. */
export const plain = (text: string) => text.replace(/[  ]/g, " ");

export const display = createDisplay({ empty: "-" });

/** Spies on `console.warn` for the current test; warnings are reset after each test. */
export function spyWarn() {
  return vi.spyOn(console, "warn").mockImplementation(() => {});
}

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

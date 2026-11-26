import { useControllableState } from "@/internal/hooks";
import { type IsoMode, isIsoValue } from "@/internal/utils/helpers";

/** Options of `useDateTimeValue`. */
export interface UseDateTimeValueOptions {
  /** What the value holds. */
  mode: IsoMode;
  /** Controlled value. */
  value?: string | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with every requested change. */
  onValueChange?: (value: string | null) => void;
}

/**
 * The field's value, controlled or not. A value that is not valid for the mode is shown as empty
 * (a development warning names it).
 */
export function useDateTimeValue({
  mode,
  value,
  defaultValue,
  onValueChange,
}: UseDateTimeValueOptions): [string | null, (value: string | null) => void] {
  const [current, setCurrent] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  return [current !== null && isIsoValue(current, mode) ? current : null, setCurrent];
}

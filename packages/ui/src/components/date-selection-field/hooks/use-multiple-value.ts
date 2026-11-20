import { useControllableState } from "@/internal/hooks";
import { isIsoDate } from "@/internal/utils/helpers";
import { normalizeDays } from "../utils";

export interface UseMultipleValueOptions {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
}

/** The chosen days, sorted with no duplicates; values that are not ISO dates are dropped. */
export function useMultipleValue({ value, defaultValue, onValueChange }: UseMultipleValueOptions) {
  const [current, setCurrent] = useControllableState<readonly string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange as ((value: readonly string[]) => void) | undefined,
  });
  const days = normalizeDays(Array.isArray(current) ? current.filter((day) => isIsoDate(day)) : []);
  return [days, (next: readonly string[]) => setCurrent(normalizeDays(next))] as const;
}

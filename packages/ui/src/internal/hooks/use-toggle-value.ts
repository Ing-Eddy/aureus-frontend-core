import { useEffect, useRef } from "react";
import type { ToggleValue } from "@/internal/types";
import { isDev } from "@/internal/utils/constants";
import { useControllableState } from "./use-controllable-state";

export interface UseToggleValueOptions<V extends ToggleValue> {
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /** Value when checked. Defaults to `true`. */
  checkedValue?: V;
  /** Value when unchecked. Defaults to `false`. */
  uncheckedValue?: V;
  /** Name used in development warnings. */
  componentName: string;
}

/**
 * The checkbox value: controlled or uncontrolled, mapped between the box's checked state and the
 * values the consumer stores (`true`/`false` by default, or custom values).
 */
export function useToggleValue<V extends ToggleValue>({
  value,
  defaultValue,
  onValueChange,
  checkedValue = true as V,
  uncheckedValue = false as V,
  componentName,
}: UseToggleValueOptions<V>) {
  const [current, setCurrent] = useControllableState<V>({
    value,
    defaultValue: defaultValue ?? uncheckedValue,
    onChange: onValueChange,
  });
  const checked = Object.is(current, checkedValue);

  // A value that matches neither the checked nor the unchecked value is shown unchecked.
  const warned = useRef(new Set<unknown>());
  const unknown = !checked && !Object.is(current, uncheckedValue);
  useEffect(() => {
    if (!isDev || !unknown || warned.current.has(current)) return;
    warned.current.add(current);
    console.warn(
      `${componentName}: the value ${JSON.stringify(current)} is neither \`checkedValue\` (${JSON.stringify(checkedValue)}) nor \`uncheckedValue\` (${JSON.stringify(uncheckedValue)}); the box is shown unchecked.`,
    );
  }, [componentName, unknown, current, checkedValue, uncheckedValue]);

  return {
    value: current,
    checked,
    /** Sets the checked state; reports the matching value. */
    setChecked: (next: boolean) => setCurrent(next ? checkedValue : uncheckedValue),
  };
}

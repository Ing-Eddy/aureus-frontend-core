import { useEffect, useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import { isDev } from "@/internal/utils/constants";
import type { CheckboxValue } from "../checkbox-field-types";

export interface UseCheckboxValueOptions<V extends CheckboxValue> {
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
export function useCheckboxValue<V extends CheckboxValue>({
  value,
  defaultValue,
  onValueChange,
  checkedValue = true as V,
  uncheckedValue = false as V,
  componentName,
}: UseCheckboxValueOptions<V>) {
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

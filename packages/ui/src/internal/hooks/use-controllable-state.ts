import { useCallback, useRef, useState } from "react";

/** Options of `useControllableState`. */
export interface UseControllableStateOptions<T> {
  /** Controlled value. When it is not `undefined`, the hook only reports changes. */
  value?: T;
  /** Initial value in uncontrolled mode. */
  defaultValue: T;
  /** Called with every requested change, in both modes. */
  onChange?: (value: T) => void;
}

/**
 * State that a component owns by default but that its consumer can control: the usual
 * `value` / `defaultValue` / `onChange` pattern. The returned setter is stable.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const controlledRef = useRef(controlled);
  controlledRef.current = controlled;

  const setValue = useCallback((next: T) => {
    if (!controlledRef.current) setInternal(next);
    onChangeRef.current?.(next);
  }, []);

  return [controlled ? (value as T) : internal, setValue];
}

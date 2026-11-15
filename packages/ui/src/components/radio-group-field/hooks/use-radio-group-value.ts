import { useEffect, useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import { isDev } from "@/internal/utils/constants";
import type { RadioGroupOption } from "../types";

/** Radix value of the other option; a value can never collide with it. */
export const OTHER_ID = "\u0000other";

export interface UseRadioGroupValueOptions {
  options: readonly RadioGroupOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Whether the group has an other option (free text). */
  hasOther: boolean;
  /** Name used in development warnings. */
  componentName: string;
}

/**
 * The radio group value (`string | null`, or the other option's text) and its mapping to the
 * value Radix shows: an option id, the other id, or `""` for nothing checked.
 */
export function useRadioGroupValue({
  options,
  value,
  defaultValue,
  onValueChange,
  hasOther,
  componentName,
}: UseRadioGroupValueOptions) {
  // `undefined` is "uncontrolled" for useControllableState, so `null` stays a real controlled value.
  const [current, setCurrent] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const selected = current ?? null;

  const known = options.some((option) => option.value === selected);
  const isOther = hasOther && selected !== null && !known;
  const otherText = isOther ? (selected as string) : "";
  const radixValue = known ? (selected as string) : isOther ? OTHER_ID : "";

  // The last text typed for the other option, restored when it is chosen again.
  const lastOther = useRef("");
  if (isOther) lastOther.current = otherText;

  /** Maps a Radix value back: an option id, or the other text. */
  const choose = (id: string) => setCurrent(id === OTHER_ID ? lastOther.current : id);
  const setOtherText = (text: string) => setCurrent(text);
  const clear = () => setCurrent(null);

  // A value that matches no option (without an other option) checks nothing; named once.
  const warned = useRef(new Set<string>());
  const unknown = !hasOther && selected !== null && !known ? selected : null;
  useEffect(() => {
    if (!isDev || unknown === null || warned.current.has(unknown)) return;
    warned.current.add(unknown);
    console.warn(`${componentName}: the value "${unknown}" matches no option; it is kept.`);
  }, [componentName, unknown]);

  return { value: selected, radixValue, isOther, otherText, choose, setOtherText, clear };
}

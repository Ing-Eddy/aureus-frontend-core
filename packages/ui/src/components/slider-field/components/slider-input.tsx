import { type KeyboardEvent, useState } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Input } from "@/shadcn/ui/input";
import { editingText, parseSliderInput } from "../utils";

export interface SliderInputProps {
  id: string;
  /** The value of the thumb this input is linked to. */
  value: number;
  /** Commits a typed (or stepped) value; the field normalizes it. */
  onCommit: (value: number) => void;
  /** Accessible name, from `inputLabel` or `inputLabels`. */
  label: string | undefined;
  /** The formatted value, announced as `aria-valuetext`. */
  valueText: string;
  min: number;
  max: number;
  step: number;
  /** Fraction digits shown while editing (those of `step`). */
  decimals: number;
  locale?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  describedBy?: string;
  className?: string;
}

/**
 * A number input linked to one thumb. Typing does not move the thumb: Enter or leaving the input
 * commits the text, and Escape restores the value. The arrows step the value at once, as in a
 * spinbutton. While it is not being edited the input shows the thumb's value, so after a commit it
 * shows the normalized value (clamped, stepped, ordered). The digits stay left to right.
 */
export function SliderInput({
  id,
  value,
  onCommit,
  label,
  valueText,
  min,
  max,
  step,
  decimals,
  locale,
  disabled,
  error,
  required,
  describedBy,
  className,
}: SliderInputProps) {
  // `null` while not editing: the input then shows the thumb's value.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? editingText(value, locale, decimals);

  /** Commits the draft; an empty or invalid text just restores the value. */
  const commit = () => {
    if (draft === null) return false;
    setDraft(null);
    const parsed = parseSliderInput(draft, locale);
    if (parsed === undefined || parsed === value) return false;
    onCommit(parsed);
    return true;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Only swallow Enter when it changed something; otherwise the form submits as usual.
      if (draft !== null && draft !== editingText(value, locale, decimals)) event.preventDefault();
      commit();
    } else if (event.key === "Escape" && draft !== null) {
      event.preventDefault();
      setDraft(null);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const base = draft === null ? value : (parseSliderInput(draft, locale) ?? value);
      setDraft(null);
      onCommit(base + (event.key === "ArrowUp" ? step : -step));
    }
  };

  return (
    <Input
      id={id}
      type="text"
      inputMode={decimals > 0 || min < 0 ? "decimal" : "numeric"}
      role="spinbutton"
      dir="ltr"
      autoComplete="off"
      data-slot="slider-input"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
      aria-describedby={describedBy}
      aria-invalid={error || undefined}
      aria-required={required || undefined}
      disabled={disabled}
      value={text}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => commit()}
      className={cn("h-8 w-20 shrink-0 text-end tabular-nums", className)}
    />
  );
}

import { Field, FieldDescription, FieldError, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { type ReactNode, useEffect, useId, useState } from "react";

export { NumberField, SliderField } from "../../shared/form";

import { fill } from "../../shared/i18n";
import { normalizeColor, toHex } from "../core/color";
import type { ThemeBuilderStrings } from "../i18n/theme-builder-strings";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  t: ThemeBuilderStrings;
  description?: ReactNode;
  disabled?: boolean;
  /** Visually hide the label (the overrides table shows the token name in its own column). */
  hideLabel?: boolean;
  /** Extra content after the input, inside the same row. */
  addon?: ReactNode;
}

/**
 * A swatch picker plus a free-text input that accepts any CSS color notation. Invalid text shows
 * an error tied to the input and leaves the value unchanged (spec: Per-token overrides).
 */
export function ColorField({
  label,
  value,
  onChange,
  t,
  description,
  disabled,
  hideLabel,
  addon,
}: ColorFieldProps) {
  const id = useId();
  const [text, setText] = useState(value);
  const [invalid, setInvalid] = useState(false);

  // Follow outside changes (generation, reset, import) unless the text already means this value.
  useEffect(() => {
    setText((current) => (normalizeColor(current) === value ? current : value));
    setInvalid(false);
  }, [value]);

  const commit = (next: string) => {
    setText(next);
    const normalized = normalizeColor(next);
    setInvalid(!normalized);
    if (normalized && normalized !== value) onChange(normalized);
  };

  const describedBy = [description ? `${id}-description` : "", invalid ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Field data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={`${id}-text`} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={toHex(value)}
          disabled={disabled}
          aria-label={fill(t.colorPicker, { label })}
          onChange={(event) => commit(event.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          id={`${id}-text`}
          value={text}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => commit(event.target.value)}
          className="font-mono text-xs"
        />
        {addon}
      </div>
      {description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
      {invalid ? <FieldError id={`${id}-error`}>{t.invalidColor}</FieldError> : null}
    </Field>
  );
}

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { Slider } from "@aureus-core/ui/shadcn/slider";
import { type ReactNode, useEffect, useId, useState } from "react";
import { normalizeColor, toHex } from "../core/color";
import { fill, type ThemeBuilderStrings } from "../i18n/theme-builder-strings";

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

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  description?: ReactNode;
}

/** A number input with its unit; out-of-range or empty input is not committed. */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  description,
}: NumberFieldProps) {
  const id = useId();
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText((current) => (Number(current) === value ? current : String(value)));
  }, [value]);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={text}
          aria-describedby={description ? `${id}-description` : undefined}
          onChange={(event) => {
            setText(event.target.value);
            const next = event.target.valueAsNumber;
            if (Number.isFinite(next) && next >= min && next <= max) onChange(next);
          }}
          className="w-28"
        />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}

interface SliderFieldProps {
  label: string;
  /** 0–1. */
  value: number;
  onChange: (value: number) => void;
  /** Visible value, e.g. "40%". */
  display: string;
  description?: ReactNode;
  disabled?: boolean;
}

/** A 0–100 % slider whose thumb carries the field's accessible name. */
export function SliderField({
  label,
  value,
  onChange,
  display,
  description,
  disabled,
}: SliderFieldProps) {
  const id = useId();
  const nameThumb = (root: HTMLSpanElement | null) => {
    const thumb = root?.querySelector('[role="slider"]');
    thumb?.setAttribute("aria-labelledby", `${id}-label`);
    if (description) thumb?.setAttribute("aria-describedby", `${id}-description`);
  };
  return (
    <Field data-disabled={disabled || undefined}>
      <div className="flex items-center justify-between gap-2">
        <FieldTitle id={`${id}-label`}>{label}</FieldTitle>
        <span className="text-sm text-muted-foreground tabular-nums">{display}</span>
      </div>
      <Slider
        ref={nameThumb}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
        value={[Math.round(value * 100)]}
        onValueChange={([next]) => onChange((next ?? 0) / 100)}
      />
      {description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}

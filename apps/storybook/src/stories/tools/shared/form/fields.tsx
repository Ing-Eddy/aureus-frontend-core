import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { NativeSelect, NativeSelectOption } from "@aureus-core/ui/shadcn/native-select";
import { Slider } from "@aureus-core/ui/shadcn/slider";
import { type ReactNode, useEffect, useId, useState } from "react";

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

interface TextFieldProps<T> {
  label: string;
  value: T;
  /** Called with the parsed value when the text is valid and means a different value. */
  onChange: (value: T) => void;
  /** The value of a text, or `undefined` when the text is invalid. */
  parse: (text: string) => T | undefined;
  /** How a value is shown in the input. */
  format: (value: T) => string;
  /** Shown, and tied to the input, while the text is invalid. */
  invalidMessage: string;
  description?: ReactNode;
  /** Visually hide the label (a table shows the name in its own column). */
  hideLabel?: boolean;
  /** Extra content after the input, inside the same row. */
  addon?: ReactNode;
  className?: string;
}

/**
 * A free-text input for a structured value (a size, a length, a family name). Invalid text shows an
 * error tied to the input and leaves the value unchanged, like the theme builder's color field.
 */
export function TextField<T>({
  label,
  value,
  onChange,
  parse,
  format,
  invalidMessage,
  description,
  hideLabel,
  addon,
  className,
}: TextFieldProps<T>) {
  const id = useId();
  const [text, setText] = useState(() => format(value));
  const [invalid, setInvalid] = useState(false);

  // Follow outside changes (regeneration, reset, import) unless the text already means this value.
  useEffect(() => {
    setText((current) => {
      const parsed = parse(current);
      return parsed !== undefined && format(parsed) === format(value) ? current : format(value);
    });
    setInvalid(false);
  }, [value, parse, format]);

  const commit = (next: string) => {
    setText(next);
    const parsed = parse(next);
    setInvalid(parsed === undefined);
    if (parsed !== undefined && format(parsed) !== format(value)) onChange(parsed);
  };

  const describedBy = [description ? `${id}-description` : "", invalid ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Field data-invalid={invalid || undefined} className={className}>
      <FieldLabel htmlFor={id} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={text}
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
      {invalid ? <FieldError id={`${id}-error`}>{invalidMessage}</FieldError> : null}
    </Field>
  );
}

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  description?: ReactNode;
  hideLabel?: boolean;
  className?: string;
}

/** A native select over a closed list of values. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  description,
  hideLabel,
  className,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <NativeSelect
        id={id}
        value={value}
        aria-describedby={description ? `${id}-description` : undefined}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value);
          if (next) onChange(next.value);
        }}
      >
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}

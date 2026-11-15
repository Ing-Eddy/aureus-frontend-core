import type { ChangeEvent, Ref } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Input } from "@/shadcn/ui/input";

export interface RadioOtherInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Accessible name. Required by the other option's props. */
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/** The free-text input of a radio group's other option, styled like the family's inputs. */
export function RadioOtherInput({
  id,
  value,
  onChange,
  label,
  placeholder,
  disabled,
  error,
  className,
  ref,
}: RadioOtherInputProps) {
  return (
    <Input
      ref={ref}
      id={id}
      data-slot="radio-other-input"
      aria-label={label}
      aria-invalid={error || undefined}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      className={cn("mt-2", className)}
    />
  );
}

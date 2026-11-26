import type { ChangeEvent, Ref } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Input } from "@/shadcn/ui/input";

/** Props of `RadioOtherInput`. */
export interface RadioOtherInputProps {
  /** Id of the input. */
  id: string;
  /** The typed text. */
  value: string;
  /** Called with the new text. */
  onChange: (value: string) => void;
  /** Accessible name. Required by the other option's props. */
  label: string;
  /** Hint inside the empty input. */
  placeholder?: string;
  /** Disables the input. */
  disabled?: boolean;
  /** Marks the input as invalid. */
  error?: boolean;
  /** Extra classes of the input. */
  className?: string;
  /** Reaches the input. */
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

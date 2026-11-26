import { XIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import type { SelectOption } from "../types";
import { selectStyles } from "./styles";

/** Props of `SelectChips`. */
export interface SelectChipsProps {
  /** The selected options, one chip each. */
  options: SelectOption[];
  /** Accessible name of a chip's remove button. */
  removeChipLabel: (option: SelectOption) => string;
  /** Called with the value to remove. */
  onRemove: (value: string) => void;
  /** Disables the remove buttons. */
  disabled?: boolean;
  /** Extra classes of each chip. */
  className?: string;
}

/** Removable chips. Rendered beside the field's button, never inside it. */
export function SelectChips({
  options,
  removeChipLabel,
  onRemove,
  disabled,
  className,
}: SelectChipsProps) {
  if (!options.length) return null;
  return (
    <ul data-slot="select-chips" className={selectStyles.chips}>
      {options.map((option) => (
        <li key={option.value} data-slot="select-chip" className={cn(selectStyles.chip, className)}>
          <span className="truncate">{option.label}</span>
          <button
            type="button"
            aria-label={removeChipLabel(option)}
            disabled={disabled}
            className={selectStyles.chipRemove}
            onClick={() => onRemove(option.value)}
          >
            <XIcon aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

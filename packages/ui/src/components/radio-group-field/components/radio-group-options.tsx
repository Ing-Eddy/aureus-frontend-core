import { type MouseEvent, type ReactNode, useRef } from "react";
import { ChoiceRow } from "@/internal/components";
import { RadioGroupItem } from "@/shadcn/ui/radio-group";

export interface RadioOptionRowProps {
  id: string;
  value: string;
  label: ReactNode;
  description?: ReactNode;
  after?: ReactNode;
  disabled: boolean;
  locked: boolean;
  appearance: "plain" | "card";
  position: "start" | "end";
  error?: boolean;
  className?: string;
  radioClassName?: string;
  labelClassName?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** One radio with its label and description, named and described by them. */
export function RadioOptionRow({
  id,
  value,
  label,
  description,
  after,
  disabled,
  locked,
  appearance,
  position,
  error,
  className,
  radioClassName,
  labelClassName,
  onClick,
}: RadioOptionRowProps) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const textId = `${id}-text`;
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <ChoiceRow
      slot="radio"
      box={
        <RadioGroupItem
          ref={boxRef}
          id={id}
          value={value}
          disabled={disabled || locked}
          aria-labelledby={textId}
          aria-describedby={descriptionId}
          className={radioClassName}
          onClick={onClick}
        />
      }
      boxRef={boxRef}
      textId={textId}
      text={label}
      description={description}
      descriptionId={descriptionId}
      after={after}
      position={position}
      appearance={appearance}
      error={error}
      locked={locked || disabled}
      className={className}
      textClassName={labelClassName}
    />
  );
}

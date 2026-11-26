import { type MouseEvent, type ReactNode, useRef } from "react";
import { ChoiceRow } from "@/internal/components";
import { RadioGroupItem } from "@/shadcn/ui/radio-group";

/** Props of one radio row. */
export interface RadioOptionRowProps {
  /** Id of the radio. */
  id: string;
  /** Value of the radio. */
  value: string;
  /** Text that names the radio. */
  label: ReactNode;
  /** Second line that describes it. */
  description?: ReactNode;
  /** Content under the text, such as the other option's input. */
  after?: ReactNode;
  /** The option itself is disabled. */
  disabled: boolean;
  /** The whole group cannot change. */
  locked: boolean;
  /** Plain row or card. */
  appearance: "plain" | "card";
  /** Side of the text the radio is on. */
  position: "start" | "end";
  /** Draws the card as invalid. */
  error?: boolean;
  /** Extra classes of the row. */
  className?: string;
  /** Extra classes of the radio. */
  radioClassName?: string;
  /** Extra classes of the label. */
  labelClassName?: string;
  /** Click handler of the radio, run before Radix's. */
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

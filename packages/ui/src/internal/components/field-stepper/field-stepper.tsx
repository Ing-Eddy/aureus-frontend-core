import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from "lucide-react";
import {
  fieldStepperSplitButtonClassName,
  fieldStepperStackedButtonClassName,
  fieldStepperStackedClassName,
  fieldStrings,
} from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { usePressAndHold } from "./hooks";

export type StepDirection = "increment" | "decrement";

interface StepButtonProps {
  direction: StepDirection;
  /** Id of the controlled input. */
  controls: string;
  disabled: boolean;
  onStep: (direction: StepDirection) => void;
  label: string;
  className: string;
  icon: React.ReactNode;
}

function StepButton({
  direction,
  controls,
  disabled,
  onStep,
  label,
  className,
  icon,
}: StepButtonProps) {
  const handlers = usePressAndHold({ onStep: () => onStep(direction), disabled });
  return (
    <button
      type="button"
      tabIndex={-1}
      data-slot="field-stepper-button"
      data-direction={direction}
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      className={className}
      {...handlers}
    >
      {icon}
    </button>
  );
}

export interface FieldStepperProps {
  controls: string;
  onStep: (direction: StepDirection) => void;
  canIncrement: boolean;
  canDecrement: boolean;
  /** The field is disabled or loading. */
  disabled?: boolean;
  incrementLabel?: string;
  decrementLabel?: string;
  className?: string;
}

/** ▲▼ stacked at the inline end of the frame. */
export function FieldStepperStacked({
  controls,
  onStep,
  canIncrement,
  canDecrement,
  disabled = false,
  incrementLabel = fieldStrings.increase,
  decrementLabel = fieldStrings.decrease,
  className,
}: FieldStepperProps) {
  return (
    <div
      data-slot="field-stepper"
      data-layout="stacked"
      className={cn(fieldStepperStackedClassName, className)}
    >
      <StepButton
        direction="increment"
        controls={controls}
        disabled={disabled || !canIncrement}
        onStep={onStep}
        label={incrementLabel}
        className={fieldStepperStackedButtonClassName}
        icon={<ChevronUpIcon aria-hidden="true" />}
      />
      <StepButton
        direction="decrement"
        controls={controls}
        disabled={disabled || !canDecrement}
        onStep={onStep}
        label={decrementLabel}
        className={fieldStepperStackedButtonClassName}
        icon={<ChevronDownIcon aria-hidden="true" />}
      />
    </div>
  );
}

export interface FieldStepperSplitButtonProps
  extends Omit<FieldStepperProps, "canIncrement" | "canDecrement"> {
  direction: StepDirection;
  canStep: boolean;
}

/** One button of the split layout: − at the inline start, + at the inline end. */
export function FieldStepperSplitButton({
  direction,
  controls,
  onStep,
  canStep,
  disabled = false,
  incrementLabel = fieldStrings.increase,
  decrementLabel = fieldStrings.decrease,
  className,
}: FieldStepperSplitButtonProps) {
  const increment = direction === "increment";
  return (
    <StepButton
      direction={direction}
      controls={controls}
      disabled={disabled || !canStep}
      onStep={onStep}
      label={increment ? incrementLabel : decrementLabel}
      className={cn(fieldStepperSplitButtonClassName[increment ? "end" : "start"], className)}
      icon={increment ? <PlusIcon aria-hidden="true" /> : <MinusIcon aria-hidden="true" />}
    />
  );
}

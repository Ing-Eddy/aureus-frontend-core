import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from "lucide-react";
import {
  fieldStepperSplitButtonClassName,
  fieldStepperStackedButtonClassName,
  fieldStepperStackedClassName,
} from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { usePressAndHold } from "./hooks";

/** Which way a step button moves the value. */
export type StepDirection = "increment" | "decrement";

/** Props of one step button. */
interface StepButtonProps {
  /** Which way it steps. */
  direction: StepDirection;
  /** Id of the controlled input. */
  controls: string;
  /** Whether it can step. */
  disabled: boolean;
  /** Called once per step, repeatedly while held. */
  onStep: (direction: StepDirection) => void;
  /** Accessible name. */
  label: string | undefined;
  /** Classes of the layout it belongs to. */
  className: string;
  /** The arrow or sign shown. */
  icon: React.ReactNode;
}

/**
 * A step button: out of the tab order (the arrow keys of the input do the same) and repeating while
 * held.
 */
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

/** Props of the step buttons of a number field. */
export interface FieldStepperProps {
  /** Id of the controlled input. */
  controls: string;
  /** Called once per step. */
  onStep: (direction: StepDirection) => void;
  /** `false` at the upper limit. */
  canIncrement: boolean;
  /** `false` at the lower limit. */
  canDecrement: boolean;
  /** The field is disabled or loading. */
  disabled?: boolean;
  /**
   * Accessible names of the buttons, from the field's props. The public types require them while
   * the stepper is shown; they are only `undefined` in untyped code, which gets a warning.
   */
  incrementLabel: string | undefined;
  /** Accessible name of the decrement button. */
  decrementLabel: string | undefined;
  /** Extra classes of the stepper. */
  className?: string;
}

/** ▲▼ stacked at the inline end of the frame. */
export function FieldStepperStacked({
  controls,
  onStep,
  canIncrement,
  canDecrement,
  disabled = false,
  incrementLabel,
  decrementLabel,
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

/** Props of `FieldStepperSplitButton`. */
export interface FieldStepperSplitButtonProps
  extends Omit<FieldStepperProps, "canIncrement" | "canDecrement"> {
  /** Which of the two buttons this is. */
  direction: StepDirection;
  /** `false` at the limit in this direction. */
  canStep: boolean;
}

/** One button of the split layout: − at the inline start, + at the inline end. */
export function FieldStepperSplitButton({
  direction,
  controls,
  onStep,
  canStep,
  disabled = false,
  incrementLabel,
  decrementLabel,
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

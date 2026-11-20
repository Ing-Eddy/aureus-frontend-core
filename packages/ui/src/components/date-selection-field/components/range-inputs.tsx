import type { Ref } from "react";
import { DateSegments } from "@/internal/components";
import type { RangeDraft } from "../hooks";

export interface RangeInputsProps {
  draft: RangeDraft;
  onStartChange: (value: string | null) => void;
  onEndChange: (value: string | null) => void;
  locale?: string;
  min?: string;
  max?: string;
  /** Id of the first start segment; the end segments use `${id}-end`. */
  id: string;
  startLabel: string | undefined;
  endLabel: string | undefined;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  ref?: Ref<HTMLSpanElement>;
  segmentsClassName?: string;
  segmentClassName?: string;
}

/** The start and end segments of a range, each named by its own text, separated by a dash. */
export function RangeInputs(props: RangeInputsProps) {
  const shared = {
    mode: "date",
    locale: props.locale,
    hourCycle: 24,
    min: props.min,
    max: props.max,
    disabled: props.disabled,
    loading: props.loading,
    "aria-describedby": props.describedBy,
    "aria-required": props.required,
    "aria-invalid": props.invalid,
    className: props.segmentsClassName,
    segmentClassName: props.segmentClassName,
  } as const;
  return (
    <div data-slot="date-range-inputs" className="flex min-w-0 flex-wrap items-center gap-x-2">
      <DateSegments
        {...shared}
        ref={props.ref}
        id={props.id}
        aria-label={props.startLabel}
        value={props.draft.from}
        onValueChange={props.onStartChange}
      />
      <span aria-hidden="true" className="text-muted-foreground">
        –
      </span>
      <DateSegments
        {...shared}
        id={`${props.id}-end`}
        aria-label={props.endLabel}
        value={props.draft.to}
        onValueChange={props.onEndChange}
      />
    </div>
  );
}

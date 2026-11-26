import type { Ref } from "react";
import { DateSegments } from "@/internal/components";
import type { RangeDraft } from "../hooks";

/** Props of `RangeInputs`. */
export interface RangeInputsProps {
  /** What each end shows. */
  draft: RangeDraft;
  /** Called with the start, `null` while incomplete. */
  onStartChange: (value: string | null) => void;
  /** Called with the end, `null` while incomplete. */
  onEndChange: (value: string | null) => void;
  /** Order and digits of the segments. Defaults to the browser's. */
  locale?: string;
  /** Earliest day. */
  min?: string;
  /** Latest day. */
  max?: string;
  /** Id of the first start segment; the end segments use `${id}-end`. */
  id: string;
  /** Name of the start segments. */
  startLabel: string | undefined;
  /** Name of the end segments. */
  endLabel: string | undefined;
  /** Ids that describe the segments. */
  describedBy?: string;
  /** Marks both ends as required. */
  required?: boolean;
  /** Marks both ends as invalid. */
  invalid?: boolean;
  /** Disables both ends. */
  disabled?: boolean;
  /** Locks both ends while loading. */
  loading?: boolean;
  /** Reaches the first start segment. */
  ref?: Ref<HTMLSpanElement>;
  /** Extra classes of each group. */
  segmentsClassName?: string;
  /** Extra classes of each segment. */
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

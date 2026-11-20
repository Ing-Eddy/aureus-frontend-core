import { type Ref, useEffect, useImperativeHandle } from "react";
import type { IsoMode, TimeGranularity } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { useDateSegments } from "./use-date-segments";

/** What a field can do with its segments from outside: calendar picks and focus. */
export interface DateSegmentsHandle {
  /** Sets the date segments from an ISO date, keeping the time ones. */
  setDate: (date: string) => void;
  /** Focuses a segment: the first one, or the first time segment. */
  focus: (target?: "first" | "time") => void;
  /** Whether every time segment is empty. */
  isTimeEmpty: () => boolean;
  /** The date the segments show once day, month and year are complete, even without a time. */
  getDatePart: () => string | null;
}

export interface DateSegmentsProps {
  mode: IsoMode;
  locale?: string;
  /** Resolved hour cycle. */
  hourCycle: 12 | 24;
  granularity?: TimeGranularity;
  minuteStep?: number;
  secondStep?: number;
  min?: string | null;
  max?: string | null;
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** Id of the first segment; the others get `${id}-${type}`. */
  id: string;
  /** Name of the hidden input with the ISO value. */
  name?: string;
  /** Disables the segments and the hidden input. */
  disabled?: boolean;
  /** Disables the segments only (the value is still submitted). */
  loading?: boolean;
  /** Names the group. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Describes each segment. */
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-invalid"?: boolean;
  /** Reaches the first segment. */
  ref?: Ref<HTMLSpanElement>;
  /** Calendar picks and focus from the field. */
  handleRef?: Ref<DateSegmentsHandle>;
  className?: string;
  segmentClassName?: string;
}

const TIME_TYPES = new Set(["hour", "minute", "second", "dayPeriod"]);

const segmentClassName = [
  "rounded-sm px-0.5 tabular-nums caret-transparent outline-none select-none",
  "focus:bg-accent focus:text-accent-foreground",
  "data-placeholder:text-muted-foreground",
  "aria-disabled:cursor-not-allowed",
  // 24px tall targets, 44px on coarse pointers, without growing the frame.
  "relative after:absolute after:inset-x-0 after:-inset-y-1 pointer-coarse:after:-inset-y-2.5",
].join(" ");

/**
 * Editable date or time segments in the locale's order. Each segment is a `spinbutton` named by the
 * browser's locale data; the group is laid out left to right, as digits are. There are no texts of
 * its own: empty segments show dashes.
 */
export function DateSegments(props: DateSegmentsProps) {
  const {
    mode,
    locale,
    hourCycle,
    granularity,
    minuteStep,
    secondStep,
    min,
    max,
    value,
    onValueChange,
    id,
    name,
    disabled,
    loading,
    ref,
    handleRef,
    className,
  } = props;
  const locked = Boolean(disabled || loading);
  const segments = useDateSegments({
    mode,
    locale,
    hourCycle,
    granularity,
    minuteStep,
    secondStep,
    min,
    max,
    value,
    onValueChange,
    locked,
  });

  useImperativeHandle(handleRef, () => ({
    setDate: segments.setDate,
    focus: (target = "first") =>
      segments.focusSegment(target === "time" ? Math.max(0, segments.firstTimeIndex) : 0),
    isTimeEmpty: () => segments.timeEmpty,
    getDatePart: () => segments.datePart,
  }));

  // Virtual keyboards report text through `beforeinput` only; React does not expose it natively.
  const { refs, onBeforeInput } = segments;
  useEffect(() => {
    const elements = refs.current.slice();
    const listeners = elements.map((element, index) => {
      const listener = (event: Event) => onBeforeInput(index, event as InputEvent);
      element?.addEventListener("beforeinput", listener);
      return listener;
    });
    return () => {
      elements.forEach((element, index) => {
        const listener = listeners[index];
        if (listener) element?.removeEventListener("beforeinput", listener);
      });
    };
  });

  const renderItem = (item: (typeof segments.layout)[number], layoutIndex: number) => {
    if (item.kind === "literal") {
      return (
        <span
          key={`literal-${layoutIndex}`}
          aria-hidden="true"
          className="whitespace-pre text-muted-foreground"
        >
          {item.text}
        </span>
      );
    }
    const segment = segments.segments[segmentIndexOf[layoutIndex] ?? -1];
    if (!segment) return null;
    const { index } = segment;
    return (
      <span
        key={segment.type}
        ref={(element) => {
          refs.current[index] = element;
          if (index === 0 && ref) {
            if (typeof ref === "function") ref(element);
            else ref.current = element;
          }
        }}
        id={index === 0 ? id : `${id}-${segment.type}`}
        role="spinbutton"
        data-slot="date-segment"
        data-type={segment.type}
        data-placeholder={segment.isPlaceholder || undefined}
        tabIndex={locked ? -1 : 0}
        contentEditable={!locked}
        suppressContentEditableWarning
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        inputMode={segment.type === "dayPeriod" ? "text" : "numeric"}
        enterKeyHint="next"
        aria-label={segment.name}
        aria-valuemin={segment.min}
        aria-valuemax={segment.max}
        aria-valuenow={segment.valueNow}
        aria-valuetext={segment.valueText}
        aria-describedby={props["aria-describedby"]}
        aria-required={props["aria-required"] || undefined}
        aria-invalid={props["aria-invalid"] || undefined}
        aria-disabled={locked || undefined}
        onKeyDown={(event) => segments.onKeyDown(index, event)}
        onBlur={() => segments.onSegmentBlur(index)}
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
        className={cn(segmentClassName, props.segmentClassName)}
      >
        {segment.isPlaceholder ? <span aria-hidden="true">{segment.text}</span> : segment.text}
      </span>
    );
  };

  // Which segment each layout item is, and where a long value may wrap: only between its date and
  // its time, so neither part is ever split across lines.
  const segmentIndexOf: number[] = [];
  let counted = 0;
  for (const item of segments.layout) {
    segmentIndexOf.push(item.kind === "segment" ? counted++ : -1);
  }
  const isTime = (item: (typeof segments.layout)[number] | undefined) =>
    item?.kind === "segment" && TIME_TYPES.has(item.type);
  const parts: number[][] = [[]];
  segments.layout.forEach((item, layoutIndex) => {
    parts.at(-1)?.push(layoutIndex);
    const previous = segments.layout[layoutIndex - 1];
    const next = segments.layout[layoutIndex + 1];
    if (item.kind === "literal" && previous && next && isTime(previous) !== isTime(next)) {
      parts.push([]);
    }
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset cannot sit inline inside the field frame.
    <div
      role="group"
      dir="ltr"
      data-slot="date-segments"
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      // Wraps between segments in narrow frames, so every segment stays visible.
      className={cn("inline-flex min-w-0 flex-wrap items-center [unicode-bidi:isolate]", className)}
    >
      {parts.map((part) => (
        <span
          key={part[0]}
          data-slot="date-segments-part"
          className="inline-flex items-center whitespace-nowrap"
        >
          {part.map((layoutIndex) => {
            const item = segments.layout[layoutIndex];
            return item ? renderItem(item, layoutIndex) : null;
          })}
        </span>
      ))}
      {name ? (
        <input type="hidden" name={name} value={segments.value ?? ""} disabled={disabled} />
      ) : null}
    </div>
  );
}

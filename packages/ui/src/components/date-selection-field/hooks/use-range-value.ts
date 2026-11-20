import { useRef, useState } from "react";
import { useControllableState } from "@/internal/hooks";
import { isIsoDate } from "@/internal/utils/helpers";
import { type DateRangeValue, sortRange } from "../utils";

export interface UseRangeValueOptions {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
}

/** What the two groups of segments show: each end, `null` while incomplete. */
export interface RangeDraft {
  from: string | null;
  to: string | null;
}

/** A range of real dates, sorted, or `null`. */
export function validRange(value: unknown): DateRangeValue | null {
  if (!value || typeof value !== "object") return null;
  const { from, to } = value as { from?: unknown; to?: unknown };
  if (!isIsoDate(from) || !(to === null || isIsoDate(to))) return null;
  return sortRange({ from, to });
}

export const sameRange = (a: DateRangeValue | null, b: DateRangeValue | null) =>
  a === b || (a !== null && b !== null && a.from === b.from && a.to === b.to);

const draftOf = (value: DateRangeValue | null): RangeDraft => ({
  from: value?.from ?? null,
  to: value?.to ?? null,
});

/** The value a draft stands for: `null` without a start, sorted otherwise. */
export const rangeOf = (draft: RangeDraft): DateRangeValue | null =>
  draft.from ? sortRange({ from: draft.from, to: draft.to }) : null;

/**
 * The range value, plus a draft of what each group of segments shows. Typing an end before the
 * start emits the range sorted at once, while the segments keep what was typed until `settle`
 * (focus leaving the field) shows it sorted. Clearing the start emits `null` without wiping the
 * end the user typed.
 */
export function useRangeValue({ value, defaultValue, onValueChange }: UseRangeValueOptions) {
  const [current, setCurrent] = useControllableState<DateRangeValue | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const range = validRange(current);
  const [draft, setDraft] = useState<RangeDraft>(() => draftOf(range));
  const [synced, setSynced] = useState<DateRangeValue | null>(range);
  if (!sameRange(range, synced)) {
    // A new value from outside replaces both ends.
    setSynced(range);
    setDraft(draftOf(range));
  }
  const latest = useRef({ draft, synced });
  latest.current = { draft, synced };

  const update = (next: RangeDraft) => {
    const nextRange = rangeOf(next);
    const changed = !sameRange(nextRange, latest.current.synced);
    latest.current = { draft: next, synced: nextRange };
    setDraft(next);
    if (changed) {
      setSynced(nextRange);
      setCurrent(nextRange);
    }
  };

  return {
    /** The sorted range, or `null`. */
    range,
    draft,
    setStart: (from: string | null) => update({ ...latest.current.draft, from }),
    setEnd: (to: string | null) => update({ ...latest.current.draft, to }),
    /** Sets the whole range (calendar picks and presets). */
    setRange: (next: DateRangeValue | null) => update(draftOf(next ? sortRange(next) : null)),
    /** Shows a typed inverted range sorted. */
    settle: () => {
      const sorted = draftOf(rangeOf(latest.current.draft));
      const { draft: shown } = latest.current;
      if (shown.from && (sorted.from !== shown.from || sorted.to !== shown.to)) update(sorted);
    },
  };
}

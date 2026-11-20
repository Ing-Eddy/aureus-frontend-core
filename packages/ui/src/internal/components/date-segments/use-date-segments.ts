import { type KeyboardEvent, useMemo, useRef, useState } from "react";
import {
  formatIsoDate,
  type IsoMode,
  isIsoDate,
  type TimeGranularity,
} from "@/internal/utils/helpers";
import {
  dayPeriodTexts,
  localeDigits,
  monthNames,
  type SegmentLayoutItem,
  type SegmentType,
  segmentLayout,
  segmentNames,
  segmentTypes,
} from "./segment-parts";
import {
  clearSegment,
  commitBuffer,
  edgeSegment,
  emptyState,
  isoFromState,
  isYearPending,
  type SegmentConfig,
  type SegmentState,
  segmentRange,
  stepSegment,
  typeDayPeriod,
  typeDigit,
  valuesFromIso,
  withDate,
} from "./segment-state";

export interface UseDateSegmentsOptions {
  mode: IsoMode;
  locale?: string;
  hourCycle: 12 | 24;
  granularity?: TimeGranularity;
  minuteStep?: number;
  secondStep?: number;
  min?: string | null;
  max?: string | null;
  /** The current value; a value that differs from the last one emitted replaces the segments. */
  value: string | null;
  /** Called when the complete value changes (`null` once it is no longer complete). */
  onValueChange: (value: string | null) => void;
  /** Ignores every edit (disabled or loading). */
  locked?: boolean;
}

/** One segment ready to render. */
export interface SegmentView {
  type: SegmentType;
  /** Index among the segments (not the layout). */
  index: number;
  /** Shown text: the typed digits, the formatted value, or dashes while empty. */
  text: string;
  isPlaceholder: boolean;
  name: string | undefined;
  min: number;
  max: number;
  valueNow: number | undefined;
  valueText: string | undefined;
}

const PLACEHOLDER = "–";

function datePartOf(state: SegmentState): string | null {
  const { year, month, day } = state.values;
  if (year === null || month === null || day === null || isYearPending(state)) return null;
  const date = formatIsoDate({ year, month, day });
  return isIsoDate(date) ? date : null;
}

/**
 * State and keyboard of a group of date or time segments. Pure transitions live in
 * `segment-state.ts`; this hook keeps the state, syncs it with `value`, emits complete values and
 * moves focus between segments.
 */
export function useDateSegments(options: UseDateSegmentsOptions) {
  const {
    mode,
    locale,
    hourCycle,
    granularity = "minute",
    minuteStep = 1,
    secondStep = 1,
    min,
    max,
    value,
    onValueChange,
    locked,
  } = options;

  const layout: SegmentLayoutItem[] = useMemo(
    () =>
      segmentLayout(locale, {
        date: mode !== "time",
        time: mode !== "date",
        hourCycle,
        granularity,
      }),
    [locale, mode, hourCycle, granularity],
  );
  const types = useMemo(() => segmentTypes(layout), [layout]);
  const config: SegmentConfig = {
    types,
    mode,
    hourCycle,
    granularity,
    minuteStep,
    secondStep,
    min,
    max,
  };

  const [state, setState] = useState<SegmentState>(() =>
    emptyState(valuesFromIso(value, mode, hourCycle)),
  );
  // The value the segments show: the last one received or emitted.
  const [synced, setSynced] = useState<string | null>(value);
  const [syncedKey, setSyncedKey] = useState(`${mode}|${hourCycle}`);
  const key = `${mode}|${hourCycle}`;
  if (value !== synced || key !== syncedKey) {
    // A new value from outside (or a new mode) replaces what is shown.
    setSynced(value);
    setSyncedKey(key);
    setState(emptyState(valuesFromIso(value, mode, hourCycle)));
  }

  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const focusSegment = (index: number) => refs.current[index]?.focus();

  // Moving focus fires `blur` before React renders again, so handlers read the latest state here.
  const latest = useRef({ state, synced });
  latest.current = { state, synced };
  const current = () => latest.current.state;

  /** Applies a new state and emits the value when it changed. */
  const update = (next: SegmentState) => {
    const iso = isoFromState(next, config);
    const changed = iso !== latest.current.synced;
    latest.current = { state: next, synced: iso };
    setState(next);
    if (changed) {
      setSynced(iso);
      onValueChange(iso);
    }
  };

  const digits = localeDigits(locale);
  const names = segmentNames(locale);
  const months = monthNames(locale);
  const periods = dayPeriodTexts(locale);
  const literals = layout.flatMap((item) => (item.kind === "literal" ? [item.text.trim()] : []));

  /** Applies one typed character; returns the new state and the segment to focus. */
  const applyCharacter = (
    current: SegmentState,
    index: number,
    character: string,
  ): { state: SegmentState; index: number } => {
    const type = types[index];
    if (!type) return { state: current, index };
    if (type === "dayPeriod") {
      const typed = typeDayPeriod(current, character, periods, locale);
      if (!typed) return { state: current, index };
      return { state: typed.state, index: typed.advance ? nextIndex(index) : index };
    }
    const digit = digits.parse(character);
    if (digit !== null) {
      const typed = typeDigit(current, type, digit, hourCycle);
      return { state: typed.state, index: typed.advance ? nextIndex(index) : index };
    }
    // A separator moves on, as on paper.
    const filled = current.values[type] !== null || current.bufferType === type;
    if (filled && character.trim() && literals.some((literal) => literal.includes(character))) {
      return { state: commitBuffer(current), index: nextIndex(index) };
    }
    return { state: current, index };
  };
  const nextIndex = (index: number) => Math.min(index + 1, types.length - 1);

  /** Types text into a segment, moving on as segments fill. */
  const typeText = (index: number, text: string) => {
    if (locked) return;
    let result = { state: current(), index };
    for (const character of text) result = applyCharacter(result.state, result.index, character);
    update(result.state);
    if (result.index !== index) focusSegment(result.index);
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLSpanElement>) => {
    const type = types[index];
    if (!type || event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        if (!locked) update(stepSegment(current(), type, event.key === "ArrowUp" ? 1 : -1, config));
        return;
      case "ArrowLeft":
        event.preventDefault();
        focusSegment(index - 1);
        return;
      case "ArrowRight":
        event.preventDefault();
        focusSegment(index + 1);
        return;
      case "Home":
      case "End":
        event.preventDefault();
        if (!locked) {
          update(edgeSegment(current(), type, event.key === "Home" ? "min" : "max", config));
        }
        return;
      case "Backspace":
      case "Delete": {
        event.preventDefault();
        if (locked) return;
        const now = current();
        const empty = now.values[type] === null && now.bufferType !== type;
        if (empty && event.key === "Backspace") focusSegment(index - 1);
        else update(clearSegment(now, type));
        return;
      }
      case "Enter":
        // Never inserts a line; the form's own Enter handling is not used by segments.
        event.preventDefault();
        return;
    }
    if (event.key.length === 1) {
      // Printable keys are handled here; `beforeinput` covers keyboards without key values.
      event.preventDefault();
      typeText(index, event.key);
    }
  };

  /** Text from virtual keyboards, which report `Unidentified` keys. */
  const onBeforeInput = (index: number, event: InputEvent) => {
    event.preventDefault();
    if (event.inputType === "insertText" && event.data) {
      typeText(index, event.data);
    } else if (event.inputType.startsWith("delete") && !locked) {
      const type = types[index];
      if (type) update(clearSegment(current(), type));
    }
  };

  /** Leaving a segment ends typing in it (a short year is kept as typed). */
  const onSegmentBlur = (index: number) => {
    const now = current();
    if (now.bufferType && now.bufferType === types[index]) update(commitBuffer(now));
  };

  const segments: SegmentView[] = types.map((type, index) => {
    const range = segmentRange(type, state.values, hourCycle);
    const typing = state.bufferType === type && state.buffer.length > 0;
    const shown = state.values[type];
    const padding = type === "year" ? 4 : 2;
    let text: string;
    if (typing) text = [...state.buffer].map((digit) => digits.format(Number(digit))).join("");
    else if (shown === null) text = PLACEHOLDER.repeat(type === "year" ? 4 : 2);
    else if (type === "dayPeriod") text = periods[shown] ?? "";
    else text = digits.format(shown, padding);
    const pendingYear = type === "year" && isYearPending(state);
    const valueNow = pendingYear ? Number(state.buffer) : (shown ?? undefined);
    return {
      type,
      index,
      text,
      isPlaceholder: !typing && shown === null,
      name: names[type],
      min: range.min,
      max: range.max,
      valueNow,
      valueText:
        valueNow === undefined
          ? undefined
          : type === "month"
            ? months[valueNow - 1]
            : type === "dayPeriod"
              ? periods[valueNow]
              : digits.format(valueNow),
    };
  });

  return {
    layout,
    segments,
    refs,
    focusSegment,
    onKeyDown,
    onBeforeInput,
    onSegmentBlur,
    /** The current ISO value, `null` while incomplete. */
    value: isoFromState(state, config),
    /** Sets the date segments from a calendar pick, keeping the time. */
    setDate: (date: string) => update(withDate(current(), date)),
    /** The date the segments show, once day, month and year are complete. */
    datePart: datePartOf(state),
    /** Whether every time segment is empty. */
    timeEmpty: types
      .filter((type) => ["hour", "minute", "second", "dayPeriod"].includes(type))
      .every((type) => state.values[type] === null),
    /** The index of the first time segment, or -1. */
    firstTimeIndex: types.findIndex((type) => type === "hour" || type === "dayPeriod"),
  };
}

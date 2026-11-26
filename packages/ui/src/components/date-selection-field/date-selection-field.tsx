import { type ReactNode, type Ref, useState } from "react";
import {
  CalendarButton,
  FieldAction,
  FieldCalendar,
  FieldLoading,
  FieldPopover,
  FieldPopoverAnchor,
  FieldPopoverContent,
  FieldShell,
  PresetsList,
  type PresetsListItem,
  useFieldFocusLeave,
} from "@/internal/components";
import { useFieldA11y, useInheritedDirection } from "@/internal/hooks";
import { dateFrameClassName, fieldAddonClassName } from "@/internal/utils/constants";
import { compareIso, isIsoDate } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon } from "@/shadcn/ui/input-group";
import { RangeInputs, SelectionSummary } from "./components";
import {
  sameRange,
  useDateSelectionWarnings,
  useMultipleValue,
  useRangeValue,
  validRange,
} from "./hooks";
import type { DateRangeValue, DateSelectionFieldProps, DateSelectionPreset } from "./types";
import {
  formatDateList,
  isEndBlocked,
  isInRange,
  nextRange,
  normalizeDays,
  type RangeRules,
  toggleDay,
} from "./utils";

/** Selection props as the field reads them: every member is optional inside the library. */
interface SelectionSources {
  /** Controlled value of either selection. */
  value?: unknown;
  /** Initial value of either selection. */
  defaultValue?: unknown;
  /** Change handler of either selection. */
  onValueChange?: (value: never) => void;
  /** Name of the calendar button of a range. */
  openCalendarLabel?: string;
  /** Name of the start of a range. */
  startLabel?: string;
  /** Name of the end of a range. */
  endLabel?: string;
  /** Fewest days of a range. */
  minDays?: number;
  /** Most days of a range. */
  maxDays?: number;
  /** A range cannot contain disabled days. */
  excludeDisabled?: boolean;
  /** Most separate days. */
  maxSelected?: number;
  /** The consumer's summary text. */
  formatSummary?: (dates: readonly string[]) => string;
  /** Shown while no day is chosen. */
  placeholder?: ReactNode;
  /** Shortcuts beside the calendar. */
  presets?: readonly DateSelectionPreset<unknown>[];
  /** Name of their group. */
  presetsLabel?: string;
}

/** The value of a preset, calling it when it is a function. */
const resolvePreset = <Value,>(preset: DateSelectionPreset<Value>): Value =>
  typeof preset.value === "function" ? (preset.value as () => Value)() : preset.value;

/** Whether two sorted day lists are equal. */
const sameDays = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((day, index) => day === b[index]);

/**
 * Several days in a calendar: a range (`{ from, to }`, typed in two groups of segments or chosen in
 * the calendar) or separate days (a sorted list, chosen in the calendar from a summary button).
 * Every extra is opt-in, and there are no default texts: the calendar requires its button names,
 * a range the names of its two ends, and every other text comes from `Intl`.
 *
 * ```tsx
 * <DateSelectionField
 *   label={t("report.period")}
 *   selection="range"
 *   startLabel={t("date.start")}
 *   endLabel={t("date.end")}
 *   openCalendarLabel={t("date.openCalendar")}
 *   previousMonthLabel={t("date.previousMonth")}
 *   nextMonthLabel={t("date.nextMonth")}
 *   maxDays={31}
 *   value={period}
 *   onValueChange={setPeriod}
 * />
 * ```
 */
export function DateSelectionField(props: DateSelectionFieldProps) {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    infoLabel,
    loadingLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    locale,
    weekStartsOn,
    min: rawMin,
    max: rawMax,
    disabledDates,
    isDateDisabled,
    previousMonthLabel,
    nextMonthLabel,
    name,
    id,
    ref,
    onBlur,
    action,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;
  const source = props as SelectionSources;
  const isRange = props.selection === "range";

  useDateSelectionWarnings("DateSelectionField", props);

  const min = isIsoDate(rawMin) ? rawMin : undefined;
  const max = isIsoDate(rawMax) ? rawMax : undefined;
  const a11y = useFieldA11y({
    id,
    describedBy,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });
  const locked = Boolean(disabled || loading);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const range = useRangeValue({
    value: isRange ? (source.value as DateRangeValue | null | undefined) : undefined,
    defaultValue: isRange ? (source.defaultValue as DateRangeValue | null | undefined) : undefined,
    onValueChange: isRange
      ? (source.onValueChange as ((value: DateRangeValue | null) => void) | undefined)
      : undefined,
  });
  const [days, setDays] = useMultipleValue({
    value: isRange ? undefined : (source.value as readonly string[] | undefined),
    defaultValue: isRange ? undefined : (source.defaultValue as readonly string[] | undefined),
    onValueChange: isRange ? undefined : (source.onValueChange as (value: string[]) => void),
  });
  const focus = useFieldFocusLeave((event) => {
    range.settle();
    onBlur?.(event);
  });
  const direction = useInheritedDirection(focus.fieldRef);
  const labelledBy = label ? a11y.labelId : ariaLabelledBy;

  // Every day the calendar disables on its own, for `excludeDisabled`.
  const blocked = new Set(disabledDates ?? []);
  const isBlocked = (day: string) =>
    (min !== undefined && compareIso(day, min) < 0) ||
    (max !== undefined && compareIso(day, max) > 0) ||
    blocked.has(day) ||
    Boolean(isDateDisabled?.(day));
  const rules: RangeRules = {
    minDays: source.minDays,
    maxDays: source.maxDays,
    excludeDisabled: source.excludeDisabled,
    isDisabled: isBlocked,
  };

  const current = range.range;
  const waitingForEnd = isRange && current !== null && current.to === null;
  const pickRange = (day: string) => {
    const next = nextRange(current, day, rules);
    range.setRange(next);
    if (next.to !== null) setOpen(false);
  };
  const maxSelected = source.maxSelected;
  const full = !isRange && maxSelected !== undefined && days.length >= maxSelected;

  const presets = source.presets?.length ? source.presets : null;
  const presetItems: PresetsListItem[] =
    open && presets
      ? presets.map((preset, index) => {
          const value = resolvePreset(preset);
          return {
            key: String(index),
            label: preset.label,
            pressed: isRange
              ? current !== null && sameRange(validRange(value), current)
              : Array.isArray(value) && days.length > 0 && sameDays(normalizeDays(value), days),
            onSelect: () => {
              const chosen = resolvePreset(preset);
              if (isRange) range.setRange(validRange(chosen));
              else setDays(Array.isArray(chosen) ? chosen.filter((day) => isIsoDate(day)) : []);
              setOpen(false);
            },
          };
        })
      : [];

  const summary =
    !isRange && days.length ? (source.formatSummary?.(days) ?? formatDateList(days, locale)) : "";

  const hiddenInputs = name ? (
    isRange ? (
      <>
        <input
          type="hidden"
          name={`${name}[from]`}
          value={current?.from ?? ""}
          disabled={disabled}
        />
        <input type="hidden" name={`${name}[to]`} value={current?.to ?? ""} disabled={disabled} />
      </>
    ) : (
      days.map((day) => (
        <input key={day} type="hidden" name={`${name}[]`} value={day} disabled={disabled} />
      ))
    )
  ) : null;

  return (
    <FieldShell
      inputId={a11y.inputId}
      helperId={a11y.helperId}
      infoId={a11y.infoId}
      rootProps={a11y.rootProps}
      label={label}
      required={required}
      info={info}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      className={className}
      classNames={classNames}
      labelFor={false}
      labelledByRoot={isRange}
      rootAria={
        isRange && !label
          ? { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }
          : undefined
      }
    >
      <FieldPopover open={open && !locked} onOpenChange={setOpen}>
        <FieldPopoverAnchor asChild>
          <InputGroup
            ref={focus.fieldRef}
            data-slot="date-selection-frame"
            onBlur={focus.onBlur}
            className={cn(dateFrameClassName, classNames?.control)}
          >
            {isRange ? (
              <div className="flex min-w-0 flex-1 px-2.5 py-1 text-sm">
                <RangeInputs
                  ref={ref as Ref<HTMLSpanElement>}
                  id={a11y.inputId}
                  draft={range.draft}
                  onStartChange={range.setStart}
                  onEndChange={range.setEnd}
                  locale={locale}
                  min={min}
                  max={max}
                  startLabel={source.startLabel}
                  endLabel={source.endLabel}
                  describedBy={a11y.inputProps["aria-describedby"]}
                  required={required}
                  invalid={error}
                  disabled={disabled}
                  loading={loading}
                  segmentsClassName={classNames?.segments}
                  segmentClassName={cn(classNames?.input, classNames?.segment)}
                />
              </div>
            ) : (
              <SelectionSummary
                ref={ref as Ref<HTMLButtonElement>}
                id={a11y.inputId}
                summary={summary}
                placeholder={source.placeholder}
                labelledBy={labelledBy}
                ariaLabel={ariaLabel}
                describedBy={a11y.inputProps["aria-describedby"]}
                invalid={error}
                disabled={locked}
                className={cn(classNames?.input, classNames?.summary)}
              />
            )}
            {isRange || loading || action ? (
              <InputGroupAddon align="inline-end" className={fieldAddonClassName}>
                {isRange ? (
                  <CalendarButton
                    label={source.openCalendarLabel}
                    disabled={locked}
                    className={classNames?.calendarButton}
                  />
                ) : null}
                {loading ? <FieldLoading label={loadingLabel} /> : null}
                {action ? (
                  <FieldAction
                    {...action}
                    componentName="DateSelectionField"
                    disabled={locked || action.disabled}
                    className={cn(classNames?.action, action.className)}
                  />
                ) : null}
              </InputGroupAddon>
            ) : null}
            {hiddenInputs}
          </InputGroup>
        </FieldPopoverAnchor>
        <FieldPopoverContent
          ref={focus.contentRef}
          onBlur={focus.onBlur}
          aria-labelledby={labelledBy}
          aria-label={label ? undefined : ariaLabel}
          className={classNames?.popover}
          presets={
            presets ? (
              <PresetsList
                label={source.presetsLabel}
                items={presetItems}
                className={classNames?.presets}
              />
            ) : null
          }
        >
          {isRange ? (
            <FieldCalendar
              mode="range"
              selected={current}
              locale={locale}
              weekStartsOn={weekStartsOn}
              previousMonthLabel={previousMonthLabel}
              nextMonthLabel={nextMonthLabel}
              min={min}
              max={max}
              disabledDates={disabledDates}
              isDateDisabled={isDateDisabled}
              isExtraDisabled={
                waitingForEnd && current
                  ? (day) => isEndBlocked(current.from, day, rules)
                  : undefined
              }
              onDayClick={pickRange}
              onDayHover={setHovered}
              isPreview={
                waitingForEnd && current && hovered && compareIso(hovered, current.from) >= 0
                  ? (day) =>
                      !isEndBlocked(current.from, hovered, rules) &&
                      isInRange(day, current.from, hovered)
                  : undefined
              }
              autoFocus
              dir={direction}
              className={classNames?.calendar}
            />
          ) : (
            <FieldCalendar
              mode="multiple"
              selected={days}
              locale={locale}
              weekStartsOn={weekStartsOn}
              previousMonthLabel={previousMonthLabel}
              nextMonthLabel={nextMonthLabel}
              min={min}
              max={max}
              disabledDates={disabledDates}
              isDateDisabled={isDateDisabled}
              isExtraDisabled={full ? (day) => !days.includes(day) : undefined}
              onDayClick={(day) => setDays(toggleDay(days, day, maxSelected))}
              autoFocus
              dir={direction}
              className={classNames?.calendar}
            />
          )}
        </FieldPopoverContent>
      </FieldPopover>
    </FieldShell>
  );
}

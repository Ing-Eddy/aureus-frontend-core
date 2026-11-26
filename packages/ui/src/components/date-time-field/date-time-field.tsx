import { useRef, useState } from "react";
import {
  CalendarButton,
  DateSegments,
  type DateSegmentsHandle,
  FieldAction,
  FieldCalendar,
  FieldLoading,
  FieldPopover,
  FieldPopoverAnchor,
  FieldPopoverContent,
  FieldShell,
  PresetsList,
  resolveHourCycle,
  useFieldFocusLeave,
} from "@/internal/components";
import { useFieldA11y, useInheritedDirection } from "@/internal/hooks";
import { dateFrameClassName, fieldAddonClassName } from "@/internal/utils/constants";
import { isIsoValue, isoDatePart } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon } from "@/shadcn/ui/input-group";
import { useDateTimeValue, useDateTimeWarnings } from "./hooks";
import type { DateTimeFieldProps, DateTimePreset } from "./types";

/** Calendar props as the field reads them: every member is optional inside the library. */
interface CalendarSources {
  /** First day of the week. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Dates that cannot be chosen. */
  disabledDates?: readonly string[];
  /** Matches dates that cannot be chosen. */
  isDateDisabled?: (date: string) => boolean;
  /** Name of the calendar button. */
  openCalendarLabel?: string;
  /** Name of the previous-month button. */
  previousMonthLabel?: string;
  /** Name of the next-month button. */
  nextMonthLabel?: string;
  /** Shortcuts beside the calendar. */
  presets?: readonly DateTimePreset[];
  /** Name of their group. */
  presetsLabel?: string;
  /** 12 or 24-hour clock. */
  hourCycle?: 12 | 24;
  /** Minutes or seconds. */
  granularity?: "minute" | "second";
  /** Arrow step of the minutes. */
  minuteStep?: number;
  /** Arrow step of the seconds. */
  secondStep?: number;
}

/** The value of a preset, calling it when it is a function. */
const resolvePreset = (preset: DateTimePreset) =>
  typeof preset.value === "function" ? preset.value() : preset.value;

/**
 * A date, a time, or both, typed in segments in the locale's order, with a calendar in a popover
 * for the date modes. The value is a local ISO string (`"2026-08-01"`, `"14:30"`,
 * `"2026-08-01T14:30"`), `null` while empty or incomplete. Every extra is opt-in, and there are no
 * default texts: the calendar requires its button names, and every other text comes from `Intl`.
 *
 * ```tsx
 * <DateTimeField
 *   label={t("invoice.dueDate")}
 *   min={todayIso()}
 *   openCalendarLabel={t("date.openCalendar")}
 *   previousMonthLabel={t("date.previousMonth")}
 *   nextMonthLabel={t("date.nextMonth")}
 *   value={dueDate}
 *   onValueChange={setDueDate}
 * />
 * ```
 */
export function DateTimeField(props: DateTimeFieldProps) {
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
    mode = "date",
    locale,
    min,
    max,
    name,
    id,
    ref,
    onBlur,
    action,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;
  const calendarProps = props as CalendarSources;
  const hasCalendar = mode !== "time";
  const hourCycle = resolveHourCycle(locale, calendarProps.hourCycle);

  useDateTimeWarnings("DateTimeField", props);

  const [value, setValue] = useDateTimeValue({
    mode,
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange,
  });
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
  const segments = useRef<DateSegmentsHandle>(null);
  const focus = useFieldFocusLeave(onBlur);
  const direction = useInheritedDirection(focus.fieldRef);
  // Limits that are not values of the mode are ignored (a development warning names them).
  const validMin = isIsoValue(min, mode) ? min : undefined;
  const validMax = isIsoValue(max, mode) ? max : undefined;
  // Focus goes to the first time segment after a pick that leaves the time empty.
  const focusTimeOnClose = useRef(false);

  const labelledBy = label ? a11y.labelId : ariaLabelledBy;
  const pick = (date: string) => {
    if (mode === "datetime") {
      segments.current?.setDate(date);
      focusTimeOnClose.current = Boolean(segments.current?.isTimeEmpty());
    } else {
      setValue(date);
    }
    setOpen(false);
  };

  const presets = calendarProps.presets?.length ? calendarProps.presets : null;
  const presetItems =
    open && presets
      ? presets.map((preset, index) => {
          const presetValue = resolvePreset(preset);
          return {
            key: String(index),
            label: preset.label,
            pressed: value !== null && presetValue === value,
            onSelect: () => {
              setValue(resolvePreset(preset));
              setOpen(false);
            },
          };
        })
      : [];

  const selectedDay = value && mode !== "time" ? isoDatePart(value) : null;

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
    >
      <FieldPopover open={open && hasCalendar && !locked} onOpenChange={setOpen}>
        <FieldPopoverAnchor asChild>
          <InputGroup
            ref={focus.fieldRef}
            data-slot="date-time-frame"
            onBlur={focus.onBlur}
            className={cn(dateFrameClassName, classNames?.control)}
          >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: a pointer shortcut to the first segment; the segments themselves are focusable. */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users reach the segments with Tab. */}
            <div
              className="flex min-w-0 flex-1 px-2.5 py-1 text-sm"
              onClick={(event) => {
                if (event.target === event.currentTarget) segments.current?.focus();
              }}
            >
              <DateSegments
                ref={ref}
                handleRef={segments}
                id={a11y.inputId}
                mode={mode}
                locale={locale}
                hourCycle={hourCycle}
                granularity={calendarProps.granularity}
                minuteStep={calendarProps.minuteStep}
                secondStep={calendarProps.secondStep}
                min={validMin}
                max={validMax}
                value={value}
                onValueChange={setValue}
                name={name}
                disabled={disabled}
                loading={loading}
                aria-labelledby={labelledBy}
                aria-label={label ? undefined : ariaLabel}
                aria-describedby={a11y.inputProps["aria-describedby"]}
                aria-required={required}
                aria-invalid={error}
                className={classNames?.segments}
                segmentClassName={cn(classNames?.input, classNames?.segment)}
              />
            </div>
            {hasCalendar || loading || action ? (
              <InputGroupAddon align="inline-end" className={fieldAddonClassName}>
                {hasCalendar ? (
                  <CalendarButton
                    label={calendarProps.openCalendarLabel}
                    disabled={locked}
                    className={classNames?.calendarButton}
                  />
                ) : null}
                {loading ? <FieldLoading label={loadingLabel} /> : null}
                {action ? (
                  <FieldAction
                    {...action}
                    componentName="DateTimeField"
                    disabled={locked || action.disabled}
                    className={cn(classNames?.action, action.className)}
                  />
                ) : null}
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </FieldPopoverAnchor>
        {hasCalendar ? (
          <FieldPopoverContent
            ref={focus.contentRef}
            onBlur={focus.onBlur}
            aria-labelledby={labelledBy}
            aria-label={label ? undefined : ariaLabel}
            onCloseAutoFocus={(event) => {
              if (!focusTimeOnClose.current) return;
              focusTimeOnClose.current = false;
              event.preventDefault();
              segments.current?.focus("time");
            }}
            className={classNames?.popover}
            presets={
              presets ? (
                <PresetsList
                  label={calendarProps.presetsLabel}
                  items={presetItems}
                  className={classNames?.presets}
                />
              ) : null
            }
          >
            <FieldCalendar
              mode="single"
              selected={selectedDay ?? segments.current?.getDatePart() ?? null}
              locale={locale}
              weekStartsOn={calendarProps.weekStartsOn}
              previousMonthLabel={calendarProps.previousMonthLabel ?? ""}
              nextMonthLabel={calendarProps.nextMonthLabel ?? ""}
              min={validMin}
              max={validMax}
              disabledDates={calendarProps.disabledDates}
              isDateDisabled={calendarProps.isDateDisabled}
              onDayClick={pick}
              autoFocus
              dir={direction}
              className={classNames?.calendar}
            />
          </FieldPopoverContent>
        ) : null}
      </FieldPopover>
    </FieldShell>
  );
}

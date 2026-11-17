import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FieldAction,
  FieldLoading,
  FieldShell,
  SliderBase,
  type SliderBaseThumb,
} from "@/internal/components";
import { useFieldA11y, useInheritedDirection } from "@/internal/hooks";
import { cn } from "@/shadcn/lib/utils";
import {
  SliderHeaderValue,
  SliderInput,
  SliderMarkLabels,
  SliderMarkTicks,
  SliderValueTooltip,
} from "./components";
import { type SliderValue, useSliderValue, useSliderWarnings } from "./hooks";
import type { SliderFieldProps } from "./types";
import {
  createSliderFormatter,
  decimalsOf,
  keyboardValues,
  type SliderLimits,
  visibleMarks,
} from "./utils";

/** Orientation classes on top of shadcn's horizontal look, and the shared thumb size. */
const sliderStyles = {
  container: "[--slider-thumb:0.75rem] pointer-coarse:[--slider-thumb:1.25rem]",
  root: "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-0 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
  track:
    "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1 data-[orientation=vertical]:grow",
  range: "data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full",
  // 12px thumb with a 28px hit area; 20px with 44px on coarse pointers.
  thumb:
    "size-(--slider-thumb) pointer-coarse:after:-inset-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
};

/**
 * A slider with the shared field layout: one value (`number`) or, with `range`, two
 * (`[low, high]`). Every extra is opt-in and independent, and there are no default texts: a single
 * thumb is named by the label, and `range` and `withInput` require the names of their thumbs and
 * inputs. Every slider key follows the props (`step`, `largeStep`, marks).
 */
export function SliderField(props: SliderFieldProps) {
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
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    locale,
    formatOptions,
    formatValue,
    showValue = "none",
    marks,
    snapToMarks,
    orientation = "horizontal",
    height = "12rem",
    name,
    id,
    ref,
    onBlur,
    action,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;
  const range = props.range === true;
  const thumbLabels = props.range === true ? props.thumbLabels : undefined;
  const minDistance = props.range === true ? (props.minDistance ?? 0) : 0;
  const withInput = Boolean(props.withInput);
  const inputLabels: (string | undefined)[] =
    props.range === true ? [...(props.inputLabels ?? [])] : [props.inputLabel];

  useSliderWarnings("SliderField", props);

  const shownMarks = useMemo(() => visibleMarks(marks ?? [], min, max), [marks, min, max]);
  const limits: SliderLimits = {
    min,
    max,
    step,
    minDistance,
    marks: snapToMarks && shownMarks.length ? shownMarks.map((mark) => mark.value) : undefined,
  };

  const slider = useSliderValue({
    range,
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange as ((value: SliderValue) => void) | undefined,
    onValueCommit: props.onValueCommit as ((value: SliderValue) => void) | undefined,
    limits,
  });
  const formatter = useMemo(
    () => createSliderFormatter({ locale, formatOptions, formatValue }),
    [locale, formatOptions, formatValue],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  // Radix defaults to left to right; follow the page instead (layout and arrow keys).
  const direction = useInheritedDirection(containerRef);
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
  const horizontal = orientation === "horizontal";

  // `data-dragging` shows the tooltips while a thumb is dragged with the pointer.
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

  /** Every slider key is computed here, so all of them follow `largeStep`, marks and the grid. */
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const index = Number((event.target as HTMLElement).dataset.thumbIndex);
    if (Number.isNaN(index)) return;
    const next = keyboardValues({
      key: event.key,
      shiftKey: event.shiftKey,
      index,
      values: slider.values,
      orientation,
      direction: direction ?? "ltr",
      limits,
      largeStep: largeStep ?? step * 10,
    });
    if (!next) return;
    // Stops Radix's own key handling.
    event.preventDefault();
    if (!locked && slider.change(next, index)) slider.commit();
  };

  const thumbs: SliderBaseThumb[] = slider.values.map((value, index) => ({
    "data-thumb-index": index,
    ref: index === 0 ? ref : undefined,
    id: index === 0 ? a11y.inputId : `${a11y.inputId}-${index}`,
    "aria-label": range ? thumbLabels?.[index] : label ? undefined : ariaLabel,
    "aria-labelledby": range ? undefined : label ? a11y.labelId : ariaLabelledBy,
    "aria-describedby": a11y.inputProps["aria-describedby"],
    "aria-valuetext": formatter.format(value),
    "aria-required": a11y.inputProps["aria-required"],
    "aria-invalid": a11y.inputProps["aria-invalid"],
    "aria-busy": a11y.inputProps["aria-busy"],
    className: showValue === "tooltip" ? "group/thumb" : undefined,
    children:
      showValue === "tooltip" ? (
        <SliderValueTooltip
          text={formatter.format(value)}
          orientation={orientation}
          className={classNames?.tooltip}
        />
      ) : undefined,
  }));

  const headerValue =
    showValue === "header" ? (
      <SliderHeaderValue
        text={
          range
            ? formatter.formatRange(slider.values[0] as number, slider.values[1] as number)
            : formatter.format(slider.values[0] as number)
        }
        className={classNames?.value}
      />
    ) : null;

  const decimals = Math.max(decimalsOf(step), decimalsOf(min));
  // In narrow containers the inputs wrap below the track: the high (or single) one at the end.
  const inputPlacement = (index: number) =>
    horizontal && (!range || index === 1) ? "ms-auto @sm:ms-0" : undefined;
  const input = (index: number) =>
    withInput ? (
      <SliderInput
        id={`${a11y.inputId}-input-${index}`}
        value={slider.values[index] as number}
        onCommit={(typed) => {
          // As with the keyboard, a typed value stops at the other thumb (and `minDistance`).
          const next = [...slider.values];
          const other = slider.values[1 - index];
          next[index] = !range
            ? typed
            : index === 0
              ? Math.min(typed, (other as number) - minDistance)
              : Math.max(typed, (other as number) + minDistance);
          if (slider.change(next, index)) slider.commit();
        }}
        label={inputLabels[index]}
        valueText={formatter.format(slider.values[index] as number)}
        min={min}
        max={max}
        step={step}
        decimals={decimals}
        locale={locale}
        disabled={locked}
        error={error}
        required={required}
        describedBy={a11y.inputProps["aria-describedby"]}
        className={cn(inputPlacement(index), classNames?.inputs)}
      />
    ) : null;

  const track = (
    <div
      data-slot="slider-area"
      className={cn(
        "flex min-w-0",
        horizontal ? "flex-1 flex-col gap-1.5" : "items-stretch gap-2",
        // Narrow containers give the track its own line, above the inputs.
        horizontal && withInput && "order-first basis-full @sm:order-none @sm:basis-0",
      )}
      style={horizontal ? undefined : { height }}
    >
      <SliderBase
        data-slot="slider"
        dir={direction}
        orientation={orientation}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minDistance > 0 ? Math.ceil(minDistance / step - 1e-9) : 0}
        // With a distance, a dragged thumb stops at it; without one, thumbs trade places.
        preserveThumbOrder={minDistance > 0}
        values={slider.values}
        onValueChange={(next) => {
          const moved = next.findIndex((value, index) => value !== slider.values[index]);
          slider.change(next, moved < 0 ? undefined : moved);
        }}
        onValueCommit={() => {
          setDragging(false);
          slider.commit();
        }}
        onPointerDown={() => {
          if (!locked) setDragging(true);
        }}
        onKeyDown={onKeyDown}
        disabled={locked}
        name={name}
        thumbs={thumbs}
        className={cn(sliderStyles.root, classNames?.slider)}
        classNames={{
          track: cn(sliderStyles.track, classNames?.track),
          range: cn(sliderStyles.range, classNames?.range),
          thumb: cn(sliderStyles.thumb, classNames?.thumb),
        }}
      >
        {shownMarks.length ? (
          <SliderMarkTicks
            marks={shownMarks}
            min={min}
            max={max}
            orientation={orientation}
            className={classNames?.marks}
          />
        ) : null}
      </SliderBase>
      {shownMarks.length ? (
        <SliderMarkLabels
          marks={shownMarks}
          min={min}
          max={max}
          orientation={orientation}
          className={classNames?.marks}
          labelClassName={classNames?.markLabel}
        />
      ) : null}
    </div>
  );

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
      labelledByRoot={range}
      rootAria={
        range && !label ? { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy } : undefined
      }
      headerEnd={
        headerValue || loading ? (
          <>
            {headerValue}
            {loading ? <FieldLoading label={loadingLabel} /> : null}
          </>
        ) : null
      }
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: listens to focus leaving the field; it is not itself interactive. */}
      <div
        ref={containerRef}
        data-slot="slider-container"
        data-orientation={orientation}
        data-dragging={dragging || undefined}
        className={cn(
          "group/slider @container flex min-w-0 gap-3",
          horizontal && withInput && "flex-wrap",
          sliderStyles.container,
          horizontal ? "items-center" : "flex-col items-start",
        )}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
        }}
      >
        {horizontal ? (
          <>
            {range ? input(0) : null}
            {track}
            {input(range ? 1 : 0)}
          </>
        ) : (
          <>
            {track}
            {withInput ? (
              <div data-slot="slider-inputs" className="flex flex-wrap gap-2">
                {input(0)}
                {range ? input(1) : null}
              </div>
            ) : null}
          </>
        )}
        {action ? (
          <FieldAction
            {...action}
            componentName="SliderField"
            disabled={locked || action.disabled}
            className={cn(classNames?.action, action.className)}
          />
        ) : null}
      </div>
    </FieldShell>
  );
}

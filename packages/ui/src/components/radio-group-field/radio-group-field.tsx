import { type MouseEvent, useEffect, useRef, useState } from "react";
import {
  choiceLayoutClassName,
  choiceOptionClassName,
  FieldLoading,
  FieldShell,
} from "@/internal/components";
import { useFieldA11y, useInheritedDirection } from "@/internal/hooks";
import { cn } from "@/shadcn/lib/utils";
import { RadioGroup } from "@/shadcn/ui/radio-group";
import { RadioOptionRow, RadioOtherInput, RadioSegment, segmentedStyles } from "./components";
import { OTHER_ID, useRadioGroupValue, useRadioGroupWarnings } from "./hooks";
import type { RadioGroupFieldProps } from "./types";

/**
 * A group of radios with the shared field layout: exactly one option can be chosen. The value is
 * `string | null` (or the other option's text). Every extra is opt-in and there are no default
 * texts. Keyboard: one tab stop, arrows move and select (Radix radio group).
 *
 * ```tsx
 * <RadioGroupField
 *   label={t("order.delivery")}
 *   options={[
 *     { value: "pickup", label: t("order.pickup") },
 *     { value: "shipping", label: t("order.shipping") },
 *   ]}
 *   defaultValue="pickup"
 *   appearance="card"
 * />
 * ```
 */
export function RadioGroupField(props: RadioGroupFieldProps) {
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
    options,
    value,
    defaultValue,
    onValueChange,
    orientation = "vertical",
    columns,
    appearance = "plain",
    radioPosition = "start",
    otherOption,
    deselectable,
    name,
    id,
    ref,
    onBlur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;

  useRadioGroupWarnings("RadioGroupField", props);

  const group = useRadioGroupValue({
    options,
    value,
    defaultValue,
    onValueChange,
    hasOther: Boolean(otherOption),
    componentName: "RadioGroupField",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  // Radix defaults the group to left to right; follow the page instead (layout and arrow keys).
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
  const segmented = appearance === "segmented";
  const rowAppearance = appearance === "card" ? "card" : "plain";

  // The other input takes focus when its radio is chosen with the pointer. With the arrow keys focus
  // stays on the radio (so arrows keep moving through the group) and Tab moves into the input.
  const otherInputRef = useRef<HTMLInputElement>(null);
  const [focusOther, setFocusOther] = useState(false);
  useEffect(() => {
    if (focusOther && group.isOther) {
      otherInputRef.current?.focus();
      setFocusOther(false);
    }
  }, [focusOther, group.isOther]);

  /** Click handler of a radio: deselects the checked one with `deselectable`. */
  const radioClick = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    if (deselectable && group.radixValue === id) {
      // Stops Radix's own handler, which would keep the radio checked.
      event.preventDefault();
      group.clear();
      return;
    }
    if (id === OTHER_ID && event.detail > 0) setFocusOther(true);
  };

  const otherId = `${a11y.inputId}-other`;
  const otherInput =
    otherOption && group.isOther ? (
      <RadioOtherInput
        ref={otherInputRef}
        id={`${otherId}-input`}
        value={group.otherText}
        onChange={group.setOtherText}
        label={otherOption.inputLabel}
        placeholder={otherOption.placeholder}
        disabled={locked}
        error={error}
        className={classNames?.other}
      />
    ) : null;

  const layout = { orientation, columns, appearance: rowAppearance } as const;
  // The other radio's value is an internal id, so a native form submits the written text instead.
  const submitsOther = Boolean(name) && group.isOther;

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
      headerEnd={loading ? <FieldLoading label={loadingLabel} /> : null}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: listens to focus leaving the group; it is not itself interactive. */}
      <div
        ref={containerRef}
        data-slot="radio-group-container"
        className="@container flex min-w-0 flex-col"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
        }}
      >
        <RadioGroup
          ref={ref}
          dir={direction}
          value={group.radixValue}
          onValueChange={group.choose}
          orientation={columns ? undefined : orientation}
          disabled={locked}
          name={submitsOther ? undefined : name}
          data-layout={orientation}
          data-columns={columns}
          data-appearance={appearance}
          aria-labelledby={label ? a11y.labelId : ariaLabelledBy}
          aria-label={label ? undefined : ariaLabel}
          aria-describedby={a11y.inputProps["aria-describedby"]}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-busy={loading || undefined}
          aria-disabled={locked || undefined}
          className={cn(
            segmented
              ? cn(
                  segmentedStyles.track,
                  orientation === "vertical" && !columns && segmentedStyles.trackVertical,
                )
              : choiceLayoutClassName(layout),
            classNames?.options,
          )}
        >
          {options.map((option, index) =>
            segmented ? (
              <RadioSegment
                key={option.value}
                id={`${a11y.inputId}-${index}`}
                value={option.value}
                label={option.label}
                disabled={option.disabled || locked}
                error={error}
                className={classNames?.option}
                onClick={radioClick(option.value)}
              />
            ) : (
              <RadioOptionRow
                key={option.value}
                id={`${a11y.inputId}-${index}`}
                value={option.value}
                label={option.label}
                description={option.description}
                disabled={Boolean(option.disabled)}
                locked={locked}
                appearance={rowAppearance}
                position={radioPosition}
                error={error}
                className={cn(choiceOptionClassName(layout), classNames?.option)}
                radioClassName={classNames?.radio}
                labelClassName={classNames?.optionLabel}
                onClick={radioClick(option.value)}
              />
            ),
          )}
          {otherOption ? (
            segmented ? (
              <RadioSegment
                id={otherId}
                value={OTHER_ID}
                label={otherOption.label}
                disabled={locked}
                error={error}
                className={classNames?.option}
                onClick={radioClick(OTHER_ID)}
              />
            ) : (
              <RadioOptionRow
                id={otherId}
                value={OTHER_ID}
                label={otherOption.label}
                after={otherInput}
                disabled={false}
                locked={locked}
                appearance={rowAppearance}
                position={radioPosition}
                error={error}
                className={cn(choiceOptionClassName(layout), classNames?.option)}
                radioClassName={classNames?.radio}
                labelClassName={classNames?.optionLabel}
                onClick={radioClick(OTHER_ID)}
              />
            )
          ) : null}
        </RadioGroup>
        {segmented ? otherInput : null}
        {submitsOther ? (
          <input type="hidden" name={name} value={group.otherText} disabled={locked} />
        ) : null}
      </div>
    </FieldShell>
  );
}

import { type FocusEvent, type ReactNode, type Ref, useRef } from "react";
import {
  CheckboxBox,
  ChoiceRow,
  choiceLayoutClassName,
  choiceOptionClassName,
} from "@/internal/components";
import { cn } from "@/shadcn/lib/utils";
import type { CheckboxGroupSelectAllState } from "../hooks";
import type { CheckboxGroupFieldClassNames, CheckboxGroupOption } from "../types";

/** The state of one option's box. */
export interface CheckboxGroupBoxState {
  /** Whether it is checked. */
  checked: boolean;
  /** Whether it cannot be changed (disabled, loading or at the limit). */
  locked: boolean;
  /** Called with the requested state. */
  onChange: (checked: boolean) => void;
}

/** Props of `CheckboxGroupOptions`. */
export interface CheckboxGroupOptionsProps {
  /** Prefix of each box's id. */
  baseId: string;
  /** The choices, in order. */
  options: readonly CheckboxGroupOption[];
  /** State of each option's box. */
  boxState: (option: CheckboxGroupOption) => CheckboxGroupBoxState;
  /** The parent box; absent without `selectAll`. */
  selectAll?: {
    /** Text of the parent box. */
    label: ReactNode;
    /** Whether all, some or none of the enabled options are checked. */
    state: CheckboxGroupSelectAllState;
    /** Whether it cannot be changed. */
    locked: boolean;
    /** Checks or unchecks every enabled option. */
    onToggle: () => void;
  };
  /** Shown in the status region while the limit is reached; nothing otherwise. */
  limitMessage?: ReactNode;
  /** Name of the native checkboxes. */
  name?: string;
  /** Marks the boxes as invalid. */
  error?: boolean;
  /** Stacked or inline. */
  orientation: "vertical" | "horizontal";
  /** A grid with up to this many columns. */
  columns?: 2 | 3 | 4;
  /** Plain rows or cards. */
  appearance: "plain" | "card";
  /** Side of the text each box is on. */
  checkboxPosition: "start" | "end";
  /** Extra classes per part. */
  classNames?: CheckboxGroupFieldClassNames;
  /** Reaches the container. */
  ref?: Ref<HTMLDivElement>;
  /** Called when focus leaves the group. */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}

/** Props of one option row (also used for the select-all row). */
interface OptionRowProps {
  /** Id of the box. */
  id: string;
  /** Text that names the box. */
  label: ReactNode;
  /** Second line that describes it. */
  description?: ReactNode;
  /** Whether it is checked. */
  checked: boolean;
  /** Shows the mixed state. */
  indeterminate?: boolean;
  /** Whether it cannot be changed. */
  locked: boolean;
  /** Called with the requested state. */
  onChange: (checked: boolean) => void;
  /** Name of the native checkbox. */
  name?: string;
  /** Value submitted by the native checkbox. */
  value?: string;
  /** Marks the box as invalid. */
  error?: boolean;
  /** Plain row or card. */
  appearance: "plain" | "card";
  /** Side of the text the box is on. */
  position: "start" | "end";
  /** Extra classes of the row. */
  className?: string;
  /** Extra classes of the box. */
  checkboxClassName?: string;
  /** Extra classes of the label. */
  labelClassName?: string;
}

/** One box with its label and description, named and described by them. */
function OptionRow({
  id,
  label,
  description,
  checked,
  indeterminate,
  locked,
  onChange,
  name,
  value,
  error,
  appearance,
  position,
  className,
  checkboxClassName,
  labelClassName,
}: OptionRowProps) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const textId = `${id}-text`;
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <ChoiceRow
      box={
        <CheckboxBox
          ref={boxRef}
          id={id}
          name={name}
          value={value}
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(next) => onChange(next === true)}
          disabled={locked}
          aria-labelledby={textId}
          aria-describedby={descriptionId}
          aria-invalid={error || undefined}
          className={checkboxClassName}
        />
      }
      boxRef={boxRef}
      textId={textId}
      text={label}
      description={description}
      descriptionId={descriptionId}
      position={position}
      appearance={appearance}
      error={error}
      locked={locked}
      className={className}
      textClassName={labelClassName}
    />
  );
}

/** The options of a checkbox group: optional select-all row, the list/row/grid, the limit message. */
export function CheckboxGroupOptions({
  baseId,
  options,
  boxState,
  selectAll,
  limitMessage,
  name,
  error,
  orientation,
  columns,
  appearance,
  checkboxPosition,
  classNames,
  ref,
  onBlur,
}: CheckboxGroupOptionsProps) {
  const card = appearance === "card";
  // Under a select-all row, a plain vertical list is indented to read as its children.
  const indent = selectAll && !card && !columns && orientation === "vertical";
  const layout = { orientation, columns, appearance, indent: Boolean(indent) };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: listens to focus leaving the boxes inside; it is not itself interactive.
    <div
      ref={ref}
      data-slot="checkbox-group"
      className="@container flex min-w-0 flex-col gap-3"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
      }}
    >
      {selectAll ? (
        <OptionRow
          id={`${baseId}-all`}
          label={selectAll.label}
          checked={selectAll.state === "all"}
          indeterminate={selectAll.state === "some"}
          locked={selectAll.locked}
          onChange={() => selectAll.onToggle()}
          error={error}
          appearance={appearance}
          position={checkboxPosition}
          className={classNames?.selectAll}
          checkboxClassName={classNames?.checkbox}
        />
      ) : null}
      <div
        data-slot="checkbox-group-options"
        data-orientation={orientation}
        data-columns={columns}
        className={cn(choiceLayoutClassName(layout), classNames?.options)}
      >
        {options.map((option, index) => {
          const state = boxState(option);
          return (
            <OptionRow
              key={option.value}
              id={`${baseId}-${index}`}
              label={option.label}
              description={option.description}
              checked={state.checked}
              locked={state.locked}
              onChange={state.onChange}
              name={name}
              value={option.value}
              error={error}
              appearance={appearance}
              position={checkboxPosition}
              className={cn(choiceOptionClassName(layout), classNames?.option)}
              checkboxClassName={classNames?.checkbox}
              labelClassName={classNames?.optionLabel}
            />
          );
        })}
      </div>
      <div
        data-slot="checkbox-group-limit"
        role="status"
        aria-live="polite"
        // `sr-only` while empty keeps the live region in the accessibility tree (so the message is
        // announced when it appears) without adding a gap to the layout.
        className="text-sm text-muted-foreground empty:sr-only"
      >
        {limitMessage}
      </div>
    </div>
  );
}

import { type FocusEvent, type ReactNode, type Ref, useRef } from "react";
import { CheckboxBox, CheckboxRow } from "@/internal/components";
import { cn } from "@/shadcn/lib/utils";
import type { CheckboxGroupSelectAllState } from "../hooks";
import type { CheckboxGroupFieldClassNames, CheckboxGroupOption } from "../types";

/** Literal classes, so Tailwind finds them. The grid collapses with its container's width. */
const columnClasses = {
  2: "grid grid-cols-1 gap-3 @sm:grid-cols-2",
  3: "grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3",
  4: "grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4",
} as const;

export interface CheckboxGroupBoxState {
  checked: boolean;
  locked: boolean;
  onChange: (checked: boolean) => void;
}

export interface CheckboxGroupOptionsProps {
  baseId: string;
  options: readonly CheckboxGroupOption[];
  /** State of each option's box. */
  boxState: (option: CheckboxGroupOption) => CheckboxGroupBoxState;
  selectAll?: {
    label: ReactNode;
    state: CheckboxGroupSelectAllState;
    locked: boolean;
    onToggle: () => void;
  };
  /** Shown in the status region while the limit is reached; nothing otherwise. */
  limitMessage?: ReactNode;
  name?: string;
  error?: boolean;
  orientation: "vertical" | "horizontal";
  columns?: 2 | 3 | 4;
  appearance: "plain" | "card";
  checkboxPosition: "start" | "end";
  classNames?: CheckboxGroupFieldClassNames;
  ref?: Ref<HTMLDivElement>;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}

interface OptionRowProps {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  indeterminate?: boolean;
  locked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  value?: string;
  error?: boolean;
  appearance: "plain" | "card";
  position: "start" | "end";
  className?: string;
  checkboxClassName?: string;
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
    <CheckboxRow
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
  const layout = columns
    ? columnClasses[columns]
    : orientation === "horizontal"
      ? "flex flex-row flex-wrap gap-x-6 gap-y-3"
      : cn("flex flex-col", card ? "gap-2" : "gap-3");
  // Under a select-all row, a plain vertical list is indented to read as its children.
  const indent = selectAll && !card && !columns && orientation === "vertical";

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
        className={cn(layout, indent && "ps-6", classNames?.options)}
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
              className={cn(
                columns || orientation === "vertical" ? undefined : "w-auto",
                classNames?.option,
              )}
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

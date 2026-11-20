import { CalendarIcon } from "lucide-react";
import { type FocusEvent, type ReactNode, type Ref, useRef } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";

/** The popover root: holds the anchor (the field frame), the trigger and the content. */
export const FieldPopover = Popover;
/** Lines the popover up with the whole field frame (`asChild`). */
export const FieldPopoverAnchor = PopoverAnchor;
/** Any button that opens the popover (`asChild`), such as the summary of several days. */
export const FieldPopoverTrigger = PopoverTrigger;

export interface CalendarButtonProps {
  /** Accessible name, from the field's `openCalendarLabel`. */
  label: string | undefined;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

/** The icon button beside the segments that opens the calendar. */
export function CalendarButton({ label, disabled, className, ref }: CalendarButtonProps) {
  return (
    <PopoverTrigger asChild>
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="icon-sm"
        data-slot="field-calendar-button"
        aria-label={label}
        disabled={disabled}
        className={cn("pointer-coarse:after:absolute pointer-coarse:after:-inset-2", className)}
      >
        <CalendarIcon aria-hidden="true" />
      </Button>
    </PopoverTrigger>
  );
}

export interface FieldPopoverContentProps {
  /** Names the dialog: the field's label id. */
  "aria-labelledby"?: string;
  /** Names the dialog when there is no label. */
  "aria-label"?: string;
  /** The presets column, beside the calendar (above it in narrow viewports). */
  presets?: ReactNode;
  children: ReactNode;
  /** Return focus elsewhere than the trigger by calling `event.preventDefault()`. */
  onCloseAutoFocus?: (event: Event) => void;
  /** Called when focus leaves the content (see `useFieldFocusLeave`). */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

/**
 * The calendar dialog. Focus goes to the calendar's own day (its `autoFocus`), not to the first
 * focusable element, and returns to the trigger on close.
 */
export function FieldPopoverContent(props: FieldPopoverContentProps) {
  const { presets, children, onCloseAutoFocus, onBlur, ref, className } = props;
  return (
    <PopoverContent
      ref={ref}
      data-slot="field-popover"
      align="start"
      aria-labelledby={props["aria-labelledby"]}
      aria-label={props["aria-label"]}
      onOpenAutoFocus={(event) => event.preventDefault()}
      onCloseAutoFocus={onCloseAutoFocus}
      onBlur={onBlur}
      className={cn(
        "w-auto max-w-[calc(100vw-2rem)] gap-3 p-3 sm:flex-row motion-reduce:animate-none",
        className,
      )}
    >
      {presets}
      {children}
    </PopoverContent>
  );
}

/**
 * Blur across the portal: the field frame and the popover content are separate DOM trees, so
 * `onLeave` is called only when focus moves to an element outside both. Opening the calendar is
 * therefore not leaving the field.
 */
export function useFieldFocusLeave(onLeave?: (event: FocusEvent<HTMLDivElement>) => void) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && (fieldRef.current?.contains(next) || contentRef.current?.contains(next))) return;
    onLeave?.(event);
  };
  return { fieldRef, contentRef, onBlur };
}

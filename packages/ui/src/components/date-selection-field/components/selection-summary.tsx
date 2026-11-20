import { CalendarIcon } from "lucide-react";
import type { ReactNode, Ref } from "react";
import { FieldPopoverTrigger } from "@/internal/components";
import { cn } from "@/shadcn/lib/utils";

export interface SelectionSummaryProps {
  id: string;
  /** The formatted days, or empty. */
  summary: string;
  placeholder?: ReactNode;
  /** Ids that name the button before the summary (the label), when there is a label. */
  labelledBy?: string;
  /** Name of the button when there is no label. */
  ariaLabel?: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

/**
 * The button of several days: it shows the summary and opens the calendar. It is named by the label
 * and the summary, so screen readers hear both.
 */
export function SelectionSummary(props: SelectionSummaryProps) {
  const summaryId = `${props.id}-summary`;
  const named = Boolean(props.labelledBy);
  const describedBy =
    [props.describedBy, named ? undefined : summaryId].filter(Boolean).join(" ") || undefined;
  return (
    <FieldPopoverTrigger asChild>
      <button
        ref={props.ref}
        id={props.id}
        type="button"
        data-slot="date-selection-summary"
        aria-labelledby={named ? `${props.labelledBy} ${summaryId}` : undefined}
        aria-label={named ? undefined : props.ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={props.invalid || undefined}
        disabled={props.disabled}
        className={cn(
          "flex h-full min-h-8 min-w-0 flex-1 items-center gap-2 rounded-[inherit] px-2.5 text-start text-sm outline-none disabled:cursor-not-allowed",
          props.className,
        )}
      >
        <span
          id={summaryId}
          className={cn("min-w-0 flex-1 truncate", !props.summary && "text-muted-foreground")}
        >
          {props.summary || props.placeholder}
        </span>
        <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </button>
    </FieldPopoverTrigger>
  );
}

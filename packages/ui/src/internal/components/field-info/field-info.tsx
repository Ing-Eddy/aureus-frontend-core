import { InfoIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { fieldStrings } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";

export interface FieldInfoProps {
  /** Id of the screen-reader copy of the content, referenced by the input's `aria-describedby`. */
  id: string;
  content: ReactNode;
  /** Accessible name of the button. */
  label?: string;
  className?: string;
}

/**
 * Info button with a tooltip (a "toggletip"). It opens on hover and focus like any tooltip, and
 * a click or tap toggles it, so it also works on touch screens. Escape closes it.
 */
export function FieldInfo({
  id,
  content,
  label = fieldStrings.moreInformation,
  className,
}: FieldInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-slot="field-info"
            aria-label={label}
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 group-data-[disabled=true]/field:opacity-50 [&_svg]:size-4",
              className,
            )}
            onClick={(event) => {
              // Radix closes the tooltip on click; toggle instead, so a tap can open it.
              event.preventDefault();
              setOpen((current) => !current);
            }}
          >
            <InfoIcon aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
      <span id={id} className="sr-only">
        {content}
      </span>
    </>
  );
}

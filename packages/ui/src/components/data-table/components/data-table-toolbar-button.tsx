import type { ComponentProps } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";

/** Props of `DataTableToolbarButton`: the button's, plus its name. */
export interface DataTableToolbarButtonProps extends ComponentProps<typeof Button> {
  /** Accessible name and tooltip. */
  label: string;
}

/** An icon button of the toolbar, named by its label and showing it as a tooltip. */
export function DataTableToolbarButton({
  label,
  className,
  children,
  ...props
}: DataTableToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={label}
          className={cn("relative", className)}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

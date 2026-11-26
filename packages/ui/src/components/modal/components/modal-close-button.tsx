import { XIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { useModalContext } from "../hooks";
import { closeButtonClassName } from "../utils";

/** Props of `ModalCloseButton`. */
export interface ModalCloseButtonProps {
  /** Accessible name, from `closeLabel`. */
  label: string | undefined;
  /** The `closeButtonClassName` of `ModalContent`. */
  className?: string;
}

/** The built-in close button (reason `"close-button"`), named by the consumer's `closeLabel`. */
export function ModalCloseButton({ label, className }: ModalCloseButtonProps) {
  const context = useModalContext("ModalContent");
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="modal-close-button"
      aria-label={label}
      onClick={() => context.setOpen(false, "close-button")}
      className={cn(closeButtonClassName, className)}
    >
      <XIcon aria-hidden="true" />
    </Button>
  );
}

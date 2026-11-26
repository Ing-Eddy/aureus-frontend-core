import { Slot } from "radix-ui";
import type { MouseEvent } from "react";
import { mergeRefs } from "@/internal/utils/helpers";
import { useModalContext } from "../hooks";
import type { ModalTriggerProps } from "../types";

/**
 * Opens and closes the modal (reason `"trigger"`). It is rendered outside the dialog and drawer
 * primitives, so it keeps its DOM node when the mode changes, and focus returns to it on close. An
 * `onClick` that prevents the default stops the toggle.
 *
 * ```tsx
 * <ModalTrigger asChild>
 *   <Button>{t("users.create")}</Button>
 * </ModalTrigger>
 * ```
 */
export function ModalTrigger({ asChild = false, onClick, ref, ...props }: ModalTriggerProps) {
  const context = useModalContext("ModalTrigger");
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="modal-trigger"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={context.open ? "open" : "closed"}
      {...props}
      ref={mergeRefs(context.triggerRef, ref)}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(!context.open, "trigger");
      }}
    />
  );
}

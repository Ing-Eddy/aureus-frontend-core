import { Slot } from "radix-ui";
import type { MouseEvent } from "react";
import { useModalContext } from "../hooks";
import type { ModalCloseProps } from "../types";

/**
 * Closes the modal (reason `"close"`). Use `asChild` to render your own button. An `onClick` that
 * prevents the default keeps the modal open.
 *
 * ```tsx
 * <ModalClose asChild>
 *   <Button variant="outline">{t("common.cancel")}</Button>
 * </ModalClose>
 * ```
 */
export function ModalClose({ asChild = false, onClick, ...props }: ModalCloseProps) {
  const context = useModalContext("ModalClose");
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="modal-close"
      {...props}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(false, "close");
      }}
    />
  );
}

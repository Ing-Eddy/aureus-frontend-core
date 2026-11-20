import type { ModalContentProps } from "../types";
import type { ModalContextValue } from "./use-modal";

/**
 * Focus on open and close. The modal renders its own trigger, outside the primitive, so the
 * primitive does not know where to return focus: on close, focus goes to `returnFocusRef`, then
 * the trigger, then the element focused before opening. When the panel unmounts only because the
 * mode changed (the modal is still open), focus is left to the new panel.
 */
export function useModalFocus(
  context: ModalContextValue,
  {
    initialFocusRef,
    returnFocusRef,
    onOpenAutoFocus,
    onCloseAutoFocus,
  }: Pick<
    ModalContentProps,
    "initialFocusRef" | "returnFocusRef" | "onOpenAutoFocus" | "onCloseAutoFocus"
  >,
) {
  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;
    const target = initialFocusRef?.current;
    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  const handleCloseAutoFocus = (event: Event) => {
    if (context.openRef.current) {
      event.preventDefault();
      return;
    }
    onCloseAutoFocus?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    const target = [
      returnFocusRef?.current,
      context.triggerRef.current,
      context.previouslyFocusedRef.current,
    ].find((element) => element?.isConnected);
    target?.focus();
  };

  return { onOpenAutoFocus: handleOpenAutoFocus, onCloseAutoFocus: handleCloseAutoFocus };
}

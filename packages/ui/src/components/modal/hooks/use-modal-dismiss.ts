import type { Dialog as DialogPrimitive } from "radix-ui";
import type { ModalContentProps } from "../types";
import type { ModalContextValue } from "./use-modal";

type InteractOutsideEvent = Parameters<
  NonNullable<DialogPrimitive.DialogContentProps["onInteractOutside"]>
>[0];
type PointerDownOutsideEvent = Parameters<
  NonNullable<DialogPrimitive.DialogContentProps["onPointerDownOutside"]>
>[0];

const FOCUS_OUTSIDE = "dismissableLayer.focusOutside";

/**
 * The dismissal handlers of the panel, the same in both modes. Each `closeOn*` flag blocks only
 * its own way of closing, and the consumer's handlers run first (their `preventDefault()` wins).
 *
 * - When the primitive would close by itself, the reason is recorded and the primitive's
 *   `onOpenChange` reports it.
 * - When the drawer cannot (`closeOnSwipe={false}` makes Vaul ignore every close request, and a
 *   non-modal Vaul drawer ignores outside presses), the modal closes itself through `open`.
 */
export function useModalDismiss(
  context: ModalContextValue,
  {
    onEscapeKeyDown,
    onInteractOutside,
  }: Pick<ModalContentProps, "onEscapeKeyDown" | "onInteractOutside">,
) {
  const { mode, modal, closeOnEscape, closeOnOutsidePress, closeOnSwipe, setOpen, reasonRef } =
    context;
  const drawer = mode === "drawer";
  const ignoresCloses = drawer && !closeOnSwipe;
  const ignoresOutside = ignoresCloses || (drawer && !modal);

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    onEscapeKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (!closeOnEscape) {
      event.preventDefault();
      return;
    }
    if (ignoresCloses) {
      event.preventDefault();
      setOpen(false, "escape-key");
      return;
    }
    reasonRef.current = "escape-key";
  };

  const handleOutside = (event: InteractOutsideEvent) => {
    onInteractOutside?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as Node | null;
    // The trigger toggles the modal itself; closing here would reopen it on click.
    if (target && context.triggerRef.current?.contains(target)) {
      event.preventDefault();
      return;
    }
    if (!closeOnOutsidePress) {
      event.preventDefault();
      return;
    }
    if (ignoresOutside) {
      event.preventDefault();
      setOpen(false, "outside-press");
      return;
    }
    reasonRef.current = "outside-press";
  };

  // Radix calls `onPointerDownOutside` and then `onInteractOutside` for the same press; the
  // consumer's `onInteractOutside` is called once, from the first. Vaul prevents outside presses
  // of a non-modal drawer after `onPointerDownOutside`, so the decision must be made there.
  const handlePointerDownOutside = (event: PointerDownOutsideEvent) => handleOutside(event);
  const handleInteractOutside = (event: InteractOutsideEvent) => {
    if (event.type === FOCUS_OUTSIDE) handleOutside(event);
  };

  /** The primitive's own close requests: Escape, outside press, or dragging the drawer. */
  const handlePrimitiveOpenChange = (next: boolean) => {
    if (next) return;
    const reason = reasonRef.current ?? (drawer ? "swipe" : "outside-press");
    reasonRef.current = null;
    setOpen(false, reason);
  };

  return {
    onEscapeKeyDown: handleEscapeKeyDown,
    onPointerDownOutside: handlePointerDownOutside,
    onInteractOutside: handleInteractOutside,
    onPrimitiveOpenChange: handlePrimitiveOpenChange,
  };
}

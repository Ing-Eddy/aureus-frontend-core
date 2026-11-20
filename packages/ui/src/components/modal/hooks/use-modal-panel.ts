import { useCallback, useMemo, useRef, useState } from "react";
import { mergeRefs } from "@/internal/utils/helpers";
import type { ModalContentProps } from "../types";
import type { ModalContextValue, ModalPanelContextValue } from "./use-modal";
import { useModalDismiss } from "./use-modal-dismiss";
import { useModalFocus } from "./use-modal-focus";

/**
 * What both views share: the props of the primitive content (id, accessible description,
 * dismissal and focus handlers, ref), the context of the sections, and the props each view
 * renders itself.
 */
export function useModalPanel(context: ModalContextValue, props: ModalContentProps) {
  const {
    size = "sm",
    drawerHandle = true,
    initialFocusRef,
    returnFocusRef,
    container,
    overlayClassName,
    closeButtonClassName,
    handleClassName,
    closeButton = false,
    closeLabel,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onInteractOutside,
    className,
    children,
    ref,
    ...rest
  } = props;

  const dismiss = useModalDismiss(context, { onEscapeKeyDown, onInteractOutside });
  const focus = useModalFocus(context, {
    initialFocusRef,
    returnFocusRef,
    onOpenAutoFocus,
    onCloseAutoFocus,
  });

  const titleCount = useRef(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const registerTitle = useCallback(() => {
    titleCount.current += 1;
    return () => {
      titleCount.current -= 1;
    };
  }, []);
  const registerDescription = useCallback(() => {
    setDescriptionCount((count) => count + 1);
    return () => setDescriptionCount((count) => count - 1);
  }, []);
  const panelValue = useMemo<ModalPanelContextValue>(
    () => ({ mode: context.mode, registerTitle, registerDescription }),
    [context.mode, registerTitle, registerDescription],
  );

  const panelRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMemo(() => mergeRefs(panelRef, ref), [ref]);

  const contentProps = {
    ...rest,
    ref: mergedRef,
    id: context.contentId,
    // Without a description the panel is not described, and Radix does not warn about it.
    ...(descriptionCount > 0 ? {} : { "aria-describedby": undefined }),
    "data-slot": "modal-content",
    "data-mode": context.mode,
    "data-size": size,
    onEscapeKeyDown: dismiss.onEscapeKeyDown,
    onPointerDownOutside: dismiss.onPointerDownOutside,
    onInteractOutside: dismiss.onInteractOutside,
    onOpenAutoFocus: focus.onOpenAutoFocus,
    onCloseAutoFocus: focus.onCloseAutoFocus,
  };

  return {
    contentProps,
    onPrimitiveOpenChange: dismiss.onPrimitiveOpenChange,
    panelValue,
    panelRef,
    titleCount,
    size,
    drawerHandle,
    container,
    overlayClassName,
    closeButtonClassName,
    handleClassName,
    closeButton,
    closeLabel,
    className,
    children,
  };
}

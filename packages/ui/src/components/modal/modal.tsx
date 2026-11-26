import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import { ModalContext, type ModalContextValue, useModalMode } from "./hooks";
import type { ModalOpenChangeReason, ModalProps } from "./types";

/**
 * A modal that is a centred dialog on wide viewports and a drawer on narrow ones. `Modal` holds the
 * state and behaviour and renders no element: compose it with `ModalTrigger`, `ModalContent` and
 * the sections. Only `ModalContent` changes when the mode changes, so the trigger and everything
 * beside the panel keep their DOM nodes. It renders no text of its own.
 *
 * ```tsx
 * <Modal open={isOpen} onOpenChange={(next) => setOpen(next)}>
 *   <ModalTrigger>{t("users.create")}</ModalTrigger>
 *   <ModalContent size="md" closeButton closeLabel={t("common.close")}>
 *     <ModalHeader>
 *       <ModalTitle>{t("users.createTitle")}</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>{form}</ModalBody>
 *     <ModalFooter>
 *       <ModalClose>{t("common.cancel")}</ModalClose>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export function Modal({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
  mode = "responsive",
  breakpoint = 768,
  lockModeWhileOpen = false,
  onModeChange,
  closeOnEscape = true,
  closeOnOutsidePress = true,
  closeOnSwipe = true,
  modal = true,
  drawerDirection = "bottom",
  drawerSnapPoints,
  drawerActiveSnapPoint,
  onDrawerActiveSnapPointChange,
  onDrawerDrag,
  onDrawerRelease,
  drawerHandleOnly = false,
  drawerScaleBackground = false,
  drawerRepositionInputs = true,
}: ModalProps) {
  const [open, setOpenState] = useControllableState({ value: openProp, defaultValue: defaultOpen });
  const openRef = useRef(open);
  openRef.current = open;

  const resolvedMode = useModalMode({ mode, breakpoint, lockModeWhileOpen, open, onModeChange });
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const reasonRef = useRef<ModalOpenChangeReason | null>(null);

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const setOpen = useCallback(
    (next: boolean, reason: ModalOpenChangeReason) => {
      if (next === openRef.current) return;
      onOpenChangeRef.current?.(next, { reason });
      setOpenState(next);
    },
    [setOpenState],
  );

  // Runs before the panel's focus scope moves focus inside, so the element is still focused.
  useLayoutEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    previouslyFocusedRef.current = active instanceof HTMLElement ? active : null;
  }, [open]);

  // One completion per change of `open`: a mode switch remounts the panel and must not repeat it.
  const onCompleteRef = useRef(onOpenChangeComplete);
  onCompleteRef.current = onOpenChangeComplete;
  const reportedRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (reportedRef.current !== open) reportedRef.current = null;
  }, [open]);
  const reportComplete = useCallback((state: boolean) => {
    if (state !== openRef.current || reportedRef.current === state) return;
    reportedRef.current = state;
    onCompleteRef.current?.(state);
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      open,
      openRef,
      setOpen,
      mode: resolvedMode,
      contentId,
      triggerRef,
      previouslyFocusedRef,
      reasonRef,
      reportComplete,
      closeOnEscape,
      closeOnOutsidePress,
      closeOnSwipe,
      modal,
      drawer: {
        direction: drawerDirection,
        snapPoints: drawerSnapPoints,
        activeSnapPoint: drawerActiveSnapPoint,
        onActiveSnapPointChange: onDrawerActiveSnapPointChange,
        onDrag: onDrawerDrag,
        onRelease: onDrawerRelease,
        handleOnly: drawerHandleOnly,
        scaleBackground: drawerScaleBackground,
        repositionInputs: drawerRepositionInputs,
      },
    }),
    [
      open,
      setOpen,
      resolvedMode,
      contentId,
      reportComplete,
      closeOnEscape,
      closeOnOutsidePress,
      closeOnSwipe,
      modal,
      drawerDirection,
      drawerSnapPoints,
      drawerActiveSnapPoint,
      onDrawerActiveSnapPointChange,
      onDrawerDrag,
      onDrawerRelease,
      drawerHandleOnly,
      drawerScaleBackground,
      drawerRepositionInputs,
    ],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

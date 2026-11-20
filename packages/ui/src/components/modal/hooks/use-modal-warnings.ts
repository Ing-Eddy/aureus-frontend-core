import { type RefObject, useEffect } from "react";
import { useMissingTexts } from "@/internal/hooks";
import { isDev } from "@/internal/utils/constants";

/** The texts that typed code cannot omit, checked again for untyped JavaScript. */
export function useModalWarnings({
  closeButton,
  closeLabel,
}: {
  closeButton?: boolean;
  closeLabel?: string;
}) {
  useMissingTexts("Modal", [[closeButton && !closeLabel, "`closeButton` needs `closeLabel`"]]);
}

export const missingTitleWarning =
  "Modal: ModalContent has no ModalTitle, so the dialog has no accessible name.";

/**
 * Warns once per `ModalContent` when an open panel has no `ModalTitle`. The titles register in a
 * layout effect, so the count is complete when this passive effect runs.
 */
export function useMissingTitleWarning(titleCount: RefObject<number>, warned: RefObject<boolean>) {
  useEffect(() => {
    if (!isDev || warned.current || titleCount.current > 0) return;
    warned.current = true;
    console.warn(missingTitleWarning);
  }, [titleCount, warned]);
}

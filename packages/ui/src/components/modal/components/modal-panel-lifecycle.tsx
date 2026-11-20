import { type RefObject, useEffect } from "react";
import { useMissingTitleWarning, useModalContext } from "../hooks";

/** The longest panel animation (Vaul's 500 ms), plus a margin: the fallback for completion. */
const COMPLETE_FALLBACK_MS = 600;

const isAnimated = (node: HTMLElement) => {
  const style = getComputedStyle(node);
  const animation = style.animationName && style.animationName !== "none";
  const transition = Number.parseFloat(style.transitionDuration || "0") > 0;
  return Boolean(animation || transition);
};

export interface ModalPanelLifecycleProps {
  panelRef: RefObject<HTMLDivElement | null>;
  titleCount: RefObject<number>;
  titleWarned: RefObject<boolean>;
}

/**
 * Mounted inside the primitive content, so it lives exactly as long as the open panel:
 * - after mounting, it reports the end of the opening animation (at once without animation);
 * - when it unmounts because the modal closed, the closing animation has ended (the primitive
 *   unmounts the content after it);
 * - it warns once when the panel has no `ModalTitle`.
 */
export function ModalPanelLifecycle({
  panelRef,
  titleCount,
  titleWarned,
}: ModalPanelLifecycleProps) {
  const { reportComplete, openRef } = useModalContext("ModalContent");
  useMissingTitleWarning(titleCount, titleWarned);

  useEffect(() => {
    const node = panelRef.current;
    if (!node || !isAnimated(node)) {
      reportComplete(true);
    } else {
      const onEnd = (event: Event) => {
        if (event.target === node) reportComplete(true);
      };
      const timer = setTimeout(() => reportComplete(true), COMPLETE_FALLBACK_MS);
      node.addEventListener("animationend", onEnd);
      node.addEventListener("transitionend", onEnd);
      return () => {
        clearTimeout(timer);
        node.removeEventListener("animationend", onEnd);
        node.removeEventListener("transitionend", onEnd);
        if (!openRef.current) reportComplete(false);
      };
    }
    return () => {
      if (!openRef.current) reportComplete(false);
    };
  }, [panelRef, reportComplete, openRef]);

  return null;
}

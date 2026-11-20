import { createContext, type RefObject, useContext } from "react";
import type {
  ModalDrawerDirection,
  ModalMode,
  ModalOpenChangeReason,
  ModalProps,
  ModalSnapPoint,
  UseModalResult,
} from "../types";

/** Everything the parts of one modal share. */
export interface ModalContextValue {
  open: boolean;
  /** Latest `open`, readable from event handlers and effect cleanups. */
  openRef: RefObject<boolean>;
  setOpen: (open: boolean, reason: ModalOpenChangeReason) => void;
  mode: ModalMode;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  /** The element focused before the modal opened. */
  previouslyFocusedRef: RefObject<HTMLElement | null>;
  /** Reason of the close the primitive is about to request (Escape, outside press). */
  reasonRef: RefObject<ModalOpenChangeReason | null>;
  /** Reports the end of the opening or closing animation (once per change). */
  reportComplete: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  closeOnSwipe: boolean;
  modal: boolean;
  drawer: {
    direction: ModalDrawerDirection;
    snapPoints?: ModalSnapPoint[];
    activeSnapPoint?: ModalSnapPoint | null;
    onActiveSnapPointChange?: (snapPoint: ModalSnapPoint | null) => void;
    onDrag?: ModalProps["onDrawerDrag"];
    onRelease?: ModalProps["onDrawerRelease"];
    handleOnly: boolean;
    scaleBackground: boolean;
    repositionInputs: boolean;
  };
}

export const ModalContext = createContext<ModalContextValue | null>(null);

/** What the sections inside one open panel share. */
export interface ModalPanelContextValue {
  mode: ModalMode;
  /** Registers a `ModalTitle`; returns the unregister function. */
  registerTitle: () => () => void;
  /** Registers a `ModalDescription`; returns the unregister function. */
  registerDescription: () => () => void;
}

export const ModalPanelContext = createContext<ModalPanelContextValue | null>(null);

/** The modal a part belongs to. Throws a developer error outside a `Modal`. */
export function useModalContext(partName: string): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) throw new Error(`${partName} must be used inside Modal.`);
  return context;
}

/** The open panel a section belongs to. Throws a developer error outside a `ModalContent`. */
export function useModalPanelContext(partName: string): ModalPanelContextValue {
  useModalContext(partName);
  const panel = useContext(ModalPanelContext);
  if (!panel) throw new Error(`${partName} must be used inside ModalContent.`);
  return panel;
}

/**
 * The state of the surrounding `Modal`: whether it is open, its presentation, and functions to
 * open or close it from any component inside it.
 */
export function useModal(): UseModalResult {
  const { open, mode, setOpen } = useModalContext("useModal");
  return {
    open,
    mode,
    setOpen: (next) => setOpen(next, next ? "trigger" : "close"),
    close: () => setOpen(false, "close"),
  };
}

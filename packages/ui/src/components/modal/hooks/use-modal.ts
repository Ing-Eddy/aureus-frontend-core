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
  /** Whether the modal is open. */
  open: boolean;
  /** Latest `open`, readable from event handlers and effect cleanups. */
  openRef: RefObject<boolean>;
  /** Requests a change: calls `onOpenChange` with the reason, unless nothing changes. */
  setOpen: (open: boolean, reason: ModalOpenChangeReason) => void;
  /** The current presentation. */
  mode: ModalMode;
  /** Element id of the panel, for the trigger's `aria-controls`. */
  contentId: string;
  /** The `ModalTrigger` element, which gets focus back on close. */
  triggerRef: RefObject<HTMLElement | null>;
  /** The element focused before the modal opened. */
  previouslyFocusedRef: RefObject<HTMLElement | null>;
  /** Reason of the close the primitive is about to request (Escape, outside press). */
  reasonRef: RefObject<ModalOpenChangeReason | null>;
  /** Reports the end of the opening or closing animation (once per change). */
  reportComplete: (open: boolean) => void;
  /** The `closeOnEscape` prop. */
  closeOnEscape: boolean;
  /** The `closeOnOutsidePress` prop. */
  closeOnOutsidePress: boolean;
  /** The `closeOnSwipe` prop. */
  closeOnSwipe: boolean;
  /** The `modal` prop. */
  modal: boolean;
  /** The `drawer*` props, used only in drawer mode. */
  drawer: {
    /** The edge the drawer is attached to. */
    direction: ModalDrawerDirection;
    /** Resting positions. */
    snapPoints?: ModalSnapPoint[];
    /** Controlled snap point. */
    activeSnapPoint?: ModalSnapPoint | null;
    /** Called when the snap point changes. */
    onActiveSnapPointChange?: (snapPoint: ModalSnapPoint | null) => void;
    /** Called while dragging. */
    onDrag?: ModalProps["onDrawerDrag"];
    /** Called when a drag ends. */
    onRelease?: ModalProps["onDrawerRelease"];
    /** Only the handle drags. */
    handleOnly: boolean;
    /** Scales the page behind. */
    scaleBackground: boolean;
    /** Keeps inputs above the on-screen keyboard. */
    repositionInputs: boolean;
  };
}

/** The context of one modal; `null` outside `Modal`. */
export const ModalContext = createContext<ModalContextValue | null>(null);

/** What the sections inside one open panel share. */
export interface ModalPanelContextValue {
  /** The presentation of this panel. */
  mode: ModalMode;
  /** Registers a `ModalTitle`; returns the unregister function. */
  registerTitle: () => () => void;
  /** Registers a `ModalDescription`; returns the unregister function. */
  registerDescription: () => () => void;
}

/**
 * The context of one open panel; `null` outside `ModalContent`. A nested modal reads it to know
 * that it is inside a drawer.
 */
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
 * The state of the surrounding `Modal`: whether it is open, its presentation, and functions to open
 * or close it from any component inside it. Throws outside a `Modal`.
 *
 * ```tsx
 * const { close } = useModal();
 *
 * const save = async (values: UserForm) => {
 *   await createUser(values);
 *   close();
 * };
 * ```
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

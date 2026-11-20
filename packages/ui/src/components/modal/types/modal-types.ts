import type { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, PointerEvent, ReactNode, RefObject } from "react";

/**
 * The modal's texts all come from the consumer: it renders no text of its own, visible or
 * accessible. `ModalTitle` names the dialog, and the optional close button needs `closeLabel`.
 */

/** How the panel is presented: a centred dialog or a drawer attached to a viewport edge. */
export type ModalMode = "dialog" | "drawer";

/** `"responsive"` picks the mode from the viewport width; the others force it. */
export type ModalModeSetting = "responsive" | ModalMode;

/** What asked the modal to open or close. */
export type ModalOpenChangeReason =
  /** `ModalTrigger` was activated, or `useModal().setOpen(true)` was called. */
  | "trigger"
  /** `ModalClose`, or `useModal().close()` / `setOpen()`. */
  | "close"
  /** The built-in close button of `ModalContent`. */
  | "close-button"
  /** The Escape key. */
  | "escape-key"
  /** A press (or, without `modal`, focus) outside the panel. */
  | "outside-press"
  /** Dragging the drawer closed. */
  | "swipe";

export interface ModalOpenChangeDetails {
  reason: ModalOpenChangeReason;
}

/** Width of the dialog. The drawer ignores it. */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/** The viewport edge the drawer is attached to. */
export type ModalDrawerDirection = "bottom" | "top" | "left" | "right";

/** A drawer resting position: a fraction of the viewport (`0.5`) or a CSS length (`"320px"`). */
export type ModalSnapPoint = number | string;

export interface ModalProps {
  children?: ReactNode;

  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with every requested change and its reason, in both modes. */
  onOpenChange?: (open: boolean, details: ModalOpenChangeDetails) => void;
  /** Called once after the opening or closing animation ends (at once without animations). */
  onOpenChangeComplete?: (open: boolean) => void;

  /** `"responsive"` (default) is a dialog from `breakpoint` up and a drawer below it. */
  mode?: ModalModeSetting;
  /** Viewport width, in CSS pixels, from which a responsive modal is a dialog. Defaults to `768`. */
  breakpoint?: number;
  /** Keeps the mode the modal opened with until it closes. Defaults to `false`. */
  lockModeWhileOpen?: boolean;
  /** Called when the presentation changes. */
  onModeChange?: (mode: ModalMode) => void;

  /** Escape closes the modal. Defaults to `true`. */
  closeOnEscape?: boolean;
  /** A press outside the panel closes the modal. Defaults to `true`. */
  closeOnOutsidePress?: boolean;
  /** Dragging the drawer closes it (drawer only). Defaults to `true`. */
  closeOnSwipe?: boolean;
  /**
   * With `true` (default) an overlay is shown, page scroll is locked and the content behind is
   * inert. With `false` the page stays interactive. The dismissal props are not affected.
   */
  modal?: boolean;

  /** Edge of the drawer. Defaults to `"bottom"`. Ignored by the dialog. */
  drawerDirection?: ModalDrawerDirection;
  /** Resting positions of the drawer. Ignored by the dialog. */
  drawerSnapPoints?: ModalSnapPoint[];
  /** Controlled active snap point. Omit it to let the drawer own it. */
  drawerActiveSnapPoint?: ModalSnapPoint | null;
  /** Called when the drawer moves to another snap point. */
  onDrawerActiveSnapPointChange?: (snapPoint: ModalSnapPoint | null) => void;
  /** Called while the drawer is dragged. */
  onDrawerDrag?: (event: PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  /** Called when a drag ends, with whether the drawer stays open. */
  onDrawerRelease?: (event: PointerEvent<HTMLDivElement>, open: boolean) => void;
  /** The drawer can only be dragged from its handle. Defaults to `false`. */
  drawerHandleOnly?: boolean;
  /** Scales the page behind the drawer down (needs `[data-vaul-drawer-wrapper]`). Defaults to `false`. */
  drawerScaleBackground?: boolean;
  /** Moves the drawer above the on-screen keyboard while an input has focus. Defaults to `true`. */
  drawerRepositionInputs?: boolean;
}

type ContentEvents = Pick<
  DialogPrimitive.DialogContentProps,
  "onOpenAutoFocus" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onInteractOutside"
>;

/** The built-in close button and its accessible name, which is required with it. */
export type ModalCloseButtonTexts =
  | {
      /** Shows a close button in the panel's top inline-end corner. */
      closeButton?: false;
      /** Only allowed together with `closeButton`. */
      closeLabel?: never;
    }
  | {
      /** Shows a close button in the panel's top inline-end corner. */
      closeButton: boolean;
      /** Accessible name of the close button, in the developer's language. Required with `closeButton`. */
      closeLabel: string;
    };

export interface ModalContentBaseProps
  extends Omit<ComponentProps<"div">, keyof ContentEvents | "title">,
    ContentEvents {
  /** Width of the dialog. Defaults to `"sm"`. The drawer ignores it. */
  size?: ModalSize;
  /** Decorative grab handle on top and bottom drawers. Defaults to `true`. */
  drawerHandle?: boolean;
  /** Element focused when the modal opens, instead of the first focusable one. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Element focused when the modal closes, instead of the trigger. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Where the panel is portalled. Defaults to `document.body`. */
  container?: HTMLElement | null;
  /** Classes for the overlay. */
  overlayClassName?: string;
  /** Classes for the built-in close button. */
  closeButtonClassName?: string;
  /** Classes for the drawer handle. */
  handleClassName?: string;
}

export type ModalContentProps = ModalContentBaseProps & ModalCloseButtonTexts;

export interface ModalTriggerProps extends ComponentProps<"button"> {
  /** Renders the only child instead of a `button`, merging the props. Defaults to `false`. */
  asChild?: boolean;
}

export interface ModalCloseProps extends ComponentProps<"button"> {
  /** Renders the only child instead of a `button`, merging the props. Defaults to `false`. */
  asChild?: boolean;
}

export interface ModalSectionProps extends ComponentProps<"div"> {
  /** Renders the only child instead of a `div`, merging the props. Defaults to `false`. */
  asChild?: boolean;
}

export interface ModalTitleProps extends ComponentProps<"h2"> {
  /** Renders the only child instead of an `h2`, merging the props. Defaults to `false`. */
  asChild?: boolean;
  /** Hides the title from view; it still names the dialog. Defaults to `false`. */
  visuallyHidden?: boolean;
}

export interface ModalDescriptionProps extends ComponentProps<"p"> {
  /** Renders the only child instead of a `p`, merging the props. Defaults to `false`. */
  asChild?: boolean;
  /** Hides the description from view; it still describes the dialog. Defaults to `false`. */
  visuallyHidden?: boolean;
}

/** What `useModal()` returns inside a `Modal`. */
export interface UseModalResult {
  open: boolean;
  /** The current presentation. */
  mode: ModalMode;
  /** Requests a change. `onOpenChange` receives `"trigger"` when opening and `"close"` when closing. */
  setOpen: (open: boolean) => void;
  /** Requests closing, with the reason `"close"`. */
  close: () => void;
}

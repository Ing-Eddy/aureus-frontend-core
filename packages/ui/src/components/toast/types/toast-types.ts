import type { ComponentProps, ReactNode } from "react";
import type { Button } from "@/shadcn/ui/button";

/** What a toast reports. It decides the icon and the colors, and is set as `data-type`. */
export type ToastStatus = "neutral" | "success" | "info" | "warning" | "danger" | "loading";

/** How a toast paints its status: a neutral card, or a background tinted with the status color. */
export type ToastAppearance = "card" | "tinted";

/** How urgently screen readers announce a toast. `"high"` interrupts what they are reading. */
export type ToastPriority = "low" | "high";

/** What the handlers and render functions of a toast receive to act on their own toast. */
export interface ToastContext {
  /** Id of the toast, accepted by every method of `toast`. */
  id: string;
  /** Closes the toast. */
  dismiss: () => void;
  /** Merges a patch into the toast, as `toast.update` does. */
  update: (patch: ToastUpdate) => void;
}

/** One button of a toast. */
export interface ToastAction {
  /** Content of the button, in the developer's language. */
  label: ReactNode;
  /** Called when the button is pressed. No default. */
  onClick?: (context: ToastContext) => void;
  /** Look of the button, as in `Button`. Defaults to "outline". */
  variant?: ComponentProps<typeof Button>["variant"];
  /** Disables the button. Defaults to false. */
  disabled?: boolean;
  /**
   * Keeps the toast open after the press. Defaults to false: the toast closes. A handler that
   * updates or replaces its own toast needs it.
   */
  keepOpen?: boolean;
}

/** How the description of one toast expands. */
export interface ToastExpandOptions {
  /** Lines shown while collapsed. Defaults to the Toaster's `expandable.lines`, or 2. */
  lines?: number;
  /** Whether the toast starts expanded. Defaults to false. */
  defaultExpanded?: boolean;
  /**
   * Text of the button that expands. Defaults to the Toaster's. Without both texts the description
   * is shown in full, with a development warning.
   */
  expandLabel?: string;
  /** Text of the button that collapses. Defaults to the Toaster's. */
  collapseLabel?: string;
}

/** Options every kind of toast accepts. */
export interface ToastBaseOptions {
  /**
   * Identifies the toast. Showing a toast with the id of an open one replaces it. Generated when
   * omitted.
   */
  id?: string;
  /**
   * Milliseconds before the toast closes by itself, or `Infinity` to keep it open. Defaults to the
   * Toaster's `duration`; `toast.custom` defaults to `Infinity`. The timer pauses while the pointer
   * or the keyboard focus is on the toasts and while the window is not focused.
   */
  duration?: number;
  /** Defaults to the Toaster's `appearance`. */
  appearance?: ToastAppearance;
  /** Extra classes of the toast. No default. */
  className?: string;
  /** Called when the toast starts closing. No default. */
  onClose?: () => void;
  /** Called when the toast leaves the page, after its closing animation. No default. */
  onRemove?: () => void;
}

/** Options of a toast with the standard layout: icon, title and description. */
export interface ToastOptions extends ToastBaseOptions {
  /** Text under the title. No default. */
  description?: ReactNode;
  /** Replaces the status icon; `false` hides it. Defaults to the icon of the status. */
  icon?: ReactNode | false;
  /**
   * Names the status for screen readers only (for example "Error"), because the icon and the color
   * say nothing to them. No default.
   */
  iconLabel?: string;
  /** Defaults to "low", for every status. */
  priority?: ToastPriority;
  /**
   * Makes the notification clickable: the title becomes a button and a pointer press anywhere on
   * the card calls it, except on controls, selected text and drags. No default.
   */
  onClick?: (context: ToastContext) => void;
  /** Keeps the toast open after `onClick`. Defaults to false: the toast closes. */
  keepOpenOnClick?: boolean;
  /** Buttons under the description. No default. */
  actions?: ToastAction[];
  /**
   * Your own content under the description, such as a short form. A function receives the toast's
   * context; return a component from it instead of calling hooks in it. Dragging this content never
   * swipes the toast away. It renders where the `Toaster` is, with that place's React context.
   */
  content?: ReactNode | ToastContentRender;
  /**
   * Clamps a long description behind an expand button, or `false` to show it in full. Defaults to
   * the Toaster's `expandable`.
   */
  expandable?: false | ToastExpandOptions;
  /** Shows or hides the close button. Defaults to the Toaster's `closeButton`. */
  closeButton?: boolean;
  /**
   * Accessible name of the close button. Defaults to the Toaster's `closeLabel`. Without one, no
   * button is rendered and a development warning is logged.
   */
  closeLabel?: string;
}

/** Renders content for a toast from its context. */
export type ToastContentRender = (context: ToastContext) => ReactNode;

/** What `toast.update` merges into a toast. Keys that are present replace, also with `undefined`. */
export interface ToastUpdate extends Omit<ToastOptions, "id"> {
  /** New title. On a custom toast it switches to the standard layout. */
  title?: ReactNode;
  /** New status. On a custom toast it switches to the standard layout. */
  status?: ToastStatus;
}

/** Options of `toast.custom`, whose layout is entirely yours. */
export interface ToastCustomOptions extends ToastBaseOptions {
  /** Accessible name of the toast, in the developer's language. */
  "aria-label": string;
}

/** What one state of `toast.promise` shows, when it needs more than a title. */
export interface ToastPromiseContent extends Omit<ToastOptions, "id"> {
  /** Title of this state. */
  title: ReactNode;
}

/** The three states of `toast.promise`: a title, or a title with options. */
export interface ToastPromiseOptions<Value> {
  /** Shown while the promise is pending, as a `loading` toast. */
  loading: ReactNode | ToastPromiseContent;
  /** Shown when it resolves, as a `success` toast. */
  success: ReactNode | ToastPromiseContent | ((value: Value) => ReactNode | ToastPromiseContent);
  /** Shown when it rejects, as a `danger` toast. */
  danger: ReactNode | ToastPromiseContent | ((error: unknown) => ReactNode | ToastPromiseContent);
}

/** A status method of `toast`, such as `toast.success`. Returns the id of the toast. */
export type ToastStatusMethod = (title: ReactNode, options?: ToastOptions) => string;

/** The imperative API: callable from anywhere, also outside React. */
export interface ToastApi {
  /** A toast with no status and no icon. */
  neutral: ToastStatusMethod;
  /** Something finished well. */
  success: ToastStatusMethod;
  /** Information that needs no action. */
  info: ToastStatusMethod;
  /** Something that deserves attention. */
  warning: ToastStatusMethod;
  /** Something failed. */
  danger: ToastStatusMethod;
  /** Work in progress. It never closes by itself; update or replace it. */
  loading: ToastStatusMethod;
  /** A toast whose whole layout comes from `render`. Persistent unless it sets a `duration`. */
  custom: (render: ToastContentRender, options: ToastCustomOptions) => string;
  /**
   * Shows a loading toast and turns it into the success or danger one. Returns the toast's id; keep
   * your own reference to the promise to await it. A rejection is handled, never rethrown.
   */
  promise: <Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) => string;
  /** Merges a patch into an open toast. Ignored when no toast has that id. */
  update: (id: string, patch: ToastUpdate) => void;
  /** Closes one toast, or all of them without an id. */
  dismiss: (id?: string) => void;
}

/** Where the toasts stack. `start` and `end` follow the text direction. */
export type ToastPosition =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

/** Turns on expandable descriptions for every toast of a Toaster. */
export interface ToasterExpandOptions {
  /** Text of the button that expands a long description, in the developer's language. */
  expandLabel: string;
  /** Text of the button that collapses it. */
  collapseLabel: string;
  /** Lines shown while collapsed. Defaults to 2. */
  lines?: number;
}

/** The close button of every toast. Turning it on requires its accessible name. */
export type ToasterCloseTexts =
  | {
      /** Shows a close button on every toast. Defaults to false. */
      closeButton: boolean;
      /** Accessible name of the close buttons, in the developer's language. */
      closeLabel: string;
    }
  | {
      /** Shows a close button on every toast. Defaults to false. */
      closeButton?: false;
      /** Accessible name for the toasts that turn their own close button on. */
      closeLabel?: string;
    };

/** Props of `Toaster`, besides the close button's. */
export interface ToasterBaseProps {
  /** Accessible name of the notifications region, in the developer's language. */
  label: string;
  /** Where the toasts stack. Defaults to "bottom-end". */
  position?: ToastPosition;
  /** Milliseconds a toast stays, or `Infinity`. Defaults to 5000. */
  duration?: number;
  /** Toasts shown at once; older ones wait hidden. Defaults to 3. */
  limit?: number;
  /** How toasts paint their status. Defaults to "card". */
  appearance?: ToastAppearance;
  /** Clamps long descriptions behind an expand button. Off by default. */
  expandable?: ToasterExpandOptions;
  /** Replaces the icon of some statuses. `neutral` has none unless given here. */
  icons?: Partial<Record<ToastStatus, ReactNode>>;
  /** Extra classes of the notifications region. No default. */
  className?: string;
}

/** Props of `Toaster`. */
export type ToasterProps = ToasterBaseProps & ToasterCloseTexts;

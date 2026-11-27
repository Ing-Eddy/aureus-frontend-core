import type { ToastContentRender, ToastOptions } from "./toast-types";

/**
 * What a toast carries in Base UI's `data`: every option the engine does not know. `duration` is
 * kept besides the engine's timeout so an expanded toast can restore it.
 */
export interface ToastData
  extends Omit<ToastOptions, "id" | "description" | "priority" | "onClose" | "onRemove"> {
  /** The layout of a custom toast; its presence is what makes a toast custom. */
  render?: ToastContentRender;
  /** Accessible name of a custom toast. */
  ariaLabel?: string;
}

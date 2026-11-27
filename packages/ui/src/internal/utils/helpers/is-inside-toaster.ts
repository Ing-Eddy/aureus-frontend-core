/**
 * Whether an event target is in the notifications region of `Toaster`. Overlays use it so a press
 * on a toast, which floats above them, does not count as a press outside them.
 */
export function isInsideToaster(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-slot="toast-viewport"]') !== null;
}

import type { KeyboardEvent } from "react";

export interface NumberKeyboardActions {
  step: (direction: "increment" | "decrement", large: boolean) => void;
  toMin?: () => void;
  toMax?: () => void;
  /** Commits the text; returns whether the text changed. */
  commit: () => boolean;
  /** Restores the last committed text; returns whether anything changed. */
  revert: () => boolean;
  /** Deletes the digit next to a group separator; returns whether it handled the key. */
  deleteAcrossSeparator: (key: "Backspace" | "Delete") => boolean;
}

/** Keydown handler of the spinbutton (WAI-ARIA spinbutton pattern plus commit and revert). */
export function handleNumberKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
  actions: NumberKeyboardActions,
) {
  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
      event.preventDefault();
      actions.step(event.key === "ArrowUp" ? "increment" : "decrement", event.shiftKey);
      return;
    case "PageUp":
    case "PageDown":
      event.preventDefault();
      actions.step(event.key === "PageUp" ? "increment" : "decrement", true);
      return;
    case "Home":
      if (actions.toMin) {
        event.preventDefault();
        actions.toMin();
      }
      return;
    case "End":
      if (actions.toMax) {
        event.preventDefault();
        actions.toMax();
      }
      return;
    case "Enter":
      // Only swallow Enter when it changed the text; otherwise the form submits as usual.
      if (actions.commit()) event.preventDefault();
      return;
    case "Escape":
      if (actions.revert()) event.preventDefault();
      return;
    case "Backspace":
    case "Delete":
      if (actions.deleteAcrossSeparator(event.key)) event.preventDefault();
      return;
  }
}

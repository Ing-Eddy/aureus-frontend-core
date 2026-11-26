import { type KeyboardEvent, type RefObject, useCallback } from "react";

/** Options of `useActionShortcut`. */
export interface UseActionShortcutOptions {
  /** Whether the shortcut is on and there is an action to press. */
  enabled: boolean;
  /** The action button the shortcut presses. */
  actionRef: RefObject<HTMLButtonElement | null>;
}

/** Value for the action's `aria-keyshortcuts`. */
export const actionShortcutKeys = "Control+Enter Meta+Enter";

/**
 * Keydown handler for a textarea: Ctrl+Enter / Cmd+Enter presses the action like a click (so a
 * disabled action is never pressed). Enter alone keeps inserting a new line.
 */
export function useActionShortcut({ enabled, actionRef }: UseActionShortcutOptions) {
  return useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!enabled || event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      const action = actionRef.current;
      if (action && !action.disabled) action.click();
    },
    [enabled, actionRef],
  );
}

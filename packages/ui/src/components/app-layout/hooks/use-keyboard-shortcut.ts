import { useEffect, useRef } from "react";

/** Selector of the fields in which a shortcut must not act. */
const EDITABLE = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

/** Whether a key event comes from inside an editable field. */
function isEditable(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(EDITABLE) !== null;
}

/**
 * Calls `onPress` when Ctrl or Cmd plus `key` is pressed anywhere in the page, except while focus
 * is in an editable field, and prevents the browser's default. `key` is compared without case, and
 * Shift and Alt are not checked. Without `key`, no listener is added.
 */
export function useKeyboardShortcut(key: string | undefined, onPress: () => void) {
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;
  useEffect(() => {
    if (!key) return;
    const wanted = key.toLowerCase();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== wanted) return;
      if (isEditable(event.target)) return;
      event.preventDefault();
      onPressRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key]);
}

import { useEffect, useRef } from "react";

const EDITABLE = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

function isEditable(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(EDITABLE) !== null;
}

/**
 * Calls `onPress` when Ctrl or Cmd plus `key` is pressed anywhere in the page, except while
 * focus is in an editable field. Without `key`, no listener is added.
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

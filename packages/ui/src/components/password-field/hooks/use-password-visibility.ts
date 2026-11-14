import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useControllableState } from "@/internal/hooks";

export interface UsePasswordVisibilityOptions {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** The password input. */
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * Show/hide state of a password input:
 * - controlled or uncontrolled visibility;
 * - hides the password again when the surrounding form is submitted;
 * - keeps focus and the caret in the input when the toggle is pressed with a pointer.
 */
export function usePasswordVisibility({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  inputRef,
}: UsePasswordVisibilityOptions) {
  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible,
    onChange: onVisibleChange,
  });
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  // Re-hide on submit. The DOM type is switched synchronously, because password managers read
  // the form during the submit event, before React re-renders. Re-attached after every commit,
  // so it follows the input if it moves to another form.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const hideOnSubmit = () => {
      const input = inputRef.current;
      if (input) input.type = "password";
      if (visibleRef.current) setVisible(false);
    };
    form.addEventListener("submit", hideOnSubmit);
    return () => form.removeEventListener("submit", hideOnSubmit);
  });

  const savedSelection = useRef<[number | null, number | null] | null>(null);

  /** Wire to the toggle's `onPointerDown`: the toggle never takes focus from the input. */
  const keepCaretOnPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const input = inputRef.current;
      savedSelection.current =
        input && input.ownerDocument.activeElement === input
          ? [input.selectionStart, input.selectionEnd]
          : null;
    },
    [inputRef],
  );

  // Some browsers reset the selection when `type` changes; put the caret back.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the visibility changes.
  useLayoutEffect(() => {
    const input = inputRef.current;
    const selection = savedSelection.current;
    savedSelection.current = null;
    if (!input || !selection || input.ownerDocument.activeElement !== input) return;
    input.setSelectionRange(selection[0], selection[1]);
  }, [visible, inputRef]);

  const toggle = useCallback(() => setVisible(!visibleRef.current), [setVisible]);

  return { visible, toggle, keepCaretOnPointerDown };
}

import { type MouseEvent, type PointerEvent, useCallback, useEffect, useRef } from "react";

/** Options of `usePressAndHold`. */
export interface UsePressAndHoldOptions {
  /** Called once on press, then repeatedly while the button is held. */
  onStep: () => void;
  /** Ignores presses and stops a running repetition. */
  disabled?: boolean;
  /** Delay before repeating starts, in ms. */
  delay?: number;
  /** Interval between repeated steps, in ms. */
  interval?: number;
}

/**
 * Pointer handlers for a step button: one step on press, then repeated steps while held. The
 * button never takes focus from the input. A click without a pointer (screen-reader activation)
 * steps once.
 */
export function usePressAndHold({
  onStep,
  disabled,
  delay = 400,
  interval = 60,
}: UsePressAndHoldOptions) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;
  const timers = useRef<{
    timeout?: ReturnType<typeof setTimeout>;
    repeat?: ReturnType<typeof setInterval>;
  }>({});

  const stop = useCallback(() => {
    clearTimeout(timers.current.timeout);
    clearInterval(timers.current.repeat);
    timers.current = {};
  }, []);

  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);
  useEffect(() => stop, [stop]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      // Keep focus (and the caret) in the input.
      event.preventDefault();
      if (disabled || event.button !== 0) return;
      stop();
      onStepRef.current();
      timers.current.timeout = setTimeout(() => {
        timers.current.repeat = setInterval(() => onStepRef.current(), interval);
      }, delay);
    },
    [disabled, delay, interval, stop],
  );

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      // `detail === 0`: activated without a pointer (assistive technology); pointer presses
      // already stepped on pointerdown.
      if (event.detail === 0 && !disabled) onStepRef.current();
    },
    [disabled],
  );

  return {
    onPointerDown,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onClick,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSwitchChangeOptions<V> {
  /** Guard called with the value the switch would change to. */
  onBeforeChange?: (next: V) => boolean | Promise<boolean>;
  /** Applies a confirmed change. */
  commit: (checked: boolean) => void;
  /** Maps the requested checked state to the value the guard receives. */
  toValue: (checked: boolean) => V;
}

const isThenable = (value: unknown): value is PromiseLike<boolean> =>
  typeof (value as PromiseLike<boolean> | null)?.then === "function";

/**
 * The switch's change flow: immediate without a guard; with one, the change is applied only once it
 * confirms. While a returned promise is pending, `pending` is true and further requests are ignored.
 */
export function useSwitchChange<V>({ onBeforeChange, commit, toValue }: UseSwitchChangeOptions<V>) {
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const request = useCallback(
    (checked: boolean) => {
      if (pendingRef.current) return;
      if (!onBeforeChange) {
        commit(checked);
        return;
      }
      let result: boolean | PromiseLike<boolean>;
      try {
        result = onBeforeChange(toValue(checked));
      } catch {
        return;
      }
      if (!isThenable(result)) {
        if (result === true) commit(checked);
        return;
      }
      pendingRef.current = true;
      setPending(true);
      const settle = (ok: boolean) => {
        pendingRef.current = false;
        if (!mounted.current) return;
        setPending(false);
        if (ok) commit(checked);
      };
      result.then(
        (ok) => settle(ok === true),
        () => settle(false),
      );
    },
    [onBeforeChange, commit, toValue],
  );

  return { pending, request };
}

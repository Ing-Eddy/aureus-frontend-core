import { useCallback, useSyncExternalStore } from "react";

const hasMatchMedia = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * Whether a CSS media query matches, kept up to date as the viewport or device changes. On the
 * server, and where `matchMedia` is missing (such as jsdom), it returns `serverValue`.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!hasMatchMedia()) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = () => (hasMatchMedia() ? window.matchMedia(query).matches : serverValue);
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}

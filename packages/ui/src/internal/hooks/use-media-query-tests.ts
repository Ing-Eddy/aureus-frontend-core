import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

/** A `matchMedia` whose result can change, with its listeners. */
function stubMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  const removed = vi.fn();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      get matches() {
        return matches;
      },
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => {
        listeners.delete(listener);
        removed();
      },
    })),
  );
  return {
    set(next: boolean) {
      matches = next;
      for (const listener of listeners) listener();
    },
    listeners,
    removed,
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("useMediaQuery", () => {
  it("returns the current match", () => {
    stubMatchMedia(true);
    expect(renderHook(() => useMediaQuery("(min-width: 768px)", false)).result.current).toBe(true);
  });

  it("updates on a change event", () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)", true));
    expect(result.current).toBe(false);

    act(() => media.set(true));

    expect(result.current).toBe(true);
  });

  it("unsubscribes on unmount", () => {
    const media = stubMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)", false));
    expect(media.listeners.size).toBe(1);

    unmount();

    expect(media.listeners.size).toBe(0);
    expect(media.removed).toHaveBeenCalled();
  });

  it("returns serverValue without matchMedia", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(renderHook(() => useMediaQuery("(min-width: 768px)", true)).result.current).toBe(true);
    expect(renderHook(() => useMediaQuery("(min-width: 768px)", false)).result.current).toBe(false);
  });
});

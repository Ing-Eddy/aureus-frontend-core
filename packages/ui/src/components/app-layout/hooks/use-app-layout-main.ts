import { useCallback } from "react";
import type { UseAppLayoutMainResult } from "../types";
import { useAppLayoutContext } from "./use-app-layout-context";

/** Scrolls an element to the top at once. */
export function scrollElementToTop(element: HTMLElement | null) {
  if (element) element.scrollTop = 0;
}

/** The main area of the surrounding `AppLayout`: its scrolling element and `scrollToTop`. */
export function useAppLayoutMain(): UseAppLayoutMainResult {
  const { mainRef } = useAppLayoutContext("useAppLayoutMain");
  const scrollToTop = useCallback(() => scrollElementToTop(mainRef.current), [mainRef]);
  return { scrollRef: mainRef, scrollToTop };
}

import { useSyncExternalStore } from "react";

export type StepperLayout = "stacked" | "split";

const coarseQuery = "(pointer: coarse)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const media = window.matchMedia(coarseQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const isCoarse = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(coarseQuery).matches;

/**
 * The layout to render. `stacked` arrows are too small for touch (WCAG 2.5.8), so on a coarse
 * pointer they become `split`. Without `matchMedia`, the pointer is assumed to be fine.
 */
export function useStepperLayout(layout: StepperLayout): StepperLayout {
  const coarse = useSyncExternalStore(subscribe, isCoarse, () => false);
  return layout === "split" || coarse ? "split" : "stacked";
}

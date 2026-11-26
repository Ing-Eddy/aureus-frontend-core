import { useMediaQuery } from "@/internal/hooks";

/** Where the step buttons go: stacked at the end, or one at each side. */
export type StepperLayout = "stacked" | "split";

/**
 * The layout to render. `stacked` arrows are too small for touch (WCAG 2.5.8), so on a coarse
 * pointer they become `split`. Without `matchMedia`, the pointer is assumed to be fine.
 */
export function useStepperLayout(layout: StepperLayout): StepperLayout {
  const coarse = useMediaQuery("(pointer: coarse)", false);
  return layout === "split" || coarse ? "split" : "stacked";
}

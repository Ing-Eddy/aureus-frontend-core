import { fireEvent, type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** A thumb, found by its accessible name (or the only one). */
export const thumb = (name?: string | RegExp): HTMLElement =>
  name === undefined ? screen.getByRole("slider") : screen.getByRole("slider", { name });

/** Presses a key on a thumb. */
export function press(element: HTMLElement, key: string, init: { shiftKey?: boolean } = {}) {
  fireEvent.keyDown(element, { key, ...init });
}

/** The current value of a thumb. */
export const thumbValue = (element: HTMLElement) => Number(element.getAttribute("aria-valuenow"));

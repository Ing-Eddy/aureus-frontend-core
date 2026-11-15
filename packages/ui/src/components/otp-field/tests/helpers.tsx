import { type RenderResult, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** The real input, found by its accessible name. */
export const input = (name: string | RegExp): HTMLInputElement =>
  screen.getByRole("textbox", { name }) as HTMLInputElement;

/** Characters shown in the boxes, in order ("" for an empty box). */
export const slotTexts = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot=input-otp-slot]")].map(
    (slot) => slot.textContent ?? "",
  );

/** Focuses the input and types. */
export async function typeInto(element: HTMLElement, text: string) {
  await userEvent.click(element);
  await userEvent.keyboard(text);
}

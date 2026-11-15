import { type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** The box, found by its accessible name. */
export const box = (name: string | RegExp): HTMLElement => screen.getByRole("checkbox", { name });

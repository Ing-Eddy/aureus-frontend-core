import { type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const plans = [
  { value: "free", label: "Free", description: "Up to 3 projects" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise", disabled: true },
  { value: "team", label: "Team" },
];

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** A radio, found by its accessible name. */
export const radio = (name: string | RegExp): HTMLElement => screen.getByRole("radio", { name });

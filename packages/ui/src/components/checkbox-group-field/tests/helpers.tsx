import { type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const channels = [
  { value: "email", label: "Email", description: "Daily digest" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push", disabled: true },
  { value: "slack", label: "Slack" },
];

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** A box, found by its accessible name. */
export const box = (name: string | RegExp): HTMLElement => screen.getByRole("checkbox", { name });

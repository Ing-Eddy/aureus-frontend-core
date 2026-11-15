import { type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** The switch, found by its accessible name. */
export const toggle = (name: string | RegExp): HTMLElement => screen.getByRole("switch", { name });

/** A promise whose settlement the test controls. */
export function deferred() {
  let resolve!: (value: boolean) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

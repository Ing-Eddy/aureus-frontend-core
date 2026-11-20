import { type RenderResult, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** The calendar texts every date field with a calendar requires, in Spanish. */
export const calendarTexts = {
  openCalendarLabel: "Abrir calendario",
  previousMonthLabel: "Mes anterior",
  nextMonthLabel: "Mes siguiente",
} as const;

/** Renders inside the providers every field needs. */
export function renderField(ui: ReactElement): RenderResult {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

/** A segment, by its accessible name ("día", "mes", "año", "hora"…). */
export const segment = (name: string): HTMLElement => screen.getByRole("spinbutton", { name });

/** The text of every segment, in order. */
export const segmentTexts = () => screen.getAllByRole("spinbutton").map((item) => item.textContent);

/** A day button of the open calendar, by its full date in `locale`. */
export const calendarDay = (year: number, month: number, day: number, locale = "es-ES") =>
  screen.getByRole("button", {
    name: new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
      new Date(year, month - 1, day),
    ),
  });

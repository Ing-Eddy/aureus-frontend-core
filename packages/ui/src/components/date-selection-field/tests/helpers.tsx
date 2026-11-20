import { screen } from "@testing-library/react";
import type userEvent from "@testing-library/user-event";

export { calendarDay, renderField } from "@/components/date-time-field/tests/helpers";

/** The texts every selection requires, in Spanish. */
export const monthTexts = {
  previousMonthLabel: "Mes anterior",
  nextMonthLabel: "Mes siguiente",
} as const;
/** The extra texts of a range. */
export const rangeTexts = {
  ...monthTexts,
  openCalendarLabel: "Abrir calendario",
  startLabel: "Llegada",
  endLabel: "Salida",
} as const;

/** The segments of a named group ("Llegada", "Salida"). */
export const segmentsOf = (group: string) =>
  [
    ...screen.getByRole("group", { name: group }).querySelectorAll("[role=spinbutton]"),
  ] as HTMLElement[];

/** The texts of a named group's segments. */
export const textsOf = (group: string) => segmentsOf(group).map((item) => item.textContent);

export const openRange = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Abrir calendario" }));

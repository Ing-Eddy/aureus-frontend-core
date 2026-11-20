import { userEvent } from "storybook/test";

/** The calendar texts in English: the stories' default language. */
export const calendarTexts = {
  openCalendarLabel: "Open calendar",
  previousMonthLabel: "Previous month",
  nextMonthLabel: "Next month",
} as const;

/** The calendar texts in Spanish, for the `es-ES` examples. */
export const calendarTextsEs = {
  openCalendarLabel: "Abrir calendario",
  previousMonthLabel: "Mes anterior",
  nextMonthLabel: "Mes siguiente",
} as const;

/** The month buttons only: several days open the calendar from their summary button. */
export const monthTexts = {
  previousMonthLabel: calendarTexts.previousMonthLabel,
  nextMonthLabel: calendarTexts.nextMonthLabel,
} as const;

/** The texts of a range in English. */
export const rangeTexts = {
  ...calendarTexts,
  startLabel: "Check-in",
  endLabel: "Check-out",
} as const;

/** A month every story opens at, so the examples do not depend on today's date. */
export const august = "2026-08-01";

/** The segments of a named group, in order. */
export const segmentsOf = (root: HTMLElement, group: string) =>
  [
    ...(root
      .querySelector(`[role=group][aria-label="${group}"]`)
      ?.querySelectorAll("[role=spinbutton]") ?? []),
  ] as HTMLElement[];

/** The text of every segment inside `root`, in order. */
export const segmentTexts = (root: Element) =>
  [...root.querySelectorAll("[role=spinbutton]")].map((segment) => segment.textContent);

/** Focuses a segment and types into it with real key events (focus moves on as segments fill). */
export async function typeInto(segment: HTMLElement, text: string) {
  segment.focus();
  await userEvent.keyboard(text);
}

/**
 * Types into a segment as a phone keyboard does: `beforeinput` with the text and no key value.
 * Returns whether the field cancelled the browser's own edit.
 */
export function typeLikeAPhone(segment: HTMLElement, text: string) {
  segment.focus();
  const event = new InputEvent("beforeinput", {
    data: text,
    inputType: "insertText",
    bubbles: true,
    cancelable: true,
  });
  segment.dispatchEvent(event);
  return event.defaultPrevented;
}

/** The name `Intl` gives a day button: its full date in `locale`. */
export const dayName = (iso: string, locale = "en-US") => {
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
    new Date(year, month - 1, day),
  );
};

import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FieldCalendar, type FieldCalendarProps } from "./field-calendar";

const texts = { previousMonthLabel: "Mes anterior", nextMonthLabel: "Mes siguiente" };

function renderCalendar(props: Partial<FieldCalendarProps> = {}) {
  const onDayClick = vi.fn();
  const view = render(
    <FieldCalendar
      mode="single"
      selected={null}
      locale="es-ES"
      onDayClick={onDayClick}
      {...texts}
      {...(props as object)}
    />,
  );
  return { ...view, onDayClick };
}

const dayButton = (day: number, month = 7, year = 2026, locale = "es-ES") =>
  screen.getByRole("button", {
    name: new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(new Date(year, month, day)),
  });

/** The weekday headers (hidden from the accessibility tree; each day button names its date). */
const weekdays = () => [...document.querySelectorAll("th[aria-label]")];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 7, 10, 12));
});
afterEach(() => {
  vi.useRealTimers();
});

describe("FieldCalendar texts", () => {
  it("speaks Spanish from Intl and starts the week on Monday", () => {
    renderCalendar();
    expect(screen.getByText("agosto de 2026")).toBeTruthy();
    const headers = weekdays();
    expect(headers[0]?.getAttribute("aria-label")).toBe("lunes");
    expect(dayButton(1)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeTruthy();
  });

  it("never shows or announces English words", () => {
    const { container } = renderCalendar({ selected: "2026-08-10" });
    const words = /Today|selected|Go to|Monday|August|Navigation/;
    const texts = [container.textContent ?? ""];
    for (const element of container.querySelectorAll("[aria-label]")) {
      texts.push(element.getAttribute("aria-label") ?? "");
    }
    for (const text of texts) expect(text).not.toMatch(words);
  });

  it("marks today and the chosen day by state, not words", () => {
    renderCalendar({ selected: "2026-08-12" });
    expect(dayButton(10).getAttribute("aria-current")).toBe("date");
    expect(dayButton(11).hasAttribute("aria-current")).toBe(false);
    expect(dayButton(12).closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
  });

  it("follows weekStartsOn and the locale", () => {
    renderCalendar({ weekStartsOn: 0 });
    expect(weekdays()[0]?.getAttribute("aria-label")).toBe("domingo");
    renderCalendar({ locale: "en-US" }).unmount();
  });

  it("starts the week on Sunday in en-US", () => {
    renderCalendar({ locale: "en-US" });
    expect(weekdays()[0]?.getAttribute("aria-label")).toBe("Sunday");
  });
});

describe("FieldCalendar limits", () => {
  it("disables days outside the limits, listed or matched", () => {
    const { onDayClick } = renderCalendar({
      min: "2026-08-05",
      max: "2026-08-25",
      disabledDates: ["2026-08-12"],
      isDateDisabled: (date) => new Date(`${date}T12:00`).getDay() === 0,
    });
    expect((dayButton(4) as HTMLButtonElement).disabled).toBe(true);
    expect((dayButton(26) as HTMLButtonElement).disabled).toBe(true);
    expect((dayButton(12) as HTMLButtonElement).disabled).toBe(true);
    expect((dayButton(16) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(dayButton(12));
    expect(onDayClick).not.toHaveBeenCalled();
    fireEvent.click(dayButton(13));
    expect(onDayClick).toHaveBeenCalledWith("2026-08-13");
  });

  it("does not navigate to months outside the limits", () => {
    renderCalendar({ min: "2026-08-01", max: "2026-08-31" });
    expect(screen.getByRole("button", { name: "Mes anterior" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Mes siguiente" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("opens at the chosen month, otherwise today moved into the limits", () => {
    const { unmount } = renderCalendar({ selected: "2027-03-04" });
    expect(screen.getByText("marzo de 2027")).toBeTruthy();
    unmount();
    renderCalendar({ min: "2026-11-01" });
    expect(screen.getByText("noviembre de 2026")).toBeTruthy();
  });
});

describe("FieldCalendar selections", () => {
  it("shows a range and several days as selected", () => {
    const { unmount } = renderCalendar({
      mode: "range",
      selected: { from: "2026-08-03", to: "2026-08-05" },
    } as Partial<FieldCalendarProps>);
    for (const day of [3, 4, 5]) {
      expect(dayButton(day).closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
    }
    expect(screen.getByRole("grid").getAttribute("aria-multiselectable")).toBe("true");
    unmount();
    renderCalendar({
      mode: "multiple",
      selected: ["2026-08-01", "2026-08-09"],
    } as Partial<FieldCalendarProps>);
    const grid = screen.getByRole("grid");
    const selected = within(grid)
      .getAllByRole("gridcell")
      .filter((cell) => cell.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(2);
  });

  it("reports hovered days and draws the preview", () => {
    const onDayHover = vi.fn();
    renderCalendar({ onDayHover, isPreview: (date) => date === "2026-08-20" });
    fireEvent.mouseEnter(dayButton(20));
    expect(onDayHover).toHaveBeenCalledWith("2026-08-20");
    expect(dayButton(20).closest("[role=gridcell]")?.className).toContain("bg-muted");
  });
});

describe("FieldCalendar rendering", () => {
  it("keeps the same day buttons across renders, so focus and hover survive", () => {
    const { rerender } = renderCalendar();
    const before = dayButton(12);
    rerender(
      <FieldCalendar
        mode="single"
        selected="2026-08-12"
        locale="es-ES"
        onDayClick={() => {}}
        isPreview={(date) => date === "2026-08-13"}
        {...texts}
      />,
    );
    expect(dayButton(12)).toBe(before);
  });
});

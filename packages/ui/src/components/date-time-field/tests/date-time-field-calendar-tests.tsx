import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateTimeField } from "../date-time-field";
import { toDate } from "../utils";
import { calendarDay, calendarTexts, renderField, segment, segmentTexts } from "./helpers";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 7, 10, 9, 0));
});
afterEach(() => {
  vi.useRealTimers();
});

const openCalendar = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Abrir calendario" }));
  return screen.getByRole("dialog");
};

describe("DateTimeField calendar", () => {
  it("picks a day, closes and returns focus to the button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    const dialog = await openCalendar(user);
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Fecha").closest("label")?.id,
    );
    await waitFor(() => expect(document.activeElement).toBe(calendarDay(2026, 8, 10)));
    await user.keyboard("{ArrowRight}{ArrowRight}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("2026-08-12");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(segmentTexts()).toEqual(["12", "08", "2026"]);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir calendario" }));
  });

  it("opens at the chosen month", async () => {
    const user = userEvent.setup();
    renderField(
      <DateTimeField label="Fecha" locale="es-ES" defaultValue="2027-03-04" {...calendarTexts} />,
    );
    await openCalendar(user);
    expect(screen.getByText("marzo de 2027")).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(calendarDay(2027, 3, 4)));
  });

  it("sets the date part in datetime mode, keeps the time, and focuses an empty time", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = renderField(
      <DateTimeField
        label="Reunión"
        mode="datetime"
        locale="es-ES"
        defaultValue="2026-08-01T09:30"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await openCalendar(user);
    await user.click(calendarDay(2026, 8, 20));
    expect(onValueChange).toHaveBeenLastCalledWith("2026-08-20T09:30");
    unmount();

    renderField(
      <DateTimeField label="Reunión" mode="datetime" locale="es-ES" {...calendarTexts} />,
    );
    await openCalendar(user);
    await user.click(calendarDay(2026, 8, 20));
    await waitFor(() => expect(document.activeElement).toBe(segment("hora")));
    expect(segmentTexts().slice(0, 3)).toEqual(["20", "08", "2026"]);
  });

  it("blocks weekends", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        isDateDisabled={(date) => [0, 6].includes(toDate(date)?.getDay() ?? -1)}
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await openCalendar(user);
    expect((calendarDay(2026, 8, 15) as HTMLButtonElement).disabled).toBe(true);
    expect((calendarDay(2026, 8, 16) as HTMLButtonElement).disabled).toBe(true);
    expect((calendarDay(2026, 8, 17) as HTMLButtonElement).disabled).toBe(false);
    await user.click(calendarDay(2026, 8, 15));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("cannot open while disabled", async () => {
    const user = userEvent.setup();
    renderField(<DateTimeField label="Fecha" disabled {...calendarTexts} />);
    await user.click(screen.getByRole("button", { name: "Abrir calendario" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no calendar in time mode", () => {
    renderField(<DateTimeField label="Hora" mode="time" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("DateTimeField limits", () => {
  it("stops the arrows at the limits", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        min="2026-08-10"
        defaultValue="2026-08-10"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await user.click(segment("día"));
    await user.keyboard("{ArrowDown}");
    expect(segmentTexts()).toEqual(["10", "08", "2026"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("emits typed values as typed, so the schema decides", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        min="2026-08-10"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await user.click(segment("día"));
    await user.keyboard("01082026");
    expect(onValueChange).toHaveBeenCalledWith("2026-08-01");
  });

  it("disables days outside the limits in the calendar, keeping partial days in datetime", async () => {
    const user = userEvent.setup();
    renderField(
      <DateTimeField
        label="Reunión"
        mode="datetime"
        locale="es-ES"
        min="2026-08-10T15:00"
        max="2026-08-20T10:00"
        {...calendarTexts}
      />,
    );
    await openCalendar(user);
    expect((calendarDay(2026, 8, 9) as HTMLButtonElement).disabled).toBe(true);
    expect((calendarDay(2026, 8, 10) as HTMLButtonElement).disabled).toBe(false);
    expect((calendarDay(2026, 8, 20) as HTMLButtonElement).disabled).toBe(false);
    expect((calendarDay(2026, 8, 21) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe("DateTimeField presets", () => {
  it("sets the value, evaluates functions on click and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const later = vi.fn(() => "2026-08-17");
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        defaultValue="2026-08-10"
        presets={[
          { label: "Hoy", value: "2026-08-10" },
          { label: "En una semana", value: later },
        ]}
        presetsLabel="Atajos"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await openCalendar(user);
    const group = screen.getByRole("group", { name: "Atajos" });
    expect(group).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hoy" }).getAttribute("aria-pressed")).toBe("true");
    later.mockClear();
    await user.click(screen.getByRole("button", { name: "En una semana" }));
    expect(later).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalledWith("2026-08-17");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(segmentTexts()).toEqual(["17", "08", "2026"]);
  });
});

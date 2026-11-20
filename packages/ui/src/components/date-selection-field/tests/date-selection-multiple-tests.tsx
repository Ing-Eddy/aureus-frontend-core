import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateSelectionField } from "../date-selection-field";
import { calendarDay, monthTexts, renderField } from "./helpers";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 7, 1, 9));
});
afterEach(() => {
  vi.useRealTimers();
});

const base = { label: "Días", selection: "multiple", locale: "es-ES", ...monthTexts } as const;
const summaryButton = () => screen.getByRole("button", { name: /^Días/ });

describe("DateSelectionField multiple", () => {
  it("chooses several days, keeps them sorted and summarizes them", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(<DateSelectionField {...base} onValueChange={onValueChange} />);
    await user.click(summaryButton());
    for (const day of [9, 1, 5]) await user.click(calendarDay(2026, 8, day));
    expect(onValueChange).toHaveBeenLastCalledWith(["2026-08-01", "2026-08-05", "2026-08-09"]);
    expect(screen.getByRole("dialog")).toBeTruthy();
    const format = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });
    const expected = new Intl.ListFormat("es-ES", { type: "conjunction" }).format(
      [1, 5, 9].map((day) => format.format(new Date(2026, 7, day))),
    );
    expect(summaryButton().textContent).toBe(expected);
    expect(summaryButton().getAttribute("aria-labelledby")?.split(" ")).toHaveLength(2);
    await user.click(calendarDay(2026, 8, 5));
    expect(onValueChange).toHaveBeenLastCalledWith(["2026-08-01", "2026-08-09"]);
  });

  it("disables other days once maxSelected days are chosen", async () => {
    const user = userEvent.setup();
    renderField(
      <DateSelectionField {...base} maxSelected={2} defaultValue={["2026-08-01", "2026-08-05"]} />,
    );
    await user.click(summaryButton());
    expect((calendarDay(2026, 8, 9) as HTMLButtonElement).disabled).toBe(true);
    expect((calendarDay(2026, 8, 5) as HTMLButtonElement).disabled).toBe(false);
  });

  it("shows the placeholder while empty, and uses formatSummary when given", () => {
    const { unmount } = renderField(<DateSelectionField {...base} placeholder="Elige días" />);
    expect(summaryButton().textContent).toBe("Elige días");
    unmount();
    renderField(
      <DateSelectionField
        {...base}
        defaultValue={["2026-08-01", "2026-08-02"]}
        formatSummary={(dates) => `${dates.length} días`}
      />,
    );
    expect(summaryButton().textContent).toBe("2 días");
  });

  it("cannot open while disabled", async () => {
    const user = userEvent.setup();
    renderField(<DateSelectionField {...base} disabled />);
    expect((summaryButton() as HTMLButtonElement).disabled).toBe(true);
    await user.click(summaryButton());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("submits each day as name[]", () => {
    const { container } = renderField(
      <form>
        <DateSelectionField {...base} name="days" defaultValue={["2026-08-05", "2026-08-01"]} />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.getAll("days[]")).toEqual(["2026-08-01", "2026-08-05"]);
  });

  it("is named by aria-label when there is no label", () => {
    renderField(
      <DateSelectionField selection="multiple" aria-label="Días libres" {...monthTexts} />,
    );
    expect(screen.getByRole("button", { name: "Días libres" })).toBeTruthy();
  });
});

describe("DateSelectionField presets", () => {
  it("sets a range preset from a function and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateSelectionField
        label="Estancia"
        selection="range"
        locale="es-ES"
        openCalendarLabel="Abrir calendario"
        startLabel="Llegada"
        endLabel="Salida"
        {...monthTexts}
        presets={[
          { label: "Próximos 7 días", value: () => ({ from: "2026-08-01", to: "2026-08-07" }) },
        ]}
        presetsLabel="Atajos"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir calendario" }));
    expect(screen.getByRole("group", { name: "Atajos" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Próximos 7 días" }));
    expect(onValueChange).toHaveBeenCalledWith({ from: "2026-08-01", to: "2026-08-07" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("marks the multiple preset that matches the value", async () => {
    const user = userEvent.setup();
    renderField(
      <DateSelectionField
        {...base}
        defaultValue={["2026-08-01", "2026-08-02"]}
        presets={[{ label: "Fin de semana", value: ["2026-08-02", "2026-08-01"] }]}
        presetsLabel="Atajos"
      />,
    );
    await user.click(summaryButton());
    expect(screen.getByRole("button", { name: "Fin de semana" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });
});

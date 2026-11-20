import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateSelectionField } from "../date-selection-field";
import { calendarDay, openRange, rangeTexts, renderField, segmentsOf, textsOf } from "./helpers";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 7, 1, 9));
});
afterEach(() => {
  vi.useRealTimers();
});

const base = { label: "Estancia", selection: "range", locale: "es-ES", ...rangeTexts } as const;

describe("DateSelectionField range", () => {
  it("chooses 1 to 27 August in the calendar", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(<DateSelectionField {...base} onValueChange={onValueChange} />);
    await openRange(user);
    await user.click(calendarDay(2026, 8, 1));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: "2026-08-01", to: null });
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(calendarDay(2026, 8, 27));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: "2026-08-01", to: "2026-08-27" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(textsOf("Llegada")).toEqual(["01", "08", "2026"]);
    expect(textsOf("Salida")).toEqual(["27", "08", "2026"]);
  });

  it("disables ends beyond maxDays while the end is chosen", async () => {
    const user = userEvent.setup();
    renderField(
      <DateSelectionField {...base} maxDays={7} defaultValue={{ from: "2026-08-01", to: null }} />,
    );
    await openRange(user);
    expect((calendarDay(2026, 8, 7) as HTMLButtonElement).disabled).toBe(false);
    expect((calendarDay(2026, 8, 8) as HTMLButtonElement).disabled).toBe(true);
  });

  it("restarts at a day beyond a blocked one with excludeDisabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateSelectionField
        {...base}
        excludeDisabled
        disabledDates={["2026-08-05"]}
        defaultValue={{ from: "2026-08-01", to: null }}
        onValueChange={onValueChange}
      />,
    );
    await openRange(user);
    await user.click(calendarDay(2026, 8, 10));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: "2026-08-10", to: null });
  });

  it("emits a typed inverted range sorted and shows it sorted after leaving", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <>
        <DateSelectionField {...base} onValueChange={onValueChange} />
        <button type="button">fuera</button>
      </>,
    );
    await user.click(segmentsOf("Llegada")[0] as HTMLElement);
    await user.keyboard("20082026");
    expect(onValueChange).toHaveBeenLastCalledWith({ from: "2026-08-20", to: null });
    await user.click(segmentsOf("Salida")[0] as HTMLElement);
    await user.keyboard("10082026");
    expect(onValueChange).toHaveBeenLastCalledWith({ from: "2026-08-10", to: "2026-08-20" });
    expect(textsOf("Llegada")[0]).toBe("20");
    await user.click(screen.getByRole("button", { name: "fuera" }));
    expect(textsOf("Llegada")[0]).toBe("10");
    expect(textsOf("Salida")[0]).toBe("20");
  });

  it("keeps a typed end when the start is cleared", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateSelectionField
        {...base}
        defaultValue={{ from: "2026-08-01", to: "2026-08-27" }}
        onValueChange={onValueChange}
      />,
    );
    await user.click(segmentsOf("Llegada")[0] as HTMLElement);
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(textsOf("Salida")).toEqual(["27", "08", "2026"]);
  });

  it("previews the band while hovering an end", async () => {
    const user = userEvent.setup();
    renderField(<DateSelectionField {...base} defaultValue={{ from: "2026-08-03", to: null }} />);
    await openRange(user);
    await user.hover(calendarDay(2026, 8, 6));
    const cell = (day: number) => calendarDay(2026, 8, day).closest("[role=gridcell]")?.className;
    expect(cell(5)).toContain("bg-muted");
    expect(cell(8)).not.toContain("[&>button]:bg-muted");
  });

  it("submits name[from] and name[to]", () => {
    const { container } = renderField(
      <form>
        <DateSelectionField {...base} name="stay" defaultValue={{ from: "2026-08-01", to: null }} />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("stay[from]")).toBe("2026-08-01");
    expect(data.get("stay[to]")).toBe("");
  });

  it("names the field group, the two ends and the dialog", async () => {
    const user = userEvent.setup();
    renderField(<DateSelectionField {...base} helperText="Máximo 27 noches" />);
    const root = screen.getByRole("group", { name: "Estancia" });
    expect(root.contains(screen.getByRole("group", { name: "Llegada" }))).toBe(true);
    expect(root.contains(screen.getByRole("group", { name: "Salida" }))).toBe(true);
    expect(segmentsOf("Salida")[0]?.getAttribute("aria-describedby")).toContain("helper");
    await openRange(user);
    expect(screen.getByRole("dialog", { name: "Estancia" })).toBeTruthy();
  });
});

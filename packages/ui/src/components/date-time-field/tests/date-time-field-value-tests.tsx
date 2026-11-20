import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateTimeField } from "../date-time-field";
import { calendarTexts, renderField, segment, segmentTexts } from "./helpers";

describe("DateTimeField value", () => {
  it("emits only once the date is complete", async () => {
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
    await user.click(segment("día"));
    await user.keyboard("0108");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard("2026");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("2026-08-01");
  });

  it("clears every segment when the controlled value is reset", () => {
    const props = { label: "Fecha", locale: "es-ES", ...calendarTexts } as const;
    const { rerender } = renderField(<DateTimeField {...props} value="2026-08-01" />);
    expect(segmentTexts()).toEqual(["01", "08", "2026"]);
    rerender(<DateTimeField {...props} value={null} />);
    expect(segmentTexts()).toEqual(["––", "––", "––––"]);
  });

  it("clamps the day when the month changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        defaultValue="2027-01-31"
        onValueChange={onValueChange}
        {...calendarTexts}
      />,
    );
    await user.click(segment("mes"));
    await user.keyboard("{ArrowUp}");
    expect(segmentTexts()).toEqual(["28", "02", "2027"]);
    expect(onValueChange).toHaveBeenCalledWith("2027-02-28");
  });

  it("shows an invalid value as empty and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<DateTimeField label="Fecha" value="2027-02-29" {...calendarTexts} />);
    expect(segmentTexts().every((text) => text?.startsWith("–"))).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`value` "2027-02-29"'));
    warn.mockRestore();
  });

  it("submits the ISO value from native forms, also while loading but not when disabled", () => {
    const read = (container: HTMLElement) =>
      new FormData(container.querySelector("form") as HTMLFormElement).get("when");
    const field = (extra: object) => (
      <form>
        <DateTimeField
          label="Fecha"
          name="when"
          mode="datetime"
          defaultValue="2026-08-01T14:30"
          {...calendarTexts}
          {...extra}
        />
      </form>
    );
    const first = renderField(field({}));
    expect(read(first.container)).toBe("2026-08-01T14:30");
    first.unmount();
    const loading = renderField(field({ loading: true, loadingLabel: "Cargando" }));
    expect(read(loading.container)).toBe("2026-08-01T14:30");
    loading.unmount();
    const disabled = renderField(field({ disabled: true }));
    expect(read(disabled.container)).toBeNull();
  });

  it("reaches the first segment through ref, and calls onBlur when focus leaves", async () => {
    const user = userEvent.setup();
    const ref = { current: null as HTMLSpanElement | null };
    const onBlur = vi.fn();
    renderField(
      <>
        <DateTimeField label="Fecha" locale="es-ES" ref={ref} onBlur={onBlur} {...calendarTexts} />
        <button type="button">fuera</button>
      </>,
    );
    expect(ref.current).toBe(segment("día"));
    await user.click(segment("día"));
    await user.keyboard("{ArrowRight}");
    expect(onBlur).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "fuera" }));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe("DateTimeField keyboard", () => {
  it("follows each locale's order", () => {
    const { unmount } = renderField(
      <DateTimeField label="Date" locale="en-US" defaultValue="2026-08-01" {...calendarTexts} />,
    );
    expect(
      screen.getAllByRole("spinbutton").map((item) => item.getAttribute("aria-label")),
    ).toEqual(["month", "day", "year"]);
    unmount();
    renderField(
      <DateTimeField label="Date" locale="ja-JP" defaultValue="2026-08-01" {...calendarTexts} />,
    );
    expect(segmentTexts()).toEqual(["2026", "08", "01"]);
  });

  it("moves on after a month digit that cannot grow", async () => {
    const user = userEvent.setup();
    renderField(<DateTimeField label="Fecha" locale="es-ES" {...calendarTexts} />);
    await user.click(segment("mes"));
    await user.keyboard("4");
    expect(segment("mes").getAttribute("aria-valuetext")).toBe("abril");
    expect(document.activeElement).toBe(segment("año"));
  });

  it("types a twelve-hour period", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderField(
      <DateTimeField
        label="Time"
        mode="time"
        locale="en-US"
        hourCycle={12}
        defaultValue="14:30"
        onValueChange={onValueChange}
      />,
    );
    expect(segmentTexts()).toEqual(["02", "30", "PM"]);
    await user.click(screen.getAllByRole("spinbutton")[2] as HTMLElement);
    await user.keyboard("a");
    expect(segmentTexts()).toEqual(["02", "30", "AM"]);
    expect(onValueChange).toHaveBeenCalledWith("02:30");
  });

  it("steps minutes and adds a second segment with that granularity", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = renderField(
      <DateTimeField
        label="Hora"
        mode="time"
        locale="es-ES"
        minuteStep={15}
        defaultValue="10:07"
        onValueChange={onValueChange}
      />,
    );
    await user.click(segment("minuto"));
    await user.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith("10:15");
    unmount();
    renderField(
      <DateTimeField
        label="Hora"
        mode="time"
        locale="es-ES"
        granularity="second"
        value="10:07:30"
      />,
    );
    expect(segmentTexts()).toEqual(["10", "07", "30"]);
  });

  it("follows the hour cycle of the locale by default", () => {
    renderField(<DateTimeField label="Time" mode="time" locale="en-US" value="14:30" />);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
    fireEvent.keyDown(segment("hour"), { key: "ArrowUp" });
    expect(segmentTexts()[0]).toBe("02");
  });
});

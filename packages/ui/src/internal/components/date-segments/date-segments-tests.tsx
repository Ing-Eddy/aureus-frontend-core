import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DateSegments, type DateSegmentsHandle, type DateSegmentsProps } from "./date-segments";

type Props = Partial<DateSegmentsProps>;

/** Segments holding their own value, as a field does. */
function Harness({
  initial = null,
  onChange,
  ...props
}: Props & {
  initial?: string | null;
  onChange?: (value: string | null) => void;
}) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <DateSegments
      mode="date"
      locale="es-ES"
      hourCycle={24}
      id="when"
      aria-label="Nacimiento"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      {...props}
    />
  );
}

/** Segments whose controlled value never leaves `null`. */
function Fixed() {
  return (
    <DateSegments
      mode="date"
      locale="es-ES"
      hourCycle={24}
      id="x"
      aria-label="Fecha"
      value={null}
      onValueChange={() => {}}
    />
  );
}

const segment = (name: string) => screen.getByRole("spinbutton", { name });

describe("DateSegments markup", () => {
  it("renders named spinbuttons in a group, with dashes while empty", () => {
    render(<Harness />);
    const group = screen.getByRole("group", { name: "Nacimiento" });
    expect(group.getAttribute("dir")).toBe("ltr");
    const names = screen.getAllByRole("spinbutton").map((item) => item.getAttribute("aria-label"));
    expect(names).toEqual(["día", "mes", "año"]);
    const day = segment("día");
    expect(day.textContent).toBe("––");
    expect(day.hasAttribute("aria-valuenow")).toBe(false);
    expect(day.hasAttribute("aria-valuetext")).toBe(false);
    expect(day.getAttribute("aria-valuemin")).toBe("1");
    expect(segment("año").textContent).toBe("––––");
    expect(day.id).toBe("when");
    expect(segment("mes").id).toBe("when-month");
  });

  it("shows values with the month's name as its value text", () => {
    render(<Harness initial="2026-08-01" />);
    expect(segment("día").textContent).toBe("01");
    expect(segment("mes").getAttribute("aria-valuenow")).toBe("8");
    expect(segment("mes").getAttribute("aria-valuetext")).toBe("agosto");
    expect(segment("año").textContent).toBe("2026");
  });

  it("shows the locale's digits", () => {
    render(<Harness initial="2026-08-01" locale="ar-EG" />);
    const texts = screen.getAllByRole("spinbutton").map((item) => item.textContent);
    expect(texts).toEqual(["٠١", "٠٨", "٢٠٢٦"]);
  });

  it("passes the field's state to each segment", () => {
    render(<Harness aria-describedby="help" aria-required aria-invalid loading />);
    const group = screen.getByRole("group");
    expect(group.getAttribute("aria-busy")).toBe("true");
    for (const item of screen.getAllByRole("spinbutton")) {
      expect(item.getAttribute("aria-describedby")).toBe("help");
      expect(item.getAttribute("aria-required")).toBe("true");
      expect(item.getAttribute("aria-invalid")).toBe("true");
      expect(item.getAttribute("aria-disabled")).toBe("true");
      expect(item.getAttribute("tabindex")).toBe("-1");
    }
  });

  it("reaches the first segment through ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Harness ref={ref} />);
    expect(ref.current).toBe(segment("día"));
  });
});

describe("DateSegments keyboard", () => {
  it("types a date with auto-advance and emits it once complete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(segment("día"));
    await user.keyboard("01");
    expect(document.activeElement).toBe(segment("mes"));
    await user.keyboard("4");
    expect(document.activeElement).toBe(segment("año"));
    await user.keyboard("202");
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard("6");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2026-04-01");
  });

  it("types through beforeinput, as virtual keyboards do", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const day = segment("día");
    act(() => day.focus());
    const event = new InputEvent("beforeinput", {
      data: "15",
      inputType: "insertText",
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      day.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(day.textContent).toBe("15");
    expect(document.activeElement).toBe(segment("mes"));
  });

  it("moves with the arrows and edits with up and down", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial="2027-01-31" onChange={onChange} />);
    await user.click(segment("mes"));
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith("2027-02-28");
    expect(segment("día").textContent).toBe("28");
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(segment("día"));
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(document.activeElement).toBe(segment("año"));
    await user.keyboard("{Home}");
    expect(segment("año").textContent).toBe("0001");
  });

  it("clears with Backspace and moves back from an empty segment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial="2026-08-01" onChange={onChange} />);
    await user.click(segment("mes"));
    await user.keyboard("{Backspace}");
    expect(segment("mes").textContent).toBe("––");
    expect(onChange).toHaveBeenLastCalledWith(null);
    await user.keyboard("{Backspace}");
    expect(document.activeElement).toBe(segment("día"));
  });

  it("moves on when a separator is typed", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(segment("día"));
    await user.keyboard("1/");
    expect(document.activeElement).toBe(segment("mes"));
    expect(segment("día").textContent).toBe("01");
  });

  it("ignores edits while locked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial="2026-08-01" onChange={onChange} disabled />);
    fireEvent.keyDown(segment("día"), { key: "ArrowUp" });
    fireEvent.keyDown(segment("día"), { key: "5" });
    await user.keyboard("{Backspace}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("DateSegments with time", () => {
  it("types a twelve-hour time and emits it on the 24-hour clock", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness mode="time" locale="en-US" hourCycle={12} initial="14:30" onChange={onChange} />,
    );
    const names = screen.getAllByRole("spinbutton").map((item) => item.getAttribute("aria-label"));
    expect(names[0]).toBe("hour");
    const period = screen.getAllByRole("spinbutton")[2] as HTMLElement;
    expect(period.textContent).toBe("PM");
    await user.click(period);
    await user.keyboard("a");
    expect(onChange).toHaveBeenLastCalledWith("02:30");
  });

  it("steps minutes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness mode="time" initial="10:07" minuteStep={15} onChange={onChange} />);
    await user.click(segment("minuto"));
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith("10:15");
  });

  it("sets the date from a calendar pick and keeps the time", () => {
    const handle = createRef<DateSegmentsHandle>();
    const onChange = vi.fn();
    render(
      <Harness mode="datetime" initial="2026-08-01T09:30" handleRef={handle} onChange={onChange} />,
    );
    act(() => handle.current?.setDate("2026-08-12"));
    expect(onChange).toHaveBeenLastCalledWith("2026-08-12T09:30");
    expect(handle.current?.isTimeEmpty()).toBe(false);
    act(() => handle.current?.focus("time"));
    expect(document.activeElement).toBe(segment("hora"));
  });
});

describe("DateSegments value sync", () => {
  it("keeps a partial input while the controlled value stays null", async () => {
    const user = userEvent.setup();
    render(<Fixed />);
    await user.click(segment("día"));
    await user.keyboard("12");
    expect(segment("día").textContent).toBe("12");
  });

  it("replaces the segments when a new value arrives, and clears them on reset", () => {
    const props = {
      mode: "date",
      locale: "es-ES",
      hourCycle: 24,
      id: "x",
      "aria-label": "Fecha",
      onValueChange: () => {},
    } as const;
    const { rerender } = render(<DateSegments {...props} value="2026-08-01" />);
    rerender(<DateSegments {...props} value="2030-01-15" />);
    expect(segment("año").textContent).toBe("2030");
    rerender(<DateSegments {...props} value={null} />);
    expect(
      screen.getAllByRole("spinbutton").every((item) => item.textContent?.startsWith("–")),
    ).toBe(true);
  });
});

describe("DateSegments hidden input", () => {
  it("submits the ISO value, or nothing while incomplete", () => {
    const { container, rerender } = render(<Harness name="birth" initial="2026-08-01" />);
    const input = () => container.querySelector("input[name=birth]") as HTMLInputElement;
    expect(input().value).toBe("2026-08-01");
    expect(input().disabled).toBe(false);
    rerender(<Harness name="birth" initial="2026-08-01" loading />);
    expect(input().disabled).toBe(false);
    rerender(<Harness name="birth" initial="2026-08-01" disabled />);
    expect(input().disabled).toBe(true);
  });
});

describe("DateSegments wrapping", () => {
  it("keeps the date and the time each in one unbreakable part", () => {
    const { container } = render(<Harness mode="datetime" initial="2026-08-01T14:30" />);
    const parts = [...container.querySelectorAll("[data-slot=date-segments-part]")];
    expect(parts).toHaveLength(2);
    const types = (part: Element) =>
      [...part.querySelectorAll("[role=spinbutton]")].map((item) => item.getAttribute("data-type"));
    expect(types(parts[0] as Element)).toEqual(["day", "month", "year"]);
    expect(types(parts[1] as Element)).toEqual(["hour", "minute"]);
  });
});

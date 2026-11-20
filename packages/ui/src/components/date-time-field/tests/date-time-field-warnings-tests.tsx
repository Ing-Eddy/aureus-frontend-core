import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { DateTimeField } from "../date-time-field";
import { dateTimeProblems } from "../hooks";
import { renderField } from "./helpers";

describe("DateTimeField warnings", () => {
  it("names each missing text and invalid value once, with the component's name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const untyped = {
      label: "Fecha",
      loading: true,
      info: "Más",
      presets: [{ label: "Hoy", value: "2026-08-10" }],
      value: "10/08/2026",
      min: "2026-13-01",
    } as unknown as Parameters<typeof DateTimeField>[0];
    const { rerender } = renderField(<DateTimeField {...untyped} />);
    rerender(
      <TooltipProvider>
        <DateTimeField {...untyped} />
      </TooltipProvider>,
    );
    const messages = warn.mock.calls.map(([message]) => String(message));
    for (const expected of [
      "the calendar needs `openCalendarLabel`",
      "the calendar needs `previousMonthLabel`",
      "the calendar needs `nextMonthLabel`",
      "`presets` needs `presetsLabel`",
      '`value` "10/08/2026" is not a YYYY-MM-DD value',
      '`min` "2026-13-01" is not a YYYY-MM-DD value',
      "`loading` needs `loadingLabel`",
      "`info` needs `infoLabel`",
    ]) {
      expect(messages.filter((message) => message.includes(expected))).toHaveLength(1);
    }
    expect(messages.every((message) => message.startsWith("DateTimeField: "))).toBe(true);
    warn.mockRestore();
  });

  it("finds no problems in a complete field", () => {
    expect(
      dateTimeProblems({
        label: "Fecha",
        openCalendarLabel: "A",
        previousMonthLabel: "B",
        nextMonthLabel: "C",
        value: "2026-08-01",
      }),
    ).toEqual([]);
    expect(dateTimeProblems({ label: "Hora", mode: "time", value: "14:30" })).toEqual([]);
    expect(dateTimeProblems({ label: "Hora", mode: "time", presets: [{}] })).toContain(
      '`presets` are not allowed with `mode="time"`',
    );
  });
});

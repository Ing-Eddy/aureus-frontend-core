import { describe, expect, it } from "vitest";
import { DateTimeField, type DateTimeFieldProps } from "@/components/date-time-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { DateTimeControl } from "../date-time-control";
import type { DateTimeControlProps } from "../date-time-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};
const texts = {
  openCalendarLabel: "Abrir",
  previousMonthLabel: "Anterior",
  nextMonthLabel: "Siguiente",
};

const cases: Record<string, { props: Partial<DateTimeFieldProps>; value: string | null }> = {
  date: {
    props: {
      label: "Nacimiento",
      locale: "es-ES",
      required: true,
      helperText: "Día/mes/año",
      ...texts,
    },
    value: "1990-05-01",
  },
  time: {
    props: {
      label: "Hora",
      mode: "time",
      locale: "en-US",
      hourCycle: 12,
    } as Partial<DateTimeFieldProps>,
    value: "14:30",
  },
  datetime: {
    props: {
      label: "Reunión",
      mode: "datetime",
      locale: "es-ES",
      granularity: "second",
      action: { children: "Ahora", onClick: noop },
      ...texts,
    } as Partial<DateTimeFieldProps>,
    value: null,
  },
};

describe("DateTimeField and DateTimeControl render the same markup", () => {
  for (const [title, { props, value }] of Object.entries(cases)) {
    it(title, () => {
      const fieldProps = {
        ...props,
        name: "meeting",
        value,
        onValueChange: noop,
      } as DateTimeFieldProps;
      const expected = fieldMarkup(<DateTimeField {...fieldProps} />);
      const control = renderInForm(
        <DateTimeControl {...(props as DateTimeControlProps)} name="meeting" />,
        { meeting: value },
      );
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});

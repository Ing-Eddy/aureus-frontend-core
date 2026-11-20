import { describe, expect, it } from "vitest";
import {
  DateSelectionField,
  type DateSelectionFieldProps,
} from "@/components/date-selection-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { DateSelectionControl } from "../date-selection-control";
import type { DateSelectionControlProps } from "../date-selection-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};
const months = { previousMonthLabel: "Anterior", nextMonthLabel: "Siguiente" };

const cases: Record<
  string,
  { props: Partial<DateSelectionFieldProps>; name: "stay" | "days"; value: unknown }
> = {
  range: {
    name: "stay",
    props: {
      label: "Estancia",
      selection: "range",
      locale: "es-ES",
      openCalendarLabel: "Abrir",
      startLabel: "Llegada",
      endLabel: "Salida",
      required: true,
      helperText: "Máximo 27 días",
      ...months,
    } as Partial<DateSelectionFieldProps>,
    value: { from: "2026-08-01", to: null },
  },
  multiple: {
    name: "days",
    props: {
      label: "Días",
      selection: "multiple",
      locale: "en-US",
      placeholder: "Pick days",
      action: { children: "Clear", onClick: noop },
      ...months,
    } as Partial<DateSelectionFieldProps>,
    value: ["2026-08-01", "2026-08-05"],
  },
};

describe("DateSelectionField and DateSelectionControl render the same markup", () => {
  for (const [title, { props, name, value }] of Object.entries(cases)) {
    it(title, () => {
      const fieldProps = { ...props, name, value, onValueChange: noop } as DateSelectionFieldProps;
      const expected = fieldMarkup(<DateSelectionField {...fieldProps} />);
      const control = renderInForm(
        <DateSelectionControl {...(props as DateSelectionControlProps)} name={name} />,
        { [name]: value },
      );
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});

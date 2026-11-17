import { describe, expect, it } from "vitest";
import { SliderField } from "../slider-field";
import { renderField, thumb } from "./helpers";

const headerValue = () => document.querySelector("[data-slot=slider-value]");

describe("SliderField formatting", () => {
  it("formats a currency range (spec: Currency range)", () => {
    const formatOptions: Intl.NumberFormatOptions = {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    };
    renderField(
      <SliderField
        label="Precio"
        range
        thumbLabels={["Precio mínimo", "Precio máximo"]}
        min={0}
        max={1000}
        defaultValue={[200, 800]}
        locale="es-ES"
        formatOptions={formatOptions}
        showValue="header"
      />,
    );
    const format = new Intl.NumberFormat("es-ES", formatOptions);
    expect(thumb("Precio mínimo").getAttribute("aria-valuetext")).toBe(format.format(200));
    expect(thumb("Precio máximo").getAttribute("aria-valuetext")).toBe(format.format(800));
    expect(headerValue()?.textContent).toBe(format.formatRange(200, 800));
  });

  it("shows a percent in the header, hidden from assistive technology (spec: Header value)", () => {
    renderField(
      <SliderField
        label="Volumen"
        showValue="header"
        locale="es-ES"
        formatOptions={{ style: "percent" }}
        max={1}
        step={0.01}
        defaultValue={0.4}
      />,
    );
    expect(headerValue()?.textContent).toBe(
      new Intl.NumberFormat("es-ES", { style: "percent" }).format(0.4),
    );
    expect(headerValue()?.getAttribute("aria-hidden")).toBe("true");
    expect(headerValue()?.closest("[data-slot=field-header]")).not.toBeNull();
  });

  it("uses formatValue for the tooltip, the header and the value text", () => {
    renderField(
      <SliderField
        label="Rating"
        max={5}
        defaultValue={3}
        formatValue={(value) => `${value} of 5`}
        showValue="tooltip"
      />,
    );
    const slider = thumb("Rating");
    expect(slider.getAttribute("aria-valuetext")).toBe("3 of 5");
    expect(slider.querySelector("[data-slot=slider-tooltip]")?.textContent).toBe("3 of 5");
  });
});

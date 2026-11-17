import { describe, expect, it } from "vitest";
import { createSliderFormatter } from "./format-slider-value";

const nbsp = / | /g;
const plain = (text: string) => text.replace(nbsp, " ");

describe("createSliderFormatter", () => {
  it("formats currency, percent and units for the locale", () => {
    const euros = createSliderFormatter({
      locale: "es-ES",
      formatOptions: { style: "currency", currency: "EUR", maximumFractionDigits: 0 },
    });
    expect(plain(euros.format(1200))).toBe("1200 €");
    const percent = createSliderFormatter({ locale: "en-US", formatOptions: { style: "percent" } });
    expect(percent.format(0.4)).toBe("40%");
    const unit = createSliderFormatter({
      locale: "es-ES",
      formatOptions: { style: "unit", unit: "kilogram" },
    });
    expect(plain(unit.format(12))).toBe("12 kg");
  });

  it("formats a range with formatRange", () => {
    const options: Intl.NumberFormatOptions = {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    };
    const euros = createSliderFormatter({ locale: "es-ES", formatOptions: options });
    expect(euros.formatRange(200, 800)).toBe(
      new Intl.NumberFormat("es-ES", options).formatRange(200, 800),
    );
    const dollars = createSliderFormatter({
      locale: "en-US",
      formatOptions: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    });
    expect(dollars.formatRange(20, 80)).toBe("$20 – $80");
  });

  it("joins equal ends instead of showing an approximation", () => {
    const numbers = createSliderFormatter({ locale: "en-US" });
    expect(numbers.formatRange(5, 5)).toBe("5 – 5");
  });

  it("joins the two values when the engine lacks formatRange", () => {
    const original = Intl.NumberFormat.prototype.formatRange;
    try {
      // @ts-expect-error simulates an engine without the method
      delete Intl.NumberFormat.prototype.formatRange;
      const numbers = createSliderFormatter({ locale: "en-US" });
      expect(numbers.formatRange(1000, 2000)).toBe("1,000 – 2,000");
    } finally {
      Intl.NumberFormat.prototype.formatRange = original;
    }
  });

  it("lets formatValue win over formatOptions", () => {
    const custom = createSliderFormatter({
      locale: "es-ES",
      formatOptions: { style: "percent" },
      formatValue: (value) => `${value} pts`,
    });
    expect(custom.format(3)).toBe("3 pts");
    expect(custom.formatRange(1, 3)).toBe("1 pts – 3 pts");
  });
});

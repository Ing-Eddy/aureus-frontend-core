import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NumberField } from "../number-field";
import type { NumberFieldProps } from "../number-field-types";

const input = () => screen.getByRole("spinbutton") as HTMLInputElement;
const renderField = (props: Partial<NumberFieldProps>) =>
  render(<NumberField label="Amount" {...props} />);

describe("NumberField props are independent", () => {
  it("is plain with no props", async () => {
    renderField({});
    await userEvent.type(input(), "122345");
    expect(input().value).toBe("122345");
    await userEvent.tab();
    expect(input().value).toBe("122345");
  });

  it("currency only adds its symbol", () => {
    const { container } = renderField({ currency: "USD", defaultValue: 1234.5 });
    expect(container.querySelector("[data-slot=number-field-currency]")?.textContent).toBe("$");
    expect(input().value).toBe("1234.5");
  });

  it("currency with decimals={0} accepts integers only", async () => {
    renderField({ currency: "USD", decimals: 0 });
    await userEvent.type(input(), "12.5");
    expect(input().value).toBe("125");
  });

  it("grouping is on or off regardless of currency", () => {
    const { unmount } = renderField({ defaultValue: 123345, grouping: true, currency: "USD" });
    expect(input().value).toBe("123,345");
    unmount();
    renderField({ defaultValue: 123345, currency: "USD" });
    expect(input().value).toBe("123345");
  });

  it("padDecimals does nothing without decimals", () => {
    const { unmount } = renderField({ defaultValue: 12.5, padDecimals: true });
    expect(input().value).toBe("12.5");
    unmount();
    renderField({ defaultValue: 12.5, padDecimals: true, decimals: 2 });
    expect(input().value).toBe("12.50");
  });

  it("combines currency, prefix and suffix", () => {
    const { container } = renderField({ currency: "EUR", prefix: "≈", suffix: "/month" });
    expect(container.querySelector("[data-slot=number-field-currency]")?.textContent).toBe("€");
    expect(container.querySelector("[data-slot=number-field-prefix]")?.textContent).toBe("≈");
    expect(container.querySelector("[data-slot=number-field-suffix]")?.textContent).toBe("/month");
  });

  it("uses the locale's separators", () => {
    renderField({
      defaultValue: 1234.5,
      locale: "es-ES",
      grouping: true,
      decimals: 2,
      padDecimals: true,
    });
    expect(input().value).toBe("1.234,50");
  });
});

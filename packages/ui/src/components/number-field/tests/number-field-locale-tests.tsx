import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberField } from "../number-field";

const input = () => screen.getByRole("spinbutton") as HTMLInputElement;

/** Makes `locale` the one `Intl` resolves when none is asked for, as another browser would. */
function setBrowserLocale(locale: string) {
  const resolve = Intl.NumberFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.NumberFormat.prototype, "resolvedOptions").mockImplementation(function (
    this: Intl.NumberFormat,
  ) {
    return { ...resolve.call(this), locale };
  });
}

const field = (props: { locale?: string; onValueChange?: (value: number | null) => void }) => (
  <NumberField label="Amount" stepper={false} grouping decimals={2} {...props} />
);

afterEach(() => vi.restoreAllMocks());

describe("NumberField locale", () => {
  it.each([
    ["en-US", "1,234.5"],
    ["es-ES", "1.234,5"],
    ["de-CH", /^1['’]234\.5$/],
  ])("follows the browser's locale by default (%s)", (locale, shown) => {
    setBrowserLocale(locale);
    render(<NumberField label="Amount" stepper={false} grouping defaultValue={1234.5} />);
    expect(input().value).toMatch(shown);
  });

  it("reads what is typed with the browser's separators", async () => {
    setBrowserLocale("es-ES");
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    await userEvent.type(input(), "1234,5");
    expect(onValueChange).toHaveBeenLastCalledWith(1234.5);
    expect(input().value).toBe("1.234,5");
  });

  it("keeps an explicit locale whatever the browser's is", () => {
    setBrowserLocale("es-ES");
    render(
      <NumberField label="Amount" stepper={false} grouping locale="en-US" defaultValue={1234.5} />,
    );
    expect(input().value).toBe("1,234.5");
  });

  it("accepts a point in a browser whose language has its own digits", async () => {
    setBrowserLocale("ar-EG");
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    await userEvent.type(input(), "1.5");
    expect(onValueChange).toHaveBeenLastCalledWith(1.5);
  });
});

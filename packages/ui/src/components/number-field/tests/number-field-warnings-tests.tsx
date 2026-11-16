import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { NumberField } from "../number-field";

/** Renders the field as untyped code would, bypassing the required texts. */
const renderUntyped = (props: Record<string, unknown>) =>
  render(
    <TooltipProvider>
      <NumberField {...(props as unknown as Parameters<typeof NumberField>[0])} />
    </TooltipProvider>,
  );

afterEach(() => vi.restoreAllMocks());

describe("NumberField development warnings", () => {
  it("names the missing step texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Amount" });
    expect(warn).toHaveBeenCalledWith("NumberField: the step buttons need `incrementLabel`.");
    expect(warn).toHaveBeenCalledWith("NumberField: the step buttons need `decrementLabel`.");
  });

  it("names the missing expression texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Amount", stepper: false, expressions: true });
    expect(warn).toHaveBeenCalledWith("NumberField: `expressions` needs `invalidExpressionLabel`.");
    expect(warn).toHaveBeenCalledWith("NumberField: `expressions` needs `calculatedFromLabel`.");
  });

  it("names itself in the action's warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Amount", stepper: false, action: { children: <svg /> } });
    expect(warn).toHaveBeenCalledWith(
      "NumberField: an icon-only action needs an accessible name. Pass `aria-label` in `action`.",
    );
  });

  it("stays silent when every text is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Amount", incrementLabel: "Más", decrementLabel: "Menos" });
    expect(warn).not.toHaveBeenCalled();
  });
});

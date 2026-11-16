import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { SelectField } from "../select-field";

/** Renders the field as untyped code would, bypassing the required texts. */
const renderUntyped = (props: Record<string, unknown>) =>
  render(
    <TooltipProvider>
      <SelectField {...(props as unknown as Parameters<typeof SelectField>[0])} />
    </TooltipProvider>,
  );

afterEach(() => vi.restoreAllMocks());

describe("SelectField development warnings", () => {
  it("names the field and the missing name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ options: [] });
    expect(warn).toHaveBeenCalledWith(
      "SelectField: the select has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`.",
    );
  });

  it("names loading and info without their texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Country", options: [], loading: true, info: "Help" });
    expect(warn).toHaveBeenCalledWith("SelectField: `loading` needs `loadingLabel`.");
    expect(warn).toHaveBeenCalledWith("SelectField: `info` needs `infoLabel`.");
  });

  it("words the unknown value like the other families", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Country", options: [{ value: "es", label: "España" }], value: "pe" });
    expect(warn).toHaveBeenCalledWith('SelectField: the value "pe" matches no option; it is kept.');
  });

  it("stays silent when every text is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ "aria-label": "Country", options: [] });
    expect(warn).not.toHaveBeenCalled();
  });
});

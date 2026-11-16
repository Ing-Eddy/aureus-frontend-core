import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextField } from "../text-field";

/** Renders the field as untyped code would, bypassing the required texts. */
const renderUntyped = (props: Record<string, unknown>) =>
  render(
    <TooltipProvider>
      <TextField {...(props as unknown as Parameters<typeof TextField>[0])} />
    </TooltipProvider>,
  );

afterEach(() => vi.restoreAllMocks());

describe("TextField development warnings", () => {
  it("names the field and the missing name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({});
    expect(warn).toHaveBeenCalledWith(
      "TextField: the input has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`.",
    );
  });

  it("names loading and info without their texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Name", loading: true, info: "Help" });
    expect(warn).toHaveBeenCalledWith("TextField: `loading` needs `loadingLabel`.");
    expect(warn).toHaveBeenCalledWith("TextField: `info` needs `infoLabel`.");
  });

  it("stays silent when every text is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({
      label: "Name",
      loading: true,
      loadingLabel: "Cargando",
      info: "Help",
      infoLabel: "Info",
    });
    expect(warn).not.toHaveBeenCalled();
  });
});

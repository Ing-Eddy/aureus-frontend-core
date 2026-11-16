import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { PasswordField } from "../password-field";

/** Renders the field as untyped code would, bypassing the required texts. */
const renderUntyped = (props: Record<string, unknown>) =>
  render(
    <TooltipProvider>
      <PasswordField {...(props as unknown as Parameters<typeof PasswordField>[0])} />
    </TooltipProvider>,
  );

afterEach(() => vi.restoreAllMocks());

describe("PasswordField development warnings", () => {
  it("names the missing toggle texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Password" });
    expect(warn).toHaveBeenCalledWith(
      "PasswordField: the visibility toggle needs `showPasswordLabel`.",
    );
    expect(warn).toHaveBeenCalledWith(
      "PasswordField: the visibility toggle needs `hidePasswordLabel`.",
    );
  });

  it("stays silent when every text is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({
      label: "Password",
      showPasswordLabel: "Mostrar",
      hidePasswordLabel: "Ocultar",
    });
    expect(warn).not.toHaveBeenCalled();
  });
});

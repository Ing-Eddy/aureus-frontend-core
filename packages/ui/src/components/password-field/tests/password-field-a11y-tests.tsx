import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { PasswordField } from "../password-field";

describe("PasswordField accessibility", () => {
  it("points the toggle at the input with aria-controls", () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
      />,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.id).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Show password" }).getAttribute("aria-controls"),
    ).toBe(input.id);
  });

  it("uses the consumer's id for both the input and aria-controls", () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        id="pwd"
      />,
    );
    expect(container.querySelector("input")?.id).toBe("pwd");
    expect(
      screen.getByRole("button", { name: "Show password" }).getAttribute("aria-controls"),
    ).toBe("pwd");
  });

  it("accepts custom toggle names", async () => {
    render(
      <PasswordField
        label="Contraseña"
        showPasswordLabel="Mostrar contraseña"
        hidePasswordLabel="Ocultar contraseña"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(screen.getByRole("button", { name: "Ocultar contraseña" })).toBeTruthy();
  });

  it("has no tooltip on the toggle", () => {
    render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
      />,
    );
    // Tooltip triggers carry a Radix `data-state`; the toggle is a plain button.
    expect(screen.getByRole("button", { name: "Show password" }).hasAttribute("data-state")).toBe(
      false,
    );
  });

  it("keeps the shared field contract: label, aria-required, helper and info", () => {
    const { container } = render(
      <TooltipProvider>
        <PasswordField
          infoLabel="More information"
          showPasswordLabel="Show password"
          hidePasswordLabel="Hide password"
          label="Password"
          required
          helperText="At least 8"
          info="Use a passphrase"
        />
      </TooltipProvider>,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    // The label text includes the aria-hidden asterisk ("Password*").
    expect(screen.getByLabelText(/^Password/)).toBe(input);
    expect(input.getAttribute("aria-required")).toBe("true");
    const described = (input.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual(["At least 8", "Use a passphrase"]);
  });
});

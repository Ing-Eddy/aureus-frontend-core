import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextField } from "../text-field";
import type { TextFieldProps } from "../text-field-types";

const renderField = (props: TextFieldProps) =>
  render(
    <TooltipProvider>
      <TextField {...props} />
    </TooltipProvider>,
  );

describe("TextField accessibility", () => {
  it("uses the label as the input's accessible name", () => {
    renderField({ label: "Username" });
    expect(screen.getByRole("textbox", { name: "Username" })).toBeTruthy();
  });

  it("marks required inputs with aria-required, not the native attribute", () => {
    renderField({ label: "Email", required: true });
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.hasAttribute("required")).toBe(false);
  });

  it("describes the input with the helper text and the info content", () => {
    renderField({ label: "Username", helperText: "At least 3", info: "Visible to others" });
    const input = screen.getByRole("textbox", { name: "Username" });
    const ids = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const texts = ids.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(["At least 3", "Visible to others"]);
  });

  it("keeps the consumer's aria-describedby first", () => {
    renderField({ label: "Username", helperText: "Help", "aria-describedby": "external" });
    const describedBy = screen.getByRole("textbox").getAttribute("aria-describedby");
    expect(describedBy?.startsWith("external ")).toBe(true);
  });

  it("exposes aria-invalid and data-invalid in error", () => {
    const { container } = renderField({ label: "Username", error: true });
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("[data-slot=field]")?.getAttribute("data-invalid")).toBe("true");
  });

  it("uses the consumer's id", () => {
    renderField({ label: "Username", id: "user" });
    expect(screen.getByRole("textbox").id).toBe("user");
  });
});

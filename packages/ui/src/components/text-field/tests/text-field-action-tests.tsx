import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextField } from "../text-field";
import type { TextFieldProps } from "../text-field-types";

const renderField = (props: TextFieldProps) =>
  render(
    <TooltipProvider>
      <TextField label="Coupon" {...props} />
    </TooltipProvider>,
  );

describe("TextField action", () => {
  it("renders the action inside the frame and calls onClick without submitting", () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <TooltipProvider>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <TextField label="Coupon" action={{ children: "Apply", onClick }} />
        </form>
      </TooltipProvider>,
    );
    const button = screen.getByRole("button", { name: "Apply" });
    expect(button.closest("[data-slot=input-group]")).toBeTruthy();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables the action while loading or disabled", () => {
    const { unmount } = renderField({ loading: true, action: { children: "Apply" } });
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    unmount();
    renderField({ disabled: true, action: { children: "Apply" } });
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("keeps the input enabled when only the action is disabled", () => {
    renderField({ action: { children: "Apply", disabled: true } });
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(false);
  });

  it("shows the spinner before the action", () => {
    const { container } = renderField({ loading: true, action: { children: "Apply" } });
    const addon = container.querySelector("[data-slot=input-group-addon]");
    const slots = [...(addon?.children ?? [])].map((child) => child.getAttribute("data-slot"));
    expect(slots).toEqual(["field-loading", "field-action"]);
  });

  it("merges classNames.action with the action's own className", () => {
    renderField({
      classNames: { action: "slot-x" },
      action: { children: "Apply", className: "own-x" },
    });
    const button = screen.getByRole("button", { name: "Apply" });
    expect(button.className).toContain("slot-x");
    expect(button.className).toContain("own-x");
  });

  it("renders no addon without loading or action", () => {
    const { container } = renderField({});
    expect(container.querySelector("[data-slot=input-group-addon]")).toBeNull();
  });
});

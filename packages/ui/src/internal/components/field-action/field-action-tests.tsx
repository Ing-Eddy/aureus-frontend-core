import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FieldActionProps } from "@/internal/types";
import { fieldFrameClassName } from "@/internal/utils/constants";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shadcn/ui/input-group";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { FieldAction } from "./field-action";

function renderAction(props: FieldActionProps) {
  return render(
    <TooltipProvider>
      <FieldAction {...props} />
    </TooltipProvider>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe("FieldAction", () => {
  it("is a ghost button that does not submit by default", () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <FieldAction>Apply</FieldAction>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Apply" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-variant")).toBe("ghost");
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sizes text and icon content automatically", () => {
    renderAction({ children: "Apply" });
    expect(screen.getByRole("button", { name: "Apply" }).getAttribute("data-size")).toBe("xs");
    renderAction({ children: <svg />, "aria-label": "Copy" });
    expect(screen.getByRole("button", { name: "Copy" }).getAttribute("data-size")).toBe("icon-xs");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    renderAction({ children: "Apply", onClick });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("wraps the button in a tooltip only when one is given", () => {
    renderAction({ children: "Plain" });
    expect(screen.getByRole("button", { name: "Plain" }).hasAttribute("data-state")).toBe(false);
    renderAction({ children: "Tipped", tooltip: "Explains it" });
    expect(screen.getByRole("button", { name: "Tipped" }).getAttribute("data-state")).toBe(
      "closed",
    );
  });

  it("warns about an icon-only action without an accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderAction({ children: <svg /> });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
  });

  it("does not warn when the icon action is named", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderAction({ children: <svg />, "aria-label": "Copy" });
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not dim the frame when only the action is disabled", () => {
    const { container } = render(
      <InputGroup className={fieldFrameClassName}>
        <InputGroupInput aria-label="Code" />
        <InputGroupAddon align="inline-end">
          <FieldAction disabled>Apply</FieldAction>
        </InputGroupAddon>
      </InputGroup>,
    );
    const frame = container.querySelector("[data-slot=input-group]");
    const classes = frame?.className.split(" ") ?? [];
    // shadcn's `has-disabled:opacity-50` is replaced; dimming only follows the input.
    expect(classes).toContain("has-disabled:opacity-100");
    expect(classes).not.toContain("has-disabled:opacity-50");
    expect(classes).toContain("has-[[data-slot=input-group-control]:disabled]:opacity-50");
  });
});

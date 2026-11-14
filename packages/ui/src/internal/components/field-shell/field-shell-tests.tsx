import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { FieldShell, type FieldShellProps } from "./field-shell";

function renderShell(props: Partial<FieldShellProps> = {}) {
  return render(
    <TooltipProvider>
      <FieldShell inputId="name" helperId="name-helper" infoId="name-info" {...props}>
        <input id="name" />
      </FieldShell>
    </TooltipProvider>,
  );
}

describe("FieldShell", () => {
  it("associates the label with the input", () => {
    renderShell({ label: "Name" });
    expect(screen.getByText("Name").closest("label")?.getAttribute("for")).toBe("name");
  });

  it("renders a hidden destructive asterisk when required", () => {
    const { container } = renderShell({ label: "Name", required: true });
    const mark = container.querySelector("[data-slot=field-required-mark]");
    expect(mark?.textContent).toBe("*");
    expect(mark?.getAttribute("aria-hidden")).toBe("true");
    expect(mark?.className).toContain("text-destructive");
  });

  it("renders no header without label and info", () => {
    const { container } = renderShell();
    expect(container.querySelector("[data-slot=field-header]")).toBeNull();
  });

  it("renders the info button at the end of the header", () => {
    const { container } = renderShell({ info: "Visible to others" });
    const button = screen.getByRole("button", { name: "More information" });
    expect(button.className).toContain("ms-auto");
    expect(container.querySelector("#name-info")?.textContent).toBe("Visible to others");
  });

  it("shows the helper text, destructive while in error", () => {
    const { rerender } = renderShell({ helperText: "Optional" });
    expect(screen.getByText("Optional").id).toBe("name-helper");
    expect(screen.getByText("Optional").className).not.toContain("text-destructive");

    rerender(
      <TooltipProvider>
        <FieldShell
          inputId="name"
          helperId="name-helper"
          infoId="name-info"
          helperText="Optional"
          error
        >
          <input id="name" />
        </FieldShell>
      </TooltipProvider>,
    );
    expect(screen.getByText("Optional").className).toContain("text-destructive");
  });

  it("replaces the helper with an alert when there is an error message", () => {
    renderShell({ helperText: "Optional", error: true, errorMessage: "Invalid" });
    expect(screen.queryByText("Optional")).toBeNull();
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Invalid");
    expect(alert.id).toBe("name-helper");
  });

  it("ignores the error message when not in error", () => {
    renderShell({ helperText: "Optional", errorMessage: "Invalid" });
    expect(screen.getByText("Optional")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("applies the data attributes and every class name slot", () => {
    const { container } = renderShell({
      label: "Name",
      required: true,
      info: "Info",
      helperText: "Help",
      className: "root-a",
      rootProps: { "data-invalid": true, "data-disabled": true },
      classNames: {
        root: "root-b",
        header: "header-x",
        label: "label-x",
        requiredMark: "mark-x",
        info: "info-x",
        helper: "helper-x",
      },
    });
    const root = container.querySelector("[data-slot=field]");
    expect(root?.getAttribute("data-invalid")).toBe("true");
    expect(root?.getAttribute("data-disabled")).toBe("true");
    expect(root?.className).toContain("root-a");
    expect(root?.className).toContain("root-b");
    for (const [slot, cls] of [
      ["field-header", "header-x"],
      ["field-label", "label-x"],
      ["field-required-mark", "mark-x"],
      ["field-info", "info-x"],
      ["field-description", "helper-x"],
    ]) {
      expect(container.querySelector(`[data-slot=${slot}]`)?.className, slot).toContain(cls);
    }
  });
});

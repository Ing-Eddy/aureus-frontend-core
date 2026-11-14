import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { FieldInfo } from "./field-info";

function renderInfo(label?: string) {
  return render(
    <TooltipProvider>
      <FieldInfo id="info" content="Visible to others" label={label} />
    </TooltipProvider>,
  );
}

describe("FieldInfo", () => {
  it("is a 24px button named 'More information' by default", () => {
    renderInfo();
    const button = screen.getByRole("button", { name: "More information" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("size-6");
  });

  it("accepts a custom accessible name", () => {
    renderInfo("Más información");
    expect(screen.getByRole("button", { name: "Más información" })).toBeTruthy();
  });

  it("toggles the tooltip on click, so a tap opens it", () => {
    renderInfo();
    const button = screen.getByRole("button", { name: "More information" });
    expect(button.getAttribute("data-state")).toBe("closed");

    fireEvent.click(button);
    expect(button.getAttribute("data-state")).not.toBe("closed");
    expect(screen.getByRole("tooltip").textContent).toContain("Visible to others");

    fireEvent.click(button);
    expect(button.getAttribute("data-state")).toBe("closed");
  });

  it("keeps a screen-reader copy of the content for the input's description", () => {
    const { container } = renderInfo();
    const copy = container.querySelector("#info");
    expect(copy?.textContent).toBe("Visible to others");
    expect(copy?.className).toContain("sr-only");
  });
});

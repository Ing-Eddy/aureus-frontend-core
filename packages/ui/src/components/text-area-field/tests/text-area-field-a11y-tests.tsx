import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextAreaField } from "../text-area-field";

describe("TextAreaField accessibility", () => {
  it("uses the label as accessible name and marks required fields", () => {
    render(<TextAreaField label="Comment" required />);
    const field = screen.getByRole("textbox", { name: /^Comment/ });
    expect(field.getAttribute("aria-required")).toBe("true");
    expect(field.hasAttribute("required")).toBe(false);
  });

  it("describes the field with the consumer's ids, the counter, the helper and the info", () => {
    render(
      <TooltipProvider>
        <TextAreaField
          infoLabel="More information"
          countLabel={(count, max) =>
            max === undefined ? `${count} characters` : `${max - count} characters remaining`
          }
          label="Comment"
          aria-describedby="external"
          showCount
          maxLength={100}
          defaultValue="Hello"
          helperText="Be kind."
          info="Visible to everyone"
        />
      </TooltipProvider>,
    );
    const ids = screen.getByRole("textbox").getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(ids[0]).toBe("external");
    expect(ids.slice(1).map((id) => document.getElementById(id)?.textContent)).toEqual([
      "95 characters remaining",
      "Be kind.",
      "Visible to everyone",
    ]);
  });

  it("gives countLabel the count and maxLength, with or without a limit", () => {
    const countLabel = vi.fn((count: number, max?: number) =>
      max === undefined ? `${count} caracteres` : `Quedan ${max - count}`,
    );
    const { unmount } = render(
      <TextAreaField
        label="Comment"
        showCount
        maxLength={10}
        defaultValue="abc"
        countLabel={countLabel}
      />,
    );
    expect(countLabel).toHaveBeenLastCalledWith(3, 10);
    expect(document.body.textContent).toContain("Quedan 7");
    unmount();
    render(
      <TextAreaField
        countLabel={(count, max) =>
          max === undefined ? `${count} characters` : `${max - count} characters remaining`
        }
        label="Comment"
        showCount
        defaultValue="abc"
      />,
    );
    expect(document.body.textContent).toContain("3 characters");
  });

  it("exposes the error state and announces the message", () => {
    render(<TextAreaField label="Comment" error errorMessage="Too short" helperText="Be kind." />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Too short");
    expect(screen.queryByText("Be kind.")).toBeNull();
  });
});

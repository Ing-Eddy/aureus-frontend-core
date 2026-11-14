import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

  it("uses countLabel and the plain count without maxLength", () => {
    const { unmount } = render(
      <TextAreaField
        label="Comment"
        showCount
        maxLength={10}
        countLabel={(remaining) => `Quedan ${remaining}`}
      />,
    );
    expect(document.body.textContent).toContain("Quedan 10");
    unmount();
    render(<TextAreaField label="Comment" showCount defaultValue="abc" />);
    expect(document.body.textContent).toContain("3 characters");
  });

  it("exposes the error state and announces the message", () => {
    render(<TextAreaField label="Comment" error errorMessage="Too short" helperText="Be kind." />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Too short");
    expect(screen.queryByText("Be kind.")).toBeNull();
  });
});

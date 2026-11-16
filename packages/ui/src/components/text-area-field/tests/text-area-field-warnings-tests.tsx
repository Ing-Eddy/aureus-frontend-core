import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextAreaField } from "../text-area-field";

/** Renders the field as untyped code would, bypassing the required texts. */
const renderUntyped = (props: Record<string, unknown>) =>
  render(
    <TooltipProvider>
      <TextAreaField {...(props as unknown as Parameters<typeof TextAreaField>[0])} />
    </TooltipProvider>,
  );

afterEach(() => vi.restoreAllMocks());

describe("TextAreaField development warnings", () => {
  it("names the missing counter text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Bio", showCount: true });
    expect(warn).toHaveBeenCalledWith("TextAreaField: `showCount` needs `countLabel`.");
  });

  it("names the field and the missing name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({});
    expect(warn).toHaveBeenCalledWith(
      "TextAreaField: the text area has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`.",
    );
  });

  it("stays silent when every text is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderUntyped({ label: "Bio", showCount: true, countLabel: (count: number) => `${count}` });
    expect(warn).not.toHaveBeenCalled();
  });
});

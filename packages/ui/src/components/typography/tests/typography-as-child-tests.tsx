import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "..";

describe("Typography asChild", () => {
  it("renders the only child with the style, data attributes and props merged", () => {
    const { container } = render(
      <Typography asChild variant="body" tone="primary" id="help-link">
        <a href="/help" className="underline">
          Help
        </a>
      </Typography>,
    );
    expect(container.children).toHaveLength(1);
    const link = screen.getByRole("link", { name: "Help" });
    expect(link.getAttribute("href")).toBe("/help");
    expect(link.getAttribute("id")).toBe("help-link");
    expect(link.getAttribute("data-slot")).toBe("typography");
    expect(link.getAttribute("data-variant")).toBe("body");
    expect([...link.classList]).toEqual(
      expect.arrayContaining(["typography-body", "text-primary", "underline"]),
    );
  });

  it("wins over `as` in untyped JavaScript", () => {
    const untyped = { as: "h2", asChild: true } as unknown as { asChild: true };
    render(
      <Typography {...untyped}>
        <a href="/pricing">Pricing plans</a>
      </Typography>,
    );
    expect([...screen.getByRole("link", { name: "Pricing plans" }).classList]).toEqual(
      expect.arrayContaining(["typography-body"]),
    );
    expect(screen.queryByRole("heading")).toBeNull();
  });
});

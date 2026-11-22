import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography, typographyElements } from "..";

describe("Typography as", () => {
  it("changes the element and keeps the style of the variant", () => {
    render(
      <Typography variant="h2" as="h3">
        Title
      </Typography>,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent).toBe("Title");
    expect(heading.className).toBe("typography-h2");
    expect(heading.getAttribute("data-variant")).toBe("h2");
  });

  it.each(typographyElements)("renders as %s with the same classes", (element) => {
    render(
      <Typography variant="caption" tone="muted" as={element}>
        Text
      </Typography>,
    );
    const node = screen.getByText("Text");
    expect(node.tagName).toBe(element.toUpperCase());
    expect(node.className).toBe("typography-caption text-muted-foreground");
  });

  it("passes attributes of the chosen element", () => {
    render(
      <>
        <Typography variant="label" as="label" htmlFor="email">
          Email
        </Typography>
        <input id="email" />
        <Typography variant="caption" as="time" dateTime="2026-11-22">
          Today
        </Typography>
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText("Today").getAttribute("datetime")).toBe("2026-11-22");
  });
});

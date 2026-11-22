import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography, type TypographyProps } from "..";

type Modifier = [name: string, props: TypographyProps, className: string];

const modifiers: Modifier[] = [
  ["tone", { tone: "muted" }, "text-muted-foreground"],
  ["tone default", { tone: "default" }, "text-foreground"],
  ["weight", { weight: "bold" }, "font-bold"],
  ["align", { align: "center" }, "text-center"],
  ["wrap", { wrap: "balance" }, "text-balance"],
  ["truncate", { truncate: true }, "truncate"],
  ["lineClamp", { lineClamp: 2 }, "line-clamp-2"],
  ["italic", { italic: true }, "italic"],
  ["tabularNums", { tabularNums: true }, "tabular-nums"],
];

const classesOf = (props: TypographyProps) => {
  const { unmount } = render(
    <Typography variant="body-sm" {...props}>
      Text
    </Typography>,
  );
  const element = screen.getByText("Text");
  const result = { tag: element.tagName, classes: [...element.classList] };
  unmount();
  return result;
};

describe("Typography modifiers are independent", () => {
  it.each(modifiers)("%s adds only its own class", (_name, props, className) => {
    const bare = classesOf({});
    const modified = classesOf(props);
    expect(modified.tag).toBe(bare.tag);
    expect(modified.classes).toEqual([...bare.classes, className]);
  });

  it("combines every modifier without one changing another", () => {
    const all = classesOf({
      tone: "destructive",
      weight: "medium",
      align: "end",
      wrap: "pretty",
      lineClamp: 3,
      italic: true,
      tabularNums: true,
    });
    expect(all.classes).toEqual([
      "typography-body-sm",
      "text-destructive",
      "font-medium",
      "text-end",
      "text-pretty",
      "line-clamp-3",
      "italic",
      "tabular-nums",
    ]);
  });

  it("applies className last, so it wins over the modifiers", () => {
    render(
      <Typography tone="muted" weight="bold" className="text-foreground font-light">
        Text
      </Typography>,
    );
    const element = screen.getByText("Text");
    expect([...element.classList]).toEqual(
      expect.arrayContaining(["typography-body", "text-foreground", "font-light"]),
    );
    expect(element.classList.contains("text-muted-foreground")).toBe(false);
    expect(element.classList.contains("font-bold")).toBe(false);
  });

  it("keeps the variant class with a weight", () => {
    expect(classesOf({ variant: "h4", weight: "regular" }).classes).toEqual([
      "typography-h4",
      "font-normal",
    ]);
  });

  it("lets lineClamp win over truncate in untyped JavaScript", () => {
    const untyped = { truncate: true, lineClamp: 2 } as unknown as TypographyProps;
    expect(classesOf(untyped).classes).toEqual(["typography-body-sm", "line-clamp-2"]);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextAreaField } from "../text-area-field";

const counter = (container: HTMLElement) =>
  container.querySelector("[data-slot=field-counter]")?.textContent;

function Controlled() {
  const [value, setValue] = useState("");
  return (
    <TextAreaField
      label="Bio"
      showCount
      maxLength={50}
      value={value}
      onChange={(event) => setValue(event.target.value.toUpperCase())}
    />
  );
}

describe("TextAreaField states and props", () => {
  it("works uncontrolled with multiple lines, and the counter follows", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <TextAreaField
        label="Bio"
        defaultValue="Hello"
        showCount
        maxLength={50}
        onChange={onChange}
      />,
    );
    expect(counter(container)).toBe("5/50");
    const field = screen.getByRole("textbox") as HTMLTextAreaElement;
    await userEvent.type(field, "{Enter}world");
    expect(field.value).toBe("Hello\nworld");
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(counter(container)).toBe("11/50");
  });

  it("works controlled, and the counter follows the value", async () => {
    const { container } = render(<Controlled />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("AB");
    expect(counter(container)).toBe("2/50");
  });

  it("forwards the ref to the textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(<TextAreaField label="Bio" ref={ref} />);
    expect(ref.current).toBe(container.querySelector("textarea"));
  });

  it("uses minRows as the native rows and has no rows prop", () => {
    const { container } = render(<TextAreaField label="Bio" minRows={4} />);
    expect(container.querySelector("textarea")?.getAttribute("rows")).toBe("4");
    // @ts-expect-error `rows` is replaced by `minRows`.
    const element = <TextAreaField label="Bio" rows={2} />;
    expect(element).toBeTruthy();
  });

  it("merges classNames for the footer and the textarea", () => {
    const { container } = render(
      <TextAreaField
        label="Bio"
        showCount
        classNames={{ footer: "footer-x", input: "input-x", action: "action-x" }}
        action={{ children: "Save" }}
      />,
    );
    expect(container.querySelector("[data-align=block-end]")?.className).toContain("footer-x");
    expect(container.querySelector("textarea")?.className).toContain("input-x");
    expect(screen.getByRole("button", { name: "Save" }).className).toContain("action-x");
  });
});

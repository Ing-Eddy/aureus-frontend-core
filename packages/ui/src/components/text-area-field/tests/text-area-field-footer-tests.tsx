import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextAreaField } from "../text-area-field";
import type { TextAreaFieldProps } from "../text-area-field-types";

const footer = (container: HTMLElement) =>
  container.querySelector("[data-slot=input-group-addon][data-align=block-end]");

const renderField = (props: Partial<TextAreaFieldProps> = {}) =>
  render(<TextAreaField label="Comment" {...props} />);

describe("TextAreaField footer bar", () => {
  it("is not rendered when there is nothing to show", () => {
    const { container } = renderField();
    expect(footer(container)).toBeNull();
  });

  it("shows the spinner, the counter and the action, in that order", () => {
    const { container } = renderField({
      loading: true,
      showCount: true,
      maxLength: 10,
      action: { children: "Post" },
    });
    const slots = [...(footer(container)?.children ?? [])]
      .map((child) => child.getAttribute("data-slot"))
      .filter(Boolean);
    expect(slots).toEqual(["field-loading", "field-counter", "field-action"]);
    expect(screen.getByRole("button", { name: "Post" }).className).toContain("ms-auto");
  });

  it("disables the action while loading or disabled, but not the field alone", () => {
    const { unmount } = renderField({ loading: true, action: { children: "Post" } });
    expect((screen.getByRole("button", { name: "Post" }) as HTMLButtonElement).disabled).toBe(true);
    unmount();
    renderField({ action: { children: "Post", disabled: true } });
    expect((screen.getByRole("button", { name: "Post" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(false);
  });

  it("presses the action with Ctrl+Enter and Cmd+Enter", async () => {
    const onClick = vi.fn();
    renderField({ actionShortcut: true, action: { children: "Post", onClick } });
    const field = screen.getByRole("textbox");
    field.focus();
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    await userEvent.keyboard("{Meta>}{Enter}{/Meta}");
    expect(onClick).toHaveBeenCalledTimes(2);
    expect((field as HTMLTextAreaElement).value).toBe("");
  });

  it("does not press a disabled action, nor without actionShortcut", async () => {
    const onClick = vi.fn();
    const { unmount } = renderField({
      actionShortcut: true,
      action: { children: "Post", onClick, disabled: true },
    });
    screen.getByRole("textbox").focus();
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    unmount();
    renderField({ action: { children: "Post", onClick } });
    screen.getByRole("textbox").focus();
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps Enter alone as a new line", async () => {
    const onClick = vi.fn();
    renderField({ actionShortcut: true, action: { children: "Post", onClick } });
    const field = screen.getByRole("textbox") as HTMLTextAreaElement;
    await userEvent.type(field, "a{Enter}b");
    expect(field.value).toBe("a\nb");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes the shortcut only when it is on", () => {
    const { unmount } = renderField({ actionShortcut: true, action: { children: "Post" } });
    expect(screen.getByRole("button", { name: "Post" }).getAttribute("aria-keyshortcuts")).toBe(
      "Control+Enter Meta+Enter",
    );
    unmount();
    renderField({ action: { children: "Post" } });
    expect(screen.getByRole("button", { name: "Post" }).hasAttribute("aria-keyshortcuts")).toBe(
      false,
    );
  });

  it("runs the consumer's onKeyDown first, which can cancel the shortcut", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    renderField({ actionShortcut: true, onKeyDown, action: { children: "Post", onClick } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", ctrlKey: true });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });
});

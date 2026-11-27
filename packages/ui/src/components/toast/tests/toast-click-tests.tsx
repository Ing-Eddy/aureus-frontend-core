import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import { onlyToast, part, renderToaster, resetToasts, run, toastElements } from "./render-toaster";

afterEach(resetToasts);

const clickable = (onClick = vi.fn(), options = {}) => {
  renderToaster({ closeButton: true, closeLabel: "Close" });
  const id = run(() => toast.info("Message", { description: "Read it", onClick, ...options }));
  return { id, onClick };
};

describe("a clickable toast", () => {
  it("renders the title as a button and marks the toast", () => {
    clickable();
    expect(screen.getByRole("button", { name: "Message" })).toBeDefined();
    expect(onlyToast().hasAttribute("data-clickable")).toBe(true);
    expect(onlyToast().getAttribute("aria-labelledby")).toBe(part("toast-title")?.id);
  });

  it("calls onClick once with its context when the card is pressed, and closes", async () => {
    const { id, onClick } = clickable();
    await userEvent.click(screen.getByText("Read it"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toMatchObject({ id });
    expect(toastElements()).toEqual([]);
  });

  it("calls onClick once when the title is pressed", async () => {
    const { onClick } = clickable();
    await userEvent.click(screen.getByRole("button", { name: "Message" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(["{Enter}", " "])("works from the keyboard with %j", async (key) => {
    const { onClick } = clickable();
    screen.getByRole("button", { name: "Message" }).focus();
    await userEvent.keyboard(key);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("stays open with keepOpenOnClick", async () => {
    const { onClick } = clickable(vi.fn(), { keepOpenOnClick: true });
    await userEvent.click(screen.getByText("Read it"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(toastElements()).toHaveLength(1);
  });

  it("ignores the close button", async () => {
    const { onClick } = clickable();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ignores controls inside the toast", async () => {
    const onClick = vi.fn();
    renderToaster();
    run(() =>
      toast.info("Message", {
        onClick,
        description: (
          <>
            <a href="#more">More</a>
            <input aria-label="Reply" />
          </>
        ),
      }),
    );
    await userEvent.click(screen.getByRole("link", { name: "More" }));
    await userEvent.click(screen.getByRole("textbox", { name: "Reply" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ignores the row of actions, where a press on a disabled button lands", () => {
    const { onClick } = clickable(vi.fn(), { actions: [{ label: "Wait", disabled: true }] });
    // A disabled button takes no pointer events, so the browser sends the click to its row.
    fireEvent.click(part("toast-actions") as HTMLElement);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ignores a drag", () => {
    const { onClick } = clickable();
    const text = screen.getByText("Read it");
    fireEvent.pointerDown(text, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.click(text, { clientX: 20, clientY: 0 });
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.pointerDown(text, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.click(text, { clientX: 2, clientY: 1 });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("ignores a press that selected text", () => {
    const { onClick } = clickable();
    vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "Read" } as Selection);
    fireEvent.click(screen.getByText("Read it"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lets the handler update the toast through its context", async () => {
    clickable(
      vi.fn((context) => context.update({ title: "Opened" })),
      { keepOpenOnClick: true },
    );
    await userEvent.click(screen.getByText("Read it"));
    expect(screen.getByRole("button", { name: "Opened" })).toBeDefined();
  });
});

describe("a toast without onClick", () => {
  it("has no title button and stays open when pressed", async () => {
    renderToaster();
    run(() => toast.info("Message"));
    expect(screen.queryByRole("button")).toBeNull();
    expect(onlyToast().hasAttribute("data-clickable")).toBe(false);
    await userEvent.click(screen.getByText("Message"));
    expect(toastElements()).toHaveLength(1);
  });
});

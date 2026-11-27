import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import { part, renderToaster, resetToasts, run, toastElements } from "./render-toaster";

afterEach(resetToasts);

const button = (name: string) => screen.getByRole("button", { name });

describe("actions", () => {
  it("renders one button per action, in order, with its variant and state", () => {
    renderToaster();
    run(() =>
      toast.info("a", {
        actions: [{ label: "Undo" }, { label: "Open", variant: "default", disabled: true }],
      }),
    );
    const buttons = Array.from(part("toast-actions")?.querySelectorAll("button") ?? []);
    expect(buttons.map((entry) => entry.textContent)).toEqual(["Undo", "Open"]);
    expect(buttons.map((entry) => entry.dataset.variant)).toEqual(["outline", "default"]);
    expect(buttons.map((entry) => entry.disabled)).toEqual([false, true]);
    expect(buttons.map((entry) => entry.type)).toEqual(["button", "button"]);
  });

  it("calls the handler with the context and closes the toast", async () => {
    const onClick = vi.fn();
    renderToaster();
    const id = run(() => toast.info("a", { actions: [{ label: "Undo", onClick }] }));
    await userEvent.click(button("Undo"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toMatchObject({ id });
    expect(toastElements()).toEqual([]);
  });

  it("closes the toast without a handler", async () => {
    renderToaster();
    run(() => toast.info("a", { actions: [{ label: "Ok" }] }));
    await userEvent.click(button("Ok"));
    expect(toastElements()).toEqual([]);
  });

  it("keeps the toast open with keepOpen, so the handler can replace it", async () => {
    renderToaster();
    run(() =>
      toast.info("Delete?", {
        actions: [
          {
            label: "Yes",
            keepOpen: true,
            onClick: ({ id }) => toast.success("Deleted", { id }),
          },
        ],
      }),
    );
    await userEvent.click(button("Yes"));
    expect(toastElements().map((element) => element.textContent)).toEqual(["Deleted"]);
  });

  it("does not trigger the click of a clickable toast", async () => {
    const onClick = vi.fn();
    renderToaster();
    run(() => toast.info("a", { onClick, actions: [{ label: "Undo", keepOpen: true }] }));
    await userEvent.click(button("Undo"));
    expect(onClick).not.toHaveBeenCalled();
    expect(toastElements()).toHaveLength(1);
  });
});

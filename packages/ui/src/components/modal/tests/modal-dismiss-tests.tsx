import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => vi.unstubAllGlobals());

const modes = [
  ["dialog", WIDE],
  ["drawer", NARROW],
] as const;

describe.each(modes)("Modal dismissal (%s)", (_mode, width) => {
  it("closeOnEscape={false} blocks only Escape", async () => {
    mockViewport(width);
    const { open, user, dialog, overlay, queryDialog } = renderModal({
      modal: { closeOnEscape: false },
    });
    await open();
    await user.keyboard("{Escape}");
    expect(dialog()).toBeTruthy();

    await user.click(overlay() as HTMLElement);
    await finishAnimations();
    expect(queryDialog()).toBeNull();
  });

  it("closeOnOutsidePress={false} blocks only outside presses", async () => {
    mockViewport(width);
    const { open, user, dialog, overlay, queryDialog } = renderModal({
      modal: { closeOnOutsidePress: false },
    });
    await open();
    await user.click(overlay() as HTMLElement);
    expect(dialog()).toBeTruthy();

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(queryDialog()).toBeNull();
  });

  it("modal={false} shows no overlay, keeps the page usable and still closes with Escape", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, overlay, queryDialog } = renderModal({
      modal: { modal: false, onOpenChange },
    });
    await open();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(overlay()).toBeNull();
    // Radix disables pointer events on the page under a drawer; a non-modal one restores them.
    expect(document.body.style.pointerEvents).not.toBe("none");

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "escape-key" });
  });

  it("modal={false} still closes with an outside press", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, queryDialog } = renderModal({ modal: { modal: false, onOpenChange } });
    await open();
    // Vaul keeps the page hidden from assistive technology even when it is not modal.
    await user.click(screen.getByRole("button", { name: "Outside", hidden: true }));
    await finishAnimations();

    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "outside-press" });
  });

  it("modal={false} toggles with the trigger instead of closing and reopening", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, trigger, queryDialog } = renderModal({
      modal: { modal: false, onOpenChange },
    });
    await open();
    await user.click(trigger());
    await finishAnimations();

    expect(queryDialog()).toBeNull();
    expect(onOpenChange.mock.calls).toEqual([
      [true, { reason: "trigger" }],
      [false, { reason: "trigger" }],
    ]);
  });

  it("the consumer's onEscapeKeyDown can prevent closing", async () => {
    mockViewport(width);
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
    const { open, user, dialog } = renderModal({ content: { onEscapeKeyDown } });
    await open();
    await user.keyboard("{Escape}");

    expect(onEscapeKeyDown).toHaveBeenCalledOnce();
    expect(dialog()).toBeTruthy();
  });

  it("the consumer's onInteractOutside can prevent closing", async () => {
    mockViewport(width);
    const onInteractOutside = vi.fn((event: Event) => event.preventDefault());
    const { open, user, dialog, overlay } = renderModal({ content: { onInteractOutside } });
    await open();
    await user.click(overlay() as HTMLElement);

    expect(onInteractOutside).toHaveBeenCalledOnce();
    expect(dialog()).toBeTruthy();
  });
});

describe("Modal dismissal without swipe (drawer)", () => {
  it("closeOnSwipe={false} keeps Escape and outside presses working", async () => {
    mockViewport(NARROW);
    const onOpenChange = vi.fn();
    const { open, user, overlay, queryDialog } = renderModal({
      modal: { closeOnSwipe: false, onOpenChange },
    });
    await open();
    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "escape-key" });

    await open();
    await user.click(overlay() as HTMLElement);
    await finishAnimations();
    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "outside-press" });
  });

  it("closeOnSwipe={false} with closeOnEscape={false} blocks Escape", async () => {
    mockViewport(NARROW);
    const { open, user, dialog } = renderModal({
      modal: { closeOnSwipe: false, closeOnEscape: false },
    });
    await open();
    await user.keyboard("{Escape}");
    expect(dialog()).toBeTruthy();
  });

  it("closeOnSwipe has no effect on the dialog", async () => {
    mockViewport(WIDE);
    const { open, user, overlay, queryDialog } = renderModal({ modal: { closeOnSwipe: false } });
    await open();
    await user.click(overlay() as HTMLElement);
    expect(queryDialog()).toBeNull();
  });
});

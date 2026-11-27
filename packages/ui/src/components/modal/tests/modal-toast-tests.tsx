import { act, cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from "@/components/toast";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => {
  cleanup();
  toast.dismiss();
  vi.unstubAllGlobals();
});

const modes = [
  ["dialog", WIDE],
  ["drawer", NARROW],
] as const;

// Toasts are dialogs too, so the panel is found by its name.
const panel = () => screen.queryByRole("dialog", { name: "Edit profile", hidden: true });

describe.each(modes)("Toasts over a modal (%s)", (_mode, width) => {
  async function openUnderToast() {
    mockViewport(width);
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = renderModal({
      modal: { onOpenChange },
      outside: <Toaster label="Notifications" />,
    });
    await rendered.open();
    act(() => {
      toast.info("Saved", { actions: [{ label: "Undo", onClick: onAction, keepOpen: true }] });
    });
    return { ...rendered, onAction, onOpenChange };
  }

  it("runs a toast action without closing the modal", async () => {
    const { user, onAction, onOpenChange } = await openUnderToast();
    await user.click(screen.getByRole("button", { name: "Undo", hidden: true }));
    await finishAnimations();
    expect(onAction).toHaveBeenCalledOnce();
    expect(panel()).not.toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the notifications available to screen readers", async () => {
    await openUnderToast();
    const region = document.querySelector('[data-slot="toast-viewport"]');
    expect(region?.closest('[aria-hidden="true"], [inert]')).toBeNull();
  });

  it("still closes with a press elsewhere outside", async () => {
    const { user, overlay } = await openUnderToast();
    await user.click(overlay() as HTMLElement);
    await finishAnimations();
    expect(panel()).toBeNull();
  });
});

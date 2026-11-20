import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => vi.unstubAllGlobals());

describe("Modal mode", () => {
  it("is a dialog on a wide viewport", async () => {
    mockViewport(WIDE);
    const { open } = renderModal();
    expect((await open()).dataset.mode).toBe("dialog");
  });

  it("is a drawer attached to the bottom on a narrow viewport", async () => {
    mockViewport(NARROW);
    const { open } = renderModal();
    const panel = await open();
    expect(panel.dataset.mode).toBe("drawer");
    expect(panel.dataset.vaulDrawerDirection).toBe("bottom");
  });

  it("switches at the default breakpoint of 768 px", async () => {
    mockViewport(768);
    const { open } = renderModal();
    expect((await open()).dataset.mode).toBe("dialog");
  });

  it("uses a custom breakpoint", async () => {
    mockViewport(900);
    const { open } = renderModal({ modal: { breakpoint: 1024 } });
    expect((await open()).dataset.mode).toBe("drawer");
  });

  it.each(["dialog", "drawer"] as const)("forces the %s mode", async (mode) => {
    mockViewport(mode === "drawer" ? 1440 : NARROW);
    const { open } = renderModal({ modal: { mode } });
    expect((await open()).dataset.mode).toBe(mode);
  });

  it("is a dialog without matchMedia", async () => {
    vi.stubGlobal("matchMedia", undefined);
    const { open } = renderModal();
    expect((await open()).dataset.mode).toBe("dialog");
  });

  it("follows the viewport while open and keeps the trigger node", async () => {
    const viewport = mockViewport(WIDE);
    const onModeChange = vi.fn();
    const onOpenChange = vi.fn();
    const { open, trigger, dialog } = renderModal({ modal: { onModeChange, onOpenChange } });
    await open();
    const triggerNode = trigger();

    viewport.resize(600);
    await finishAnimations();

    expect(dialog().dataset.mode).toBe("drawer");
    expect(onModeChange).toHaveBeenCalledExactlyOnceWith("drawer");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(trigger()).toBe(triggerNode);
    expect(trigger()).toHaveProperty("ariaExpanded", "true");
  });

  it("keeps the mode it opened with under lockModeWhileOpen", async () => {
    const viewport = mockViewport(WIDE);
    const onModeChange = vi.fn();
    const { open, user, dialog, queryDialog } = renderModal({
      modal: { lockModeWhileOpen: true, onModeChange },
    });
    await open();

    viewport.resize(600);
    expect(dialog().dataset.mode).toBe("dialog");
    expect(onModeChange).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(queryDialog()).toBeNull();
    expect(onModeChange).toHaveBeenCalledExactlyOnceWith("drawer");
    expect((await open()).dataset.mode).toBe("drawer");
  });

  it("does not remount the trigger when the mode changes while closed", async () => {
    const viewport = mockViewport(WIDE);
    const { trigger, user } = renderModal();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    const triggerNode = trigger();
    trigger().focus();

    viewport.resize(NARROW);

    expect(trigger()).toBe(triggerNode);
    expect(document.activeElement).toBe(triggerNode);
  });
});

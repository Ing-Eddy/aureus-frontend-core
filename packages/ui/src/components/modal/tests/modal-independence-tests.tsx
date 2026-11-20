import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModalDescription, ModalTitle } from "..";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => vi.unstubAllGlobals());

const widthClasses = (panel: HTMLElement) =>
  [...panel.classList].filter((name) => /max-w|^w-|:w-|h-\[calc/.test(name)).sort();

describe("Modal props are independent", () => {
  it.each([
    ["dialog", WIDE],
    ["drawer", NARROW],
  ] as const)("closeButton keeps every way of closing (%s)", async (_mode, width) => {
    mockViewport(width);
    const { open, user, overlay, queryDialog } = renderModal({
      content: { closeButton: true, closeLabel: "Close" },
    });
    await open();
    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(queryDialog()).toBeNull();

    await open();
    await user.click(overlay() as HTMLElement);
    await finishAnimations();
    expect(queryDialog()).toBeNull();
  });

  it("modal={false} keeps closeOnEscape={false} and closeOnOutsidePress={false}", async () => {
    mockViewport(WIDE);
    const { open, user, dialog } = renderModal({
      modal: { modal: false, closeOnEscape: false, closeOnOutsidePress: false },
    });
    await open();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(dialog()).toBeTruthy();
  });

  it("mode does not change drawerDirection", async () => {
    mockViewport(WIDE);
    const { open } = renderModal({ modal: { mode: "drawer" } });
    expect((await open()).dataset.vaulDrawerDirection).toBe("bottom");
  });

  it("drawerDirection is applied and shows no handle on the sides", async () => {
    mockViewport(NARROW);
    const { open } = renderModal({ modal: { drawerDirection: "right" } });
    const panel = await open();
    expect(panel.dataset.vaulDrawerDirection).toBe("right");
    expect(panel.querySelector("[data-slot=modal-handle]")).toBeNull();
  });

  it("size does not change the drawer", async () => {
    mockViewport(NARROW);
    const small = renderModal({ content: { size: "sm" } });
    const smallClasses = widthClasses(await small.open());
    small.unmount();

    const large = renderModal({ content: { size: "xl" } });
    const panel = await large.open();
    expect(widthClasses(panel)).toEqual(smallClasses);
    expect(panel.dataset.size).toBe("xl");
  });

  it("size changes the dialog width", async () => {
    mockViewport(WIDE);
    const { open } = renderModal({ content: { size: "lg" } });
    const panel = await open();
    expect(panel.className).toContain("sm:max-w-2xl");
    expect(panel.className).not.toContain("sm:max-w-sm");
  });

  it("a visually hidden title does not hide the description", async () => {
    mockViewport(WIDE);
    const { open } = renderModal({
      children: (
        <>
          <ModalTitle visuallyHidden>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </>
      ),
    });
    await open();
    expect(screen.getByText("Description").className).not.toContain("sr-only");
  });

  it("lockModeWhileOpen does not change the breakpoint", async () => {
    mockViewport(900);
    const { open } = renderModal({ modal: { lockModeWhileOpen: true, breakpoint: 1024 } });
    expect((await open()).dataset.mode).toBe("drawer");
  });

  it("drawerHandle={false} hides the handle and nothing else changes", async () => {
    mockViewport(NARROW);
    const { open } = renderModal({ content: { drawerHandle: false } });
    const panel = await open();
    expect(panel.querySelector("[data-slot=modal-handle]")).toBeNull();
    expect(panel.dataset.mode).toBe("drawer");
  });

  it("drawer props have no effect on the dialog", async () => {
    mockViewport(WIDE);
    const plain = renderModal();
    const plainClasses = (await plain.open()).className;
    plain.unmount();

    const { open } = renderModal({
      modal: { drawerSnapPoints: [0.5, 1], drawerDirection: "top", drawerHandleOnly: true },
    });
    const panel = await open();
    expect(panel.className).toBe(plainClasses);
    expect(panel.hasAttribute("data-vaul-drawer-direction")).toBe(false);
  });

  it("a bare modal has no close button, overlay classes or handle extras", async () => {
    mockViewport(WIDE);
    const { open } = renderModal();
    const panel = await open();
    expect(panel.dataset.size).toBe("sm");
    expect(panel.querySelector("[data-slot=modal-close-button]")).toBeNull();
  });
});

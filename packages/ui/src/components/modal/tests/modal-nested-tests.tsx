import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal, ModalContent, ModalTitle, ModalTrigger } from "..";
import { finishAnimations, mockViewport, NARROW, WIDE } from "./render-modal";

afterEach(() => vi.unstubAllGlobals());

function Nested() {
  return (
    <Modal>
      <ModalTrigger>Open parent</ModalTrigger>
      <ModalContent>
        <ModalTitle>Parent</ModalTitle>
        <Modal>
          <ModalTrigger>Open child</ModalTrigger>
          <ModalContent>
            <ModalTitle>Child</ModalTitle>
            <input aria-label="Child input" />
          </ModalContent>
        </Modal>
      </ModalContent>
    </Modal>
  );
}

describe.each([
  ["dialog", WIDE],
  ["drawer", NARROW],
] as const)("Nested modals (%s)", (mode, width) => {
  it("closing the nested modal keeps the parent open and returns focus to its trigger", async () => {
    mockViewport(width);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Nested />);
    await user.click(screen.getByRole("button", { name: "Open parent" }));
    await user.click(screen.getByRole("button", { name: "Open child" }));
    const child = screen.getByRole("dialog", { name: "Child" });
    expect(child.dataset.mode).toBe(mode);
    expect(child.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    await finishAnimations();

    expect(screen.queryByRole("dialog", { name: "Child" })).toBeNull();
    expect(screen.getByRole("dialog", { name: "Parent" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open child" }));
  });
});

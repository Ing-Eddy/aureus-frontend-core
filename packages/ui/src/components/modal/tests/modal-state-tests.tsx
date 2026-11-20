import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Modal,
  ModalClose,
  ModalContent,
  type ModalOpenChangeReason,
  ModalTitle,
  ModalTrigger,
  useModal,
} from "..";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const modes = [
  ["dialog", WIDE],
  ["drawer", NARROW],
] as const;

function HookButtons() {
  const { open, mode, close, setOpen } = useModal();
  return (
    <>
      <output aria-label="state">{`${open}:${mode}`}</output>
      <button type="button" onClick={close}>
        Hook close
      </button>
      <button type="button" onClick={() => setOpen(true)}>
        Hook open
      </button>
    </>
  );
}

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        Toggle
      </button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalClose>Done</ModalClose>
        </ModalContent>
      </Modal>
    </>
  );
}

describe.each(modes)("Modal state (%s)", (mode, width) => {
  it("opens and closes when uncontrolled, reporting each reason", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, queryDialog } = renderModal({ modal: { onOpenChange } });
    await open();
    await user.keyboard("{Escape}");
    await finishAnimations();

    expect(queryDialog()).toBeNull();
    expect(onOpenChange.mock.calls).toEqual([
      [true, { reason: "trigger" }],
      [false, { reason: "escape-key" }],
    ]);
  });

  it("opens with defaultOpen", () => {
    mockViewport(width);
    renderModal({ modal: { defaultOpen: true } });
    expect(screen.getByRole("dialog")).toHaveProperty("dataset.mode", mode);
  });

  it("stays open when controlled and onOpenChange ignores the request", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { user, dialog } = renderModal({ modal: { open: true, onOpenChange } });
    await user.keyboard("{Escape}");
    await finishAnimations();

    expect(onOpenChange).toHaveBeenCalledWith(false, { reason: "escape-key" });
    expect(dialog()).toBeTruthy();
  });

  it("follows a controlled open prop", async () => {
    mockViewport(width);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Done" }));
    await finishAnimations();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it.each<[string, ModalOpenChangeReason]>([
    ["Close", "close"],
    ["Hook close", "close"],
    ["X", "close-button"],
  ])("closes with %s and the reason %s", async (button, reason) => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, queryDialog } = renderModal({
      modal: { onOpenChange },
      content: { closeButton: true, closeLabel: "X" },
      children: (
        <>
          <ModalTitle>Title</ModalTitle>
          <ModalClose>Close</ModalClose>
          <HookButtons />
        </>
      ),
    });
    await open();
    await user.click(screen.getByRole("button", { name: button }));
    await finishAnimations();

    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason });
  });

  it("closes with an outside press and the reason outside-press", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const { open, user, overlay, queryDialog } = renderModal({ modal: { onOpenChange } });
    await open();
    await user.click(overlay() as HTMLElement);
    await finishAnimations();

    expect(queryDialog()).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "outside-press" });
  });

  it("exposes the state and mode through useModal, and opens with setOpen(true)", async () => {
    mockViewport(width);
    const onOpenChange = vi.fn();
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(
      <Modal onOpenChange={onOpenChange}>
        <HookButtons />
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByRole("status", { name: "state" }).textContent).toBe(`false:${mode}`);

    await user.click(screen.getByRole("button", { name: "Hook open" }));

    expect(onOpenChange).toHaveBeenCalledWith(true, { reason: "trigger" });
    expect(screen.getByRole("status", { name: "state", hidden: true }).textContent).toBe(
      `true:${mode}`,
    );
  });

  it("calls onOpenChangeComplete once per change, after the animations", async () => {
    mockViewport(width);
    const onOpenChangeComplete = vi.fn();
    const { open, user } = renderModal({ modal: { onOpenChangeComplete } });
    await open();
    await finishAnimations();
    expect(onOpenChangeComplete.mock.calls).toEqual([[true]]);

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(onOpenChangeComplete.mock.calls).toEqual([[true], [false]]);
  });
});

describe("Modal onOpenChangeComplete fallback", () => {
  it("reports the opening when no animation event arrives", async () => {
    mockViewport(NARROW);
    const onOpenChangeComplete = vi.fn();
    const { open } = renderModal({ modal: { onOpenChangeComplete } });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await open();
    expect(onOpenChangeComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(700));

    expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("does not report again when the mode changes while open", async () => {
    const viewport = mockViewport(WIDE);
    const onOpenChangeComplete = vi.fn();
    const { open } = renderModal({ modal: { onOpenChangeComplete } });
    await open();
    expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(true);

    viewport.resize(NARROW);
    await finishAnimations();

    expect(onOpenChangeComplete).toHaveBeenCalledTimes(1);
  });
});

describe("Modal parts outside the root", () => {
  it.each([
    ["ModalTrigger", <ModalTrigger key="t" />],
    ["ModalContent", <ModalContent key="c" />],
    ["ModalClose", <ModalClose key="x" />],
    ["ModalTitle", <ModalTitle key="h" />],
  ])("%s throws a developer error", (name, element) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(element)).toThrow(`${name} must be used inside Modal.`);
  });

  it("useModal throws outside Modal", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<HookButtons />)).toThrow("useModal must be used inside Modal.");
  });

  it("a section outside ModalContent throws a developer error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Modal>
          <ModalTitle>Title</ModalTitle>
        </Modal>,
      ),
    ).toThrow("ModalTitle must be used inside ModalContent.");
  });
});

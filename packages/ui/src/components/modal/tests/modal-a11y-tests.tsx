import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "..";
import { missingTitleWarning } from "../hooks";
import { finishAnimations, mockViewport, NARROW, renderModal, WIDE } from "./render-modal";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const modes = [
  ["dialog", WIDE],
  ["drawer", NARROW],
] as const;

function Page({ open }: { open: boolean }) {
  return (
    <>
      <button type="button">Before</button>
      <Modal open={open}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <input aria-label="Inside" />
        </ModalContent>
      </Modal>
    </>
  );
}

describe.each(modes)("Modal accessibility (%s)", (_mode, width) => {
  it("names the dialog with the title and describes it with the description", async () => {
    mockViewport(width);
    const { open } = renderModal();
    const panel = await open();
    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBe(panel);
    expect(screen.getByRole("dialog", { description: "Change your public name." })).toBe(panel);
  });

  it("has no aria-describedby without a description, and Radix does not warn", async () => {
    mockViewport(width);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { open } = renderModal({ children: <ModalTitle>Filters</ModalTitle> });
    const panel = await open();
    expect(panel.hasAttribute("aria-describedby")).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps the accessible name of a visually hidden title", async () => {
    mockViewport(width);
    const { open } = renderModal({
      children: (
        <>
          <ModalTitle visuallyHidden>Filters</ModalTitle>
          <ModalDescription>Narrow the list.</ModalDescription>
        </>
      ),
    });
    await open();
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeTruthy();
    expect(screen.getByText("Filters").className).toContain("sr-only");
    expect(screen.getByText("Narrow the list.").className).not.toContain("sr-only");
  });

  it("moves focus inside on open and back to the trigger on close", async () => {
    mockViewport(width);
    const { open, user, trigger, dialog } = renderModal();
    await open();
    expect(dialog().contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(document.activeElement).toBe(trigger());
  });

  it("focuses initialFocusRef on open and returnFocusRef on close", async () => {
    mockViewport(width);
    const initialFocusRef = createRef<HTMLInputElement>();
    const returnFocusRef = createRef<HTMLButtonElement>();
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(
      <>
        <Modal>
          <ModalTrigger>Open</ModalTrigger>
          <ModalContent initialFocusRef={initialFocusRef} returnFocusRef={returnFocusRef}>
            <ModalTitle>Title</ModalTitle>
            <ModalBody>
              <input aria-label="First" />
              <input aria-label="Second" ref={initialFocusRef} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <button type="button" ref={returnFocusRef}>
          Elsewhere
        </button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Second" }));

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Elsewhere" }));
  });

  it("returns focus to the element focused before opening when there is no trigger", async () => {
    mockViewport(width);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { rerender } = render(<Page open={false} />);
    await user.click(screen.getByRole("button", { name: "Before" }));
    rerender(<Page open />);
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Inside" }));

    rerender(<Page open={false} />);
    await finishAnimations();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Before" }));
  });

  it("calls the consumer's focus handlers, which can take over", async () => {
    mockViewport(width);
    const onOpenAutoFocus = vi.fn((event: Event) => event.preventDefault());
    const onCloseAutoFocus = vi.fn((event: Event) => event.preventDefault());
    const { open, user, trigger } = renderModal({
      content: { onOpenAutoFocus, onCloseAutoFocus },
    });
    await open();
    expect(onOpenAutoFocus).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(trigger());

    await user.keyboard("{Escape}");
    await finishAnimations();
    expect(onCloseAutoFocus).toHaveBeenCalledOnce();
  });

  it("names the close button with closeLabel and renders no text of its own", async () => {
    mockViewport(width);
    const { open } = renderModal({
      content: { closeButton: true, closeLabel: "Cerrar" },
      children: <ModalTitle>Título</ModalTitle>,
    });
    const panel = await open();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeTruthy();
    expect(panel.textContent).toBe("Título");
  });

  it("renders no close button by default", async () => {
    mockViewport(width);
    const { open } = renderModal({ children: <ModalTitle>Título</ModalTitle> });
    const panel = await open();
    expect(panel.querySelectorAll("button")).toHaveLength(0);
    expect(panel.textContent).toBe("Título");
  });

  it("warns once when the panel has no title", async () => {
    mockViewport(width);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { open, user } = renderModal({ children: <ModalBody>Body</ModalBody> });
    await open();
    await user.keyboard("{Escape}");
    await finishAnimations();
    await open();

    expect(warn.mock.calls.filter(([message]) => message === missingTitleWarning)).toHaveLength(1);
  });

  it("warns once when closeButton has no closeLabel in untyped code", async () => {
    mockViewport(width);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const content = { closeButton: true } as unknown as { closeButton: true; closeLabel: string };
    const { open } = renderModal({ content, children: <ModalTitle>Title</ModalTitle> });
    await open();

    expect(warn).toHaveBeenCalledExactlyOnceWith("Modal: `closeButton` needs `closeLabel`.");
  });
});

describe("Modal trigger", () => {
  it("exposes the popup, the expanded state and the panel it controls", async () => {
    mockViewport(WIDE);
    const { open, trigger } = renderModal();
    expect(trigger().getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(trigger().hasAttribute("aria-controls")).toBe(false);

    const panel = await open();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(trigger().getAttribute("aria-controls")).toBe(panel.id);
  });

  it("renders the consumer's element with asChild", async () => {
    mockViewport(WIDE);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(
      <Modal>
        <ModalTrigger asChild>
          <a href="#edit">Edit</a>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader asChild>
            <header>
              <ModalTitle>Title</ModalTitle>
            </header>
          </ModalHeader>
        </ModalContent>
      </Modal>,
    );
    const link = screen.getByRole("link", { name: "Edit" });
    await user.click(link);

    expect(link.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog").querySelector("header[data-slot=modal-header]")).toBeTruthy();
  });
});

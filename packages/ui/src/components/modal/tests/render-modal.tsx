import { act, type RenderResult, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { vi } from "vitest";
import {
  Modal,
  ModalBody,
  ModalContent,
  type ModalContentProps,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  ModalTitle,
  ModalTrigger,
} from "..";

// jsdom has no pointer capture; Vaul captures the pointer when a press starts in the drawer.
for (const method of ["setPointerCapture", "releasePointerCapture"] as const) {
  if (typeof Element.prototype[method] !== "function") Element.prototype[method] = () => {};
}

/**
 * A `matchMedia` driven by a settable viewport width: `(min-width: Npx)` and `(max-width: Npx)`
 * match against it, every other query is false. Changing the width notifies the listeners.
 */
export function mockViewport(initialWidth: number) {
  let width = initialWidth;
  const listeners = new Set<() => void>();
  const matches = (query: string) => {
    const min = /\(min-width:\s*(\d+)px\)/.exec(query);
    if (min) return width >= Number(min[1]);
    const max = /\(max-width:\s*(\d+)px\)/.exec(query);
    if (max) return width <= Number(max[1]);
    return false;
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      media: query,
      get matches() {
        return matches(query);
      },
      onchange: null,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => false,
    })),
  );
  return {
    resize(next: number) {
      width = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

/**
 * Ends the panel and overlay animations, then waits a task. Vaul injects CSS animations that jsdom
 * reports but never runs, so Radix keeps a closing drawer mounted until it receives their
 * `animationend`; Radix then restores focus in a timeout.
 */
export async function finishAnimations() {
  act(() => {
    const nodes = document.querySelectorAll<HTMLElement>(
      "[data-slot=modal-content], [data-slot=modal-overlay]",
    );
    for (const node of nodes) {
      const animationName = getComputedStyle(node).animationName;
      if (!animationName || animationName === "none") continue;
      const event = new Event("animationend", { bubbles: true });
      Object.defineProperty(event, "animationName", { value: animationName });
      node.dispatchEvent(event);
    }
  });
  // The unmount above schedules Radix's focus restore; wait for it.
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

/** A viewport at least 768 px wide (dialog) or narrower (drawer). */
export const WIDE = 1024;
export const NARROW = 375;

export interface RenderModalOptions {
  modal?: Omit<ModalProps, "children">;
  content?: Partial<ModalContentProps>;
  /** Replaces the default header, body and footer. */
  children?: ReactNode;
  /** Rendered after the modal, for outside presses and focus checks. */
  outside?: ReactNode;
}

export interface RenderedModal extends RenderResult {
  user: UserEvent;
  trigger: () => HTMLElement;
  dialog: () => HTMLElement;
  queryDialog: () => HTMLElement | null;
  overlay: () => HTMLElement | null;
  /** Opens with the trigger and returns the panel. */
  open: () => Promise<HTMLElement>;
}

/** A complete modal: trigger, title, description, a body input and a footer button. */
export function renderModal({
  modal,
  content,
  children,
  outside,
}: RenderModalOptions = {}): RenderedModal {
  // Modal overlays set `pointer-events: none` on the page; presses outside still reach it.
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  const view = render(
    <>
      <Modal {...modal}>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent {...(content as ModalContentProps)}>
          {children ?? (
            <>
              <ModalHeader>
                <ModalTitle>Edit profile</ModalTitle>
                <ModalDescription>Change your public name.</ModalDescription>
              </ModalHeader>
              <ModalBody>
                <input aria-label="Name" />
              </ModalBody>
              <ModalFooter>
                <button type="button">Save</button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {outside ?? <button type="button">Outside</button>}
    </>,
  );
  // While a modal panel is open, the page behind it is hidden from assistive technology.
  const trigger = () => screen.getByRole("button", { name: "Open", hidden: true });
  const dialog = () => screen.getByRole("dialog");
  const queryDialog = () => screen.queryByRole("dialog");
  const overlay = () => document.querySelector<HTMLElement>("[data-slot=modal-overlay]");
  /** Opens with the trigger and returns the panel. */
  const open = async () => {
    await user.click(trigger());
    return dialog();
  };
  return { ...view, user, trigger, dialog, queryDialog, overlay, open };
}

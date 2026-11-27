import { act, cleanup, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Toaster } from "../toast";
import type { ToasterProps } from "../types";
import { toast } from "../utils/helpers";

/** A mounted `Toaster`, with the helpers every test of the rendered toasts needs. */
export function renderToaster(props: Partial<ToasterProps> = {}) {
  return render(<Toaster {...({ label: "Notifications", ...props } as ToasterProps)} />);
}

/** Runs an operation of the imperative API inside `act`. */
export function run<T>(operation: () => T): T {
  let result!: T;
  act(() => {
    result = operation();
  });
  return result;
}

/** The element of every toast that is not closing, newest first. */
export const toastElements = () =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[data-slot="toast"]:not([data-ending-style])'),
  );

/** The only open toast. */
export function onlyToast(): HTMLElement {
  const elements = toastElements();
  if (elements.length !== 1) throw new Error(`Expected one toast, found ${elements.length}.`);
  return elements[0] as HTMLElement;
}

export const part = (slot: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-slot="${slot}"]`);

/** The notifications region. */
export const region = () => screen.getByRole("region", { name: "Notifications" });

/** Cleans the document and the library's global queue between tests. */
export function resetToasts() {
  cleanup();
  toast.dismiss();
  vi.useRealTimers();
  vi.restoreAllMocks();
}

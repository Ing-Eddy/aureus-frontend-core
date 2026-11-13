import { expect, userEvent, waitFor, within } from "storybook/test";

/** Overlays render in a portal, so they are queried from `document.body`, not the story canvas. */
export const screen = () => within(document.body);

/**
 * Presses Tab `times` times and asserts focus never leaves `container`: the focus trap of a modal
 * Dialog, AlertDialog or Sheet.
 */
export async function expectFocusTrapped(container: HTMLElement, times = 8): Promise<void> {
  for (let index = 0; index < times; index++) {
    await userEvent.tab();
    await expect(container).toContainElement(document.activeElement as HTMLElement);
  }
}

/**
 * Waits for the overlay with `role` to unmount. Its exit animation runs first, and the first run
 * of a test file in a cold browser can take over a second, hence the generous timeout.
 */
export async function expectClosed(role: "dialog" | "alertdialog" | "menu" | "tooltip" = "dialog") {
  await waitFor(() => expect(screen().queryByRole(role)).toBeNull(), { timeout: 3000 });
}

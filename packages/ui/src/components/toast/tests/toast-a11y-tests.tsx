import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { toast } from "../utils/helpers";
import {
  onlyToast,
  region,
  renderToaster,
  resetToasts,
  run,
  toastElements,
} from "./render-toaster";

afterEach(resetToasts);

describe("keyboard", () => {
  it("focuses the region with F6 and returns to the previous element with Shift+Tab", async () => {
    const user = userEvent.setup();
    renderToaster();
    const before = document.body.appendChild(document.createElement("button"));
    before.focus();
    run(() => toast.info("a"));
    await user.keyboard("{F6}");
    expect(document.activeElement).toBe(region());
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(document.activeElement).toBe(before);
    before.remove();
  });

  it("closes the focused toast with Escape", () => {
    renderToaster();
    run(() => toast.info("a"));
    const element = onlyToast();
    element.focus();
    fireEvent.keyDown(element, { key: "Escape" });
    expect(toastElements()).toEqual([]);
  });
});

describe("announcements", () => {
  it("announces politely, and urgently only with high priority", () => {
    renderToaster();
    run(() => toast.danger("quiet"));
    expect(region().getAttribute("aria-live")).toBe("polite");
    expect(onlyToast().getAttribute("role")).toBe("dialog");
    expect(document.querySelector('[role="alert"]')).toBeNull();
    run(() => toast.dismiss());
    run(() => toast.danger("urgent", { priority: "high" }));
    expect(onlyToast().getAttribute("role")).toBe("alertdialog");
    expect(document.querySelector('[role="alert"]')?.textContent).toContain("urgent");
  });
});

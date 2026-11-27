import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToasterProps, ToastOptions } from "../types";
import { toast } from "../utils/helpers";
import { part, region, renderToaster, resetToasts, run, toastElements } from "./render-toaster";

const long = "A long description that does not fit in the lines of the collapsed toast.";
const short = "Short.";
const texts = { expandLabel: "More", collapseLabel: "Less" };

// jsdom has no layout: a text overflows its clamp when it is long.
beforeEach(() => {
  vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(40);
  vi.spyOn(Element.prototype, "scrollHeight", "get").mockImplementation(function (this: Element) {
    return (this.textContent?.length ?? 0) > 20 ? 200 : 40;
  });
});
afterEach(resetToasts);

function show(toaster: Partial<ToasterProps> = {}, options: ToastOptions = {}) {
  renderToaster(toaster);
  return run(() => toast.info("Title", { description: long, ...options }));
}

const description = () => part("toast-description") as HTMLElement;
const toggle = () => part("toast-expand") as HTMLButtonElement | null;
const lines = () => description().style.getPropertyValue("--toast-lines");

describe("expandable descriptions", () => {
  it("are off by default", () => {
    show();
    expect(toggle()).toBeNull();
    expect(description().hasAttribute("data-clamped")).toBe(false);
  });

  it("clamp a long text behind a button", () => {
    show({ expandable: texts });
    expect(description().hasAttribute("data-clamped")).toBe(true);
    expect(lines()).toBe("2");
    const button = screen.getByRole("button", { name: "More" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe(description().id);
    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(description().id);
  });

  it("show no button for a short text", () => {
    show({ expandable: texts }, { description: short });
    expect(toggle()).toBeNull();
  });

  it("add the button when the text is replaced by a long one", () => {
    const id = show({ expandable: texts }, { description: short });
    run(() => toast.update(id, { description: long }));
    expect(toggle()?.textContent).toBe("More");
  });

  it("expand and collapse", () => {
    show({ expandable: texts });
    expect(description().hasAttribute("data-base-ui-swipe-ignore")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(description().hasAttribute("data-clamped")).toBe(false);
    expect(description().hasAttribute("data-open")).toBe(true);
    expect(description().hasAttribute("data-base-ui-swipe-ignore")).toBe(true);
    const button = screen.getByRole("button", { name: "Less" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(button);
    expect(description().hasAttribute("data-clamped")).toBe(true);
    expect(description().hasAttribute("data-open")).toBe(false);
  });

  it("make the expanded text focusable only while it scrolls", () => {
    show({ expandable: texts });
    expect(description().hasAttribute("tabindex")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(description().getAttribute("tabindex")).toBe("0");
  });

  it("take the lines of the toast over the Toaster's", () => {
    show({ expandable: { ...texts, lines: 3 } });
    expect(lines()).toBe("3");
    run(() => toast.dismiss());
    run(() => toast.info("Other", { description: long, expandable: { lines: 5 } }));
    expect(lines()).toBe("5");
  });

  it("can be turned on by one toast with its own texts", () => {
    show({}, { expandable: { expandLabel: "Open", collapseLabel: "Close" } });
    expect(screen.getByRole("button", { name: "Open" })).toBeDefined();
  });

  it("can be turned off by one toast", () => {
    show({ expandable: texts }, { expandable: false });
    expect(toggle()).toBeNull();
    expect(description().hasAttribute("data-clamped")).toBe(false);
  });

  it("can start expanded", () => {
    show({ expandable: texts }, { expandable: { defaultExpanded: true } });
    expect(screen.getByRole("button", { name: "Less" })).toBeDefined();
    expect(description().hasAttribute("data-open")).toBe(true);
  });

  it("show the full text and warn without both texts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    show({}, { expandable: { expandLabel: "More" } });
    expect(toggle()).toBeNull();
    expect(description().hasAttribute("data-clamped")).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      "toast: `expandable` needs `expandLabel` and `collapseLabel`.",
    );
  });

  it("do not trigger the click of a clickable toast", () => {
    const onClick = vi.fn();
    show({ expandable: texts }, { onClick });
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(toastElements()).toHaveLength(1);
  });
});

describe("an expanded toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  const advance = (milliseconds: number) => act(() => vi.advanceTimersByTime(milliseconds));
  const press = (name: string) => {
    fireEvent.click(screen.getByRole("button", { name }));
    // In jsdom the engine takes every click for keyboard focus and pauses the timers; the focus
    // leaving the toasts resumes them, as when a person moves on.
    fireEvent.focusOut(region(), { relatedTarget: document.body });
  };

  it("does not close by itself, and restarts its duration when collapsed", () => {
    show({ expandable: texts }, { duration: 1000 });
    advance(900);
    press("More");
    advance(60_000);
    expect(toastElements()).toHaveLength(1);
    press("Less");
    advance(999);
    expect(toastElements()).toHaveLength(1);
    advance(1);
    expect(toastElements()).toEqual([]);
  });

  it("restores the Toaster's duration", () => {
    show({ expandable: texts, duration: 2000 });
    press("More");
    press("Less");
    advance(2000);
    expect(toastElements()).toEqual([]);
  });

  it("stays open when it starts expanded", () => {
    show({ expandable: texts }, { expandable: { defaultExpanded: true } });
    advance(60_000);
    expect(toastElements()).toHaveLength(1);
  });

  it("stays open when it is replaced", () => {
    const id = show({ expandable: texts });
    press("More");
    run(() => toast.success("Done", { id, description: long }));
    advance(60_000);
    expect(toastElements()).toHaveLength(1);
  });
});

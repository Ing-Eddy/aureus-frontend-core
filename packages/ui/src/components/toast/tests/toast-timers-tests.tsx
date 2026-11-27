import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import { renderToaster, resetToasts, run, toastElements } from "./render-toaster";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(resetToasts);

const advance = (milliseconds: number) => act(() => vi.advanceTimersByTime(milliseconds));

describe("durations", () => {
  it("closes after 5000 ms by default", () => {
    renderToaster();
    run(() => toast.info("a"));
    advance(4999);
    expect(toastElements()).toHaveLength(1);
    advance(1);
    expect(toastElements()).toEqual([]);
  });

  it("uses the Toaster's duration, and the toast's over it", () => {
    renderToaster({ duration: 1000 });
    run(() => toast.info("short"));
    run(() => toast.info("long", { duration: 3000 }));
    advance(1000);
    expect(toastElements().map((element) => element.textContent)).toEqual(["long"]);
    advance(2000);
    expect(toastElements()).toEqual([]);
  });

  it.each([
    ["the toast", {}, { duration: Number.POSITIVE_INFINITY }],
    ["the Toaster", { duration: Number.POSITIVE_INFINITY }, {}],
  ] as const)("never closes with Infinity on %s", (_name, toaster, options) => {
    renderToaster(toaster);
    run(() => toast.info("a", options));
    advance(600_000);
    expect(toastElements()).toHaveLength(1);
  });

  it("never closes a loading toast, and starts the timer once it is replaced", () => {
    renderToaster();
    const id = run(() => toast.loading("Saving"));
    advance(600_000);
    expect(toastElements()).toHaveLength(1);
    run(() => toast.success("Saved", { id }));
    advance(5000);
    expect(toastElements()).toEqual([]);
  });

  it("starts the timer when update changes the status of a loading toast", () => {
    renderToaster();
    const id = run(() => toast.loading("Saving"));
    run(() => toast.update(id, { status: "success", title: "Saved" }));
    advance(5000);
    expect(toastElements()).toEqual([]);
  });

  it("calls onClose and onRemove", () => {
    const onClose = vi.fn();
    const onRemove = vi.fn();
    renderToaster();
    run(() => toast.info("a", { duration: 100, onClose, onRemove }));
    advance(100);
    expect(onClose).toHaveBeenCalledOnce();
    advance(100);
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

import { afterEach, describe, expect, it } from "vitest";
import type { ToastOptions } from "../types";
import { toast } from "../utils/helpers";
import { renderToastProbe } from "./render-toast-probe";
import { onlyToast, part, renderToaster, resetToasts, run } from "./render-toaster";

afterEach(resetToasts);

/** Options of one toast; each must change only what it is about. */
const options: ReadonlyArray<[keyof ToastOptions, ToastOptions]> = [
  ["description", { description: "Text" }],
  ["icon", { icon: false }],
  ["iconLabel", { iconLabel: "Error" }],
  ["appearance", { appearance: "tinted" }],
  ["onClick", { onClick: () => {} }],
  ["keepOpenOnClick", { keepOpenOnClick: true }],
  ["actions", { actions: [{ label: "Ok" }] }],
  ["content", { content: "Extra" }],
  ["expandable", { expandable: false }],
  ["closeButton", { closeButton: false }],
  ["className", { className: "mine" }],
];

describe("independent options", () => {
  it.each(options)("%s changes neither the duration nor the priority", (_name, option) => {
    const probe = renderToastProbe();
    probe.run(() => toast.danger("a", option));
    expect(probe.open()[0]?.timeout).toBeUndefined();
    expect(probe.open()[0]?.priority).toBe("low");
  });

  it.each(["neutral", "success", "info", "warning", "danger"] as const)(
    "the %s status implies no priority, duration or appearance",
    (status) => {
      renderToaster();
      run(() => toast[status]("a"));
      expect(onlyToast().getAttribute("role")).toBe("dialog");
      expect(onlyToast().dataset.appearance).toBe("card");
      expect(part("toast-close")).toBeNull();
      expect(onlyToast().hasAttribute("data-clickable")).toBe(false);
    },
  );

  it("a high priority or a persistent duration changes nothing else", () => {
    renderToaster();
    run(() => toast.info("a", { priority: "high", duration: Number.POSITIVE_INFINITY }));
    expect(onlyToast().dataset.appearance).toBe("card");
    expect(part("toast-close")).toBeNull();
  });
});

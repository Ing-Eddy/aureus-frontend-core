import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import {
  onlyToast,
  part,
  region,
  renderToaster,
  resetToasts,
  run,
  toastElements,
} from "./render-toaster";

afterEach(resetToasts);

describe("Toaster", () => {
  it("renders an empty region named by label, with the default position", () => {
    renderToaster();
    expect(region()).toHaveProperty("dataset.slot", "toast-viewport");
    expect(region().dataset.position).toBe("bottom-end");
    expect(region().textContent).toBe("");
  });

  it("takes a position and extra classes", () => {
    renderToaster({ position: "top-start", className: "my-toaster" });
    expect(region().dataset.position).toBe("top-start");
    expect(region().classList.contains("my-toaster")).toBe(true);
  });

  it("shows icon, title and description", () => {
    renderToaster();
    run(() => toast.success("Saved", { description: "A copy was sent" }));
    const element = onlyToast();
    expect(element.dataset.type).toBe("success");
    expect(element.dataset.appearance).toBe("card");
    expect(part("toast-title", element)?.textContent).toBe("Saved");
    expect(part("toast-description", element)?.textContent).toBe("A copy was sent");
    const icon = part("toast-icon", element);
    expect(icon?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(element.getAttribute("aria-labelledby")).toBe(part("toast-title", element)?.id);
    expect(element.getAttribute("aria-describedby")).toBe(part("toast-description", element)?.id);
  });

  it("renders no description element without one", () => {
    renderToaster();
    run(() => toast.info("Only a title"));
    expect(part("toast-description")).toBeNull();
    expect(part("toast-actions")).toBeNull();
    expect(part("toast-close")).toBeNull();
  });

  it.each([
    ["success", "lucide-circle-check"],
    ["info", "lucide-info"],
    ["warning", "lucide-triangle-alert"],
    ["danger", "lucide-octagon-x"],
    ["loading", "lucide-loader-circle"],
  ] as const)("gives %s its own icon", (status, iconClass) => {
    renderToaster();
    run(() => toast[status]("Title"));
    expect(part("toast-icon")?.querySelector("svg")?.classList.contains(iconClass)).toBe(true);
  });

  it("gives neutral no icon", () => {
    renderToaster();
    run(() => toast.neutral("Title"));
    expect(part("toast-icon")).toBeNull();
  });

  it("replaces icons from the Toaster or from the toast, and hides them with false", () => {
    renderToaster({ icons: { success: <i data-testid="mine" /> } });
    run(() => toast.success("a"));
    expect(screen.getByTestId("mine")).toBeDefined();
    run(() => toast.dismiss());
    run(() => toast.success("b", { icon: <i data-testid="own" /> }));
    expect(screen.getByTestId("own")).toBeDefined();
    expect(screen.queryByTestId("mine")).toBeNull();
    run(() => toast.dismiss());
    run(() => toast.success("c", { icon: false }));
    expect(part("toast-icon", onlyToast())).toBeNull();
  });

  it("names the status for screen readers with iconLabel", () => {
    renderToaster();
    run(() => toast.danger("Failed", { iconLabel: "Error" }));
    const label = screen.getByText("Error");
    expect(label.classList.contains("sr-only")).toBe(true);
    expect(onlyToast().contains(label)).toBe(true);
  });

  it("applies the Toaster's appearance, and the toast's over it", () => {
    renderToaster({ appearance: "tinted" });
    run(() => toast.info("a"));
    run(() => toast.info("b", { appearance: "card" }));
    expect(toastElements().map((element) => element.dataset.appearance)).toEqual([
      "card",
      "tinted",
    ]);
  });

  it("adds the toast's classes", () => {
    renderToaster();
    run(() => toast.info("a", { className: "my-toast" }));
    expect(onlyToast().classList.contains("my-toast")).toBe(true);
  });

  it("keeps at most `limit` toasts active", () => {
    renderToaster({ limit: 2 });
    run(() => {
      toast.info("a");
      toast.info("b");
      toast.info("c");
    });
    expect(toastElements().map((element) => element.hasAttribute("data-limited"))).toEqual([
      false,
      false,
      true,
    ]);
  });
});

describe("close button", () => {
  it("is rendered with the Toaster's label and closes the toast", async () => {
    renderToaster({ closeButton: true, closeLabel: "Close" });
    run(() => toast.info("a"));
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.getAttribute("aria-hidden")).not.toBe("true");
    await userEvent.click(button);
    expect(toastElements()).toEqual([]);
  });

  it("can be turned on or off per toast, with its own label", () => {
    renderToaster({ closeButton: true, closeLabel: "Close" });
    run(() => toast.info("a", { closeButton: false }));
    expect(part("toast-close")).toBeNull();
    run(() => toast.dismiss());
    run(() => toast.info("b", { closeLabel: "Dismiss this" }));
    expect(screen.getByRole("button", { name: "Dismiss this" })).toBeDefined();
  });

  it("uses the Toaster's label for a toast that turns it on", () => {
    renderToaster({ closeLabel: "Close" });
    run(() => toast.info("a", { closeButton: true }));
    expect(screen.getByRole("button", { name: "Close" })).toBeDefined();
  });

  it("is not rendered without a label, and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderToaster();
    run(() => toast.info("a", { closeButton: true }));
    expect(part("toast-close")).toBeNull();
    expect(warn).toHaveBeenCalledWith("toast: `closeButton` needs `closeLabel`.");
  });
});

describe("Toaster warnings for untyped code", () => {
  it("warns about a missing label and a close button without its name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderToaster({ label: "", closeButton: true });
    expect(warn).toHaveBeenCalledWith("Toaster: `label` is required.");
    expect(warn).toHaveBeenCalledWith("Toaster: `closeButton` needs `closeLabel`.");
  });
});

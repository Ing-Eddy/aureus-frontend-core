import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SwitchField } from "../switch-field";
import { deferred, renderField, toggle } from "./helpers";

describe("SwitchField asynchronous change", () => {
  it("stays put and busy while pending, then turns on when confirmed", async () => {
    const save = deferred();
    const onBeforeChange = vi.fn(() => save.promise);
    const onValueChange = vi.fn();
    const { container } = renderField(
      <SwitchField
        switchLabel="Alerts"
        onBeforeChange={onBeforeChange}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(toggle("Alerts"));
    expect(onBeforeChange).toHaveBeenCalledWith(true);
    const sw = toggle("Alerts");
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(sw.getAttribute("aria-busy")).toBe("true");
    expect(sw.getAttribute("aria-disabled")).toBe("true");
    expect(container.querySelector("[data-slot=switch-spinner]")).not.toBeNull();
    // Further toggles are ignored while pending, and focus stays on the switch.
    sw.focus();
    await userEvent.keyboard(" ");
    expect(onBeforeChange).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(sw);
    await act(async () => save.resolve(true));
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(sw.hasAttribute("aria-busy")).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps its state when the guard resolves false or rejects", async () => {
    const first = deferred();
    const second = deferred();
    const onBeforeChange = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const onValueChange = vi.fn();
    renderField(
      <SwitchField
        switchLabel="Alerts"
        onBeforeChange={onBeforeChange}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(toggle("Alerts"));
    await act(async () => first.resolve(false));
    await userEvent.click(toggle("Alerts"));
    await act(async () => second.reject(new Error("offline")));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(toggle("Alerts").getAttribute("aria-checked")).toBe("false");
  });

  it("passes the custom value it would change to", async () => {
    const onBeforeChange = vi.fn(() => true);
    renderField(
      <SwitchField
        switchLabel="Public"
        checkedValue="public"
        uncheckedValue="private"
        onBeforeChange={onBeforeChange}
      />,
    );
    await userEvent.click(toggle("Public"));
    expect(onBeforeChange).toHaveBeenCalledWith("public");
    expect(toggle("Public").getAttribute("aria-checked")).toBe("true");
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SwitchField } from "../switch-field";
import { renderField, toggle } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("SwitchField accessibility", () => {
  it("names the group with the label and the switch with its text", () => {
    renderField(<SwitchField label="Notifications" switchLabel="Weekly digest" />);
    const group = screen.getByRole("group", { name: "Notifications" });
    const sw = toggle("Weekly digest");
    expect(group.contains(sw)).toBe(true);
    expect(sw.getAttribute("aria-checked")).toBe("false");
  });

  it("is named by the label alone, or by the text alone with the required mark", () => {
    const { container } = renderField(
      <>
        <SwitchField label="Dark mode" />
        <SwitchField switchLabel="I agree" required />
      </>,
    );
    expect(toggle("Dark mode")).toBeTruthy();
    expect(toggle(/^I agree/).getAttribute("aria-required")).toBe("true");
    expect(
      container.querySelector("[data-slot=switch-label] [data-slot=field-required-mark]"),
    ).not.toBeNull();
  });

  it("is described by helper and info, and marked invalid", () => {
    renderField(
      <SwitchField
        infoLabel="More information"
        id="alerts"
        switchLabel="Alerts"
        helperText="Help"
        info="More"
        error
      />,
    );
    expect(toggle("Alerts").getAttribute("aria-describedby")?.split(" ")).toEqual([
      "alerts-helper",
      "alerts-info",
    ]);
    expect(toggle("Alerts").getAttribute("aria-invalid")).toBe("true");
  });

  it("keeps its state when a link in the text is clicked", async () => {
    const onValueChange = vi.fn();
    renderField(
      <SwitchField
        switchLabel={
          <>
            Share my <a href="#data">data</a>
          </>
        }
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "data" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("toggles with Space and with Enter", async () => {
    const onValueChange = vi.fn();
    renderField(<SwitchField switchLabel="Alerts" onValueChange={onValueChange} />);
    toggle("Alerts").focus();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps state labels and thumb icons out of the accessible name", () => {
    renderField(
      <SwitchField
        switchLabel="Alerts"
        stateLabels={{ on: "Yes", off: "No" }}
        thumbIcons={{ on: <svg />, off: <svg /> }}
      />,
    );
    expect(toggle("Alerts")).toBeTruthy();
    expect(screen.getByText("No").closest("[aria-hidden=true]")).not.toBeNull();
  });

  it("warns when the switch has no name, and accepts aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { unmount } = renderField(<SwitchField />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
    unmount();
    warn.mockClear();
    renderField(<SwitchField aria-label="Row enabled" />);
    expect(toggle("Row enabled")).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });
});

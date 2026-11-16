import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { box, channels, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("CheckboxGroupField accessibility", () => {
  it("is a group named by the label and described by helper and info", () => {
    renderField(
      <CheckboxGroupField
        infoLabel="More information"
        id="channels"
        label="Channels"
        helperText="Choose where we write to you"
        info="You can change it later"
        options={channels}
      />,
    );
    const group = screen.getByRole("group", { name: "Channels" });
    expect(group.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "channels-helper",
      "channels-info",
    ]);
    expect(screen.getByText("Channels").closest("label")?.hasAttribute("for")).toBe(false);
  });

  it("names each box by its option and describes it by its description", () => {
    renderField(<CheckboxGroupField label="Channels" options={channels} />);
    const email = box("Email");
    expect(email.getAttribute("aria-describedby")).toBe(
      screen.getByText("Daily digest").getAttribute("id"),
    );
    expect(box("SMS").hasAttribute("aria-describedby")).toBe(false);
  });

  it("marks every box invalid on error, and none as required", () => {
    const { container } = renderField(
      <CheckboxGroupField
        label="Channels"
        options={channels}
        required
        error
        errorMessage="Choose one."
      />,
    );
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox.getAttribute("aria-invalid")).toBe("true");
      expect(checkbox.hasAttribute("aria-required")).toBe(false);
    }
    expect(
      container.querySelector("[data-slot=field-header] [data-slot=field-required-mark]"),
    ).not.toBeNull();
    expect(screen.getByRole("alert").textContent).toBe("Choose one.");
  });

  it("warns when the group has no name, and accepts aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { unmount } = renderField(<CheckboxGroupField options={channels} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("the group has no accessible name"));
    unmount();
    warn.mockClear();
    renderField(<CheckboxGroupField aria-label="Channels" options={channels} />);
    expect(screen.getByRole("group", { name: "Channels" })).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });

  it("follows a link in an option label without toggling", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        label="Legal"
        options={[
          {
            value: "terms",
            label: (
              <>
                The <a href="#terms">terms</a>
              </>
            ),
          },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "terms" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText(/The/));
    expect(onValueChange).toHaveBeenLastCalledWith(["terms"]);
  });

  it("tabs through enabled boxes and toggles with Space", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        label="Channels"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
          { value: "c", label: "C" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(box("A"));
    await userEvent.keyboard(" ");
    await userEvent.tab();
    expect(document.activeElement).toBe(box("C"));
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "c"]);
  });
});

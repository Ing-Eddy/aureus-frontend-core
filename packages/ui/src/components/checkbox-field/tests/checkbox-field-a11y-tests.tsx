import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../checkbox-field";
import { box, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("CheckboxField accessibility", () => {
  it("with both texts, names the group with the label and the box with its text", () => {
    renderField(<CheckboxField label="Notificaciones" checkboxLabel="Recibir resumen semanal" />);
    const group = screen.getByRole("group", { name: "Notificaciones" });
    expect(group.contains(box("Recibir resumen semanal"))).toBe(true);
    expect(screen.getByText("Notificaciones").closest("label")?.hasAttribute("for")).toBe(false);
  });

  it("with only a label, the label names the box", () => {
    renderField(<CheckboxField label="Newsletter" />);
    expect(box("Newsletter")).toBeTruthy();
    expect(screen.getByRole("group").hasAttribute("aria-labelledby")).toBe(false);
  });

  it("with only a checkbox label, it names the box and carries the required mark", () => {
    const { container } = renderField(<CheckboxField checkboxLabel="I accept" required />);
    const checkbox = box(/^I accept/);
    expect(checkbox.getAttribute("aria-required")).toBe("true");
    const mark = container.querySelector(
      "[data-slot=checkbox-label] [data-slot=field-required-mark]",
    );
    expect(mark?.textContent).toBe("*");
  });

  it("puts the required mark on the header label when there is one", () => {
    const { container } = renderField(
      <CheckboxField label="Terms" checkboxLabel="I accept" required />,
    );
    expect(
      container.querySelector("[data-slot=field-header] [data-slot=field-required-mark]"),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-slot=checkbox-label] [data-slot=field-required-mark]"),
    ).toBeNull();
  });

  it("describes the box with helper and info, and marks it invalid", () => {
    renderField(
      <CheckboxField
        checkboxLabel="I accept"
        helperText="Required to continue"
        info="Read them first"
        error
        id="terms"
      />,
    );
    const checkbox = box("I accept");
    expect(checkbox.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "terms-helper",
      "terms-info",
    ]);
    expect(checkbox.getAttribute("aria-invalid")).toBe("true");
  });

  it("follows a link inside the text without toggling", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxField
        checkboxLabel={
          <>
            I accept the <a href="#terms">terms</a>
          </>
        }
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "terms" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText(/I accept the/));
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("toggles with Space but not with Enter", async () => {
    const onValueChange = vi.fn();
    renderField(<CheckboxField checkboxLabel="I accept" onValueChange={onValueChange} />);
    box("I accept").focus();
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("warns when the box has no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<CheckboxField />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
  });

  it("accepts aria-label when there is no visible text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<CheckboxField aria-label="Select row 1" />);
    expect(box("Select row 1")).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });
});

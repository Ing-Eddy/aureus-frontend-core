import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

const other = { label: "Other", inputLabel: "Other source", placeholder: "Tell us" };

describe("RadioGroupField other option", () => {
  it("shows a focused input when chosen with the pointer, and reports the typed text", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Source"
        options={plans}
        otherOption={other}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.queryByRole("textbox")).toBeNull();
    await userEvent.click(radio("Other"));
    expect(onValueChange).toHaveBeenLastCalledWith("");
    const input = screen.getByRole("textbox", { name: "Other source" });
    expect(document.activeElement).toBe(input);
    await userEvent.type(input, "Podcast");
    expect(onValueChange).toHaveBeenLastCalledWith("Podcast");
    expect(radio("Other").getAttribute("aria-checked")).toBe("true");
  });

  it("keeps the selection when the input is clicked, and hides it for another option", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Source"
        options={plans}
        otherOption={other}
        defaultValue="Podcast"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Other source" });
    expect((input as HTMLInputElement).value).toBe("Podcast");
    await userEvent.click(input);
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(radio("Pro"));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("restores the last text when other is chosen again", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Source"
        options={plans}
        otherOption={other}
        defaultValue="Podcast"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(radio("Pro"));
    await userEvent.click(radio("Other"));
    expect(onValueChange).toHaveBeenLastCalledWith("Podcast");
  });
});

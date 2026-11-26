import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
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

  it("keeps the input while the written text equals an option's value", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Source"
        options={plans}
        otherOption={other}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(radio("Other"));
    const input = screen.getByRole("textbox", { name: "Other source" }) as HTMLInputElement;
    await userEvent.type(input, "professional");
    expect(input.isConnected).toBe(true);
    expect(input.value).toBe("professional");
    await userEvent.clear(input);
    await userEvent.type(input, "pro");
    expect(radio("Other").getAttribute("aria-checked")).toBe("true");
    expect(radio("Pro").getAttribute("aria-checked")).toBe("false");
    expect(onValueChange).toHaveBeenLastCalledWith("pro");

    // Choosing the option itself still selects it, and other restores the written text.
    await userEvent.click(radio("Pro"));
    expect(radio("Pro").getAttribute("aria-checked")).toBe("true");
    expect(screen.queryByRole("textbox")).toBeNull();
    await userEvent.click(radio("Other"));
    expect(radio("Other").getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("textbox")).toHaveProperty("value", "pro");
  });

  it("follows a controlled value set from outside after writing", async () => {
    const field = (value: string | null) => (
      <TooltipProvider>
        <RadioGroupField label="Source" options={plans} otherOption={other} value={value} />
      </TooltipProvider>
    );
    const view = render(field("Podcast"));
    view.rerender(field("pro"));
    expect(radio("Pro").getAttribute("aria-checked")).toBe("true");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("submits the written text with a native form", async () => {
    renderField(
      <form aria-label="Survey">
        <RadioGroupField label="Source" name="source" options={plans} otherOption={other} />
      </form>,
    );
    const submitted = () =>
      new FormData(screen.getByRole("form") as HTMLFormElement).getAll("source");
    await userEvent.click(radio("Pro"));
    expect(submitted()).toEqual(["pro"]);
    await userEvent.click(radio("Other"));
    await userEvent.type(screen.getByRole("textbox"), "Podcast");
    expect(submitted()).toEqual(["Podcast"]);
    await userEvent.click(radio("Free"));
    expect(submitted()).toEqual(["free"]);
  });
});

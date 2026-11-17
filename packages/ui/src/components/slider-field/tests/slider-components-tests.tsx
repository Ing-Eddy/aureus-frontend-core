import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  SliderHeaderValue,
  SliderInput,
  type SliderInputProps,
  SliderMarkLabels,
  SliderMarkTicks,
  SliderValueTooltip,
} from "../components";
import { SliderField } from "../slider-field";
import { positionAt, visibleMarks } from "../utils";

describe("marks", () => {
  it("drops marks outside the limits and duplicates, and sorts them", () => {
    const marks = visibleMarks(
      [{ value: 50, label: "first" }, { value: -5 }, { value: 120 }, { value: 0 }, { value: 50 }],
      0,
      100,
    );
    expect(marks.map((mark) => mark.value)).toEqual([0, 50]);
    expect(marks[1]?.label).toBe("first");
  });

  it("places each tick with Radix's in-bounds offset", () => {
    const { container } = render(
      <SliderMarkTicks marks={[{ value: 25 }]} min={0} max={100} orientation="horizontal" />,
    );
    const tick = container.querySelector<HTMLElement>("[data-slot=slider-mark]");
    expect(tick?.getAttribute("style")).toContain(positionAt(25));
    expect(positionAt(25)).toBe("calc(25% + var(--slider-thumb) / 2 - 0.25 * var(--slider-thumb))");
    const vertical = render(
      <SliderMarkTicks marks={[{ value: 25 }]} min={0} max={100} orientation="vertical" />,
    );
    expect(
      vertical.container.querySelector("[data-slot=slider-mark]")?.getAttribute("style"),
    ).toContain("bottom: calc(25%");
  });

  it("renders only the labels that are given, aligning the ends to their edge", () => {
    const { container } = render(
      <SliderMarkLabels
        marks={[{ value: 0, label: "Low" }, { value: 50 }, { value: 100, label: "High" }]}
        min={0}
        max={100}
        orientation="horizontal"
      />,
    );
    const labels = container.querySelectorAll("[data-slot=slider-mark-label]");
    expect([...labels].map((label) => label.textContent)).toEqual(["Low", "High"]);
    expect(labels[0]?.className).toContain("start-0");
    expect(labels[1]?.className).toContain("end-0");
  });

  it("renders no label layer without labels", () => {
    const { container } = render(
      <SliderMarkLabels marks={[{ value: 50 }]} min={0} max={100} orientation="horizontal" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("hides the ticks and labels from assistive technology", () => {
    render(<SliderField label="Volume" marks={[{ value: 0, label: "Silent" }, { value: 100 }]} />);
    expect(document.querySelector("[data-slot=slider-marks]")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(
      document.querySelector("[data-slot=slider-mark-labels]")?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(screen.queryByText("Silent")?.closest("[aria-hidden=true]")).not.toBeNull();
  });
});

describe("value displays", () => {
  it("are hidden from assistive technology and show the text", () => {
    render(<SliderValueTooltip text="40 %" orientation="horizontal" />);
    render(<SliderHeaderValue text="20 € – 80 €" />);
    expect(screen.getByText("40 %").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("20 € – 80 €").getAttribute("aria-hidden")).toBe("true");
  });

  it("marks the container while a thumb is dragged with the pointer", () => {
    render(<SliderField label="Volume" defaultValue={30} showValue="tooltip" />);
    // jsdom has no pointer capture, which Radix uses on pointer down.
    Element.prototype.setPointerCapture ??= () => {};
    const container = document.querySelector<HTMLElement>("[data-slot=slider-container]");
    expect(container?.hasAttribute("data-dragging")).toBe(false);
    fireEvent.pointerDown(screen.getByRole("slider"), { pointerId: 1 });
    expect(container?.hasAttribute("data-dragging")).toBe(true);
    fireEvent.pointerUp(window);
    expect(container?.hasAttribute("data-dragging")).toBe(false);
  });

  it("puts a tooltip inside each thumb", () => {
    render(
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum", "Maximum"]}
        defaultValue={[20, 80]}
        showValue="tooltip"
      />,
    );
    expect(screen.getByRole("slider", { name: "Minimum" }).textContent).toBe("20");
    expect(screen.getByRole("slider", { name: "Maximum" }).textContent).toBe("80");
  });
});

describe("SliderInput", () => {
  function renderInput(props: Partial<SliderInputProps> = {}) {
    const onCommit = vi.fn();
    render(
      <SliderInput
        id="volume-input"
        value={40}
        onCommit={onCommit}
        label="Exact volume"
        valueText="40"
        min={0}
        max={100}
        step={5}
        decimals={0}
        {...props}
      />,
    );
    return { onCommit, input: screen.getByRole<HTMLInputElement>("spinbutton") };
  }

  it("is named by its label and shows the value", () => {
    const { input } = renderInput({ valueText: "40 %" });
    expect(input).toBe(screen.getByRole("spinbutton", { name: "Exact volume" }));
    expect(input.value).toBe("40");
    expect(input.getAttribute("aria-valuetext")).toBe("40 %");
    expect(input.getAttribute("dir")).toBe("ltr");
  });

  it("commits only on Enter or blur", () => {
    const { input, onCommit } = renderInput();
    fireEvent.change(input, { target: { value: "47" } });
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith(47);
    fireEvent.change(input, { target: { value: "60" } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenLastCalledWith(60);
  });

  it("restores the value after an empty or invalid entry, and on Escape", () => {
    const { input, onCommit } = renderInput();
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(input.value).toBe("40");
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input.value).toBe("40");
    fireEvent.change(input, { target: { value: "70" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.value).toBe("40");
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("reads numbers written for the locale", () => {
    const { input, onCommit } = renderInput({ locale: "es-ES", step: 0.5, decimals: 1 });
    fireEvent.change(input, { target: { value: "12,5" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith(12.5);
  });

  it("steps with the arrows", () => {
    const { input, onCommit } = renderInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onCommit).toHaveBeenCalledWith(45);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onCommit).toHaveBeenLastCalledWith(35);
  });
});

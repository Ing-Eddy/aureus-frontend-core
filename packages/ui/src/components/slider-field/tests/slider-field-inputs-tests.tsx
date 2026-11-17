import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SliderField } from "../slider-field";
import { renderField, thumb, thumbValue } from "./helpers";

const input = (name: string) => screen.getByRole<HTMLInputElement>("spinbutton", { name });

function type(element: HTMLInputElement, text: string, key = "Enter") {
  fireEvent.change(element, { target: { value: text } });
  if (key === "blur") fireEvent.blur(element);
  else fireEvent.keyDown(element, { key });
}

describe("SliderField linked input", () => {
  it("commits an exact value on Enter, rounded to the step (spec: Typing an exact value)", () => {
    const onValueCommit = vi.fn();
    renderField(
      <SliderField
        label="Volume"
        step={5}
        withInput
        inputLabel="Exact volume"
        onValueCommit={onValueCommit}
      />,
    );
    type(input("Exact volume"), "47");
    expect(thumbValue(thumb("Volume"))).toBe(45);
    expect(input("Exact volume").value).toBe("45");
    expect(onValueCommit).toHaveBeenCalledOnce();
    expect(onValueCommit).toHaveBeenCalledWith(45);
  });

  it("does not move the thumb while typing", () => {
    renderField(<SliderField label="Volume" defaultValue={10} withInput inputLabel="Exact" />);
    fireEvent.change(input("Exact"), { target: { value: "80" } });
    expect(thumbValue(thumb("Volume"))).toBe(10);
    fireEvent.blur(input("Exact"));
    expect(thumbValue(thumb("Volume"))).toBe(80);
  });

  it("clamps a typed value and restores an invalid one", () => {
    renderField(<SliderField label="Volume" defaultValue={10} withInput inputLabel="Exact" />);
    type(input("Exact"), "500", "blur");
    expect(thumbValue(thumb("Volume"))).toBe(100);
    type(input("Exact"), "loud", "blur");
    expect(input("Exact").value).toBe("100");
  });

  it("follows the thumb when it moves", () => {
    renderField(<SliderField label="Volume" defaultValue={10} withInput inputLabel="Exact" />);
    fireEvent.keyDown(thumb("Volume"), { key: "End" });
    expect(input("Exact").value).toBe("100");
  });

  it("names two inputs for a range and keeps the pair ordered", () => {
    renderField(
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum price", "Maximum price"]}
        defaultValue={[20, 60]}
        minDistance={10}
        withInput
        inputLabels={["From", "To"]}
      />,
    );
    type(input("From"), "70");
    expect(thumbValue(thumb("Minimum price"))).toBe(50);
    expect(thumbValue(thumb("Maximum price"))).toBe(60);
    expect(input("From").value).toBe("50");
  });

  it("places the low input before the track and the high one after it", () => {
    renderField(
      <SliderField
        label="Price"
        range
        thumbLabels={["Low", "High"]}
        withInput
        inputLabels={["From", "To"]}
      />,
    );
    const area = document.querySelector("[data-slot=slider-area]") as HTMLElement;
    const position = (node: Node) => area.compareDocumentPosition(node);
    expect(position(input("From")) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    expect(position(input("To")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("is disabled with the field, also while loading", () => {
    const { unmount } = renderField(
      <SliderField label="Volume" withInput inputLabel="Exact" disabled />,
    );
    expect(input("Exact").disabled).toBe(true);
    expect(thumb("Volume").hasAttribute("data-disabled")).toBe(true);
    unmount();
    renderField(
      <SliderField label="Volume" withInput inputLabel="Exact" loading loadingLabel="Saving" />,
    );
    expect(input("Exact").disabled).toBe(true);
  });

  it("reads and shows numbers for the locale", () => {
    renderField(
      <SliderField
        label="Weight"
        min={0}
        max={10}
        step={0.5}
        locale="es-ES"
        defaultValue={2.5}
        withInput
        inputLabel="Exact weight"
      />,
    );
    expect(input("Exact weight").value).toBe("2,5");
    type(input("Exact weight"), "7,5");
    expect(thumbValue(thumb("Weight"))).toBe(7.5);
  });
});

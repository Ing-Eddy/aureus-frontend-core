import { describe, expect, it, vi } from "vitest";
import { SliderField } from "../slider-field";
import { press, renderField, thumb, thumbValue } from "./helpers";

const quarters = [0, 25, 50, 75, 100].map((value) => ({ value }));

describe("SliderField marks", () => {
  it("draws the marks within the limits", () => {
    renderField(<SliderField label="Volume" marks={[...quarters, { value: 150 }]} />);
    const ticks = document.querySelectorAll("[data-slot=slider-mark]");
    expect([...ticks].map((tick) => tick.getAttribute("data-value"))).toEqual([
      "0",
      "25",
      "50",
      "75",
      "100",
    ]);
  });

  it("snaps to the next mark with the arrows (spec: Snapping with the keyboard)", () => {
    renderField(<SliderField label="Volume" marks={quarters} snapToMarks defaultValue={25} />);
    press(thumb(), "ArrowRight");
    expect(thumbValue(thumb())).toBe(50);
    press(thumb(), "PageUp");
    expect(thumbValue(thumb())).toBe(100);
    press(thumb(), "Home");
    expect(thumbValue(thumb())).toBe(0);
  });

  it("shows a value between marks on the nearest mark", () => {
    renderField(<SliderField label="Volume" marks={quarters} snapToMarks value={60} />);
    expect(thumbValue(thumb())).toBe(50);
  });

  it("steps normally with marks but without snapToMarks", () => {
    const onValueChange = vi.fn();
    renderField(
      <SliderField
        label="Volume"
        marks={quarters}
        defaultValue={25}
        onValueChange={onValueChange}
      />,
    );
    press(thumb(), "ArrowRight");
    expect(onValueChange).toHaveBeenCalledWith(26);
  });

  it("keeps a range on marks and minDistance apart", () => {
    renderField(
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum", "Maximum"]}
        marks={quarters}
        snapToMarks
        minDistance={25}
        defaultValue={[25, 50]}
      />,
    );
    press(thumb("Minimum"), "ArrowRight");
    expect(thumbValue(thumb("Minimum"))).toBe(25);
    press(thumb("Maximum"), "ArrowRight");
    expect(thumbValue(thumb("Maximum"))).toBe(75);
  });
});

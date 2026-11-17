import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SliderField } from "../slider-field";
import { press, renderField, thumb, thumbValue } from "./helpers";

describe("SliderField value", () => {
  it("is uncontrolled with defaultValue and defaults to min", () => {
    renderField(<SliderField label="Volume" min={10} />);
    expect(thumbValue(thumb())).toBe(10);
  });

  it("is controlled with value", () => {
    const onValueChange = vi.fn();
    const { rerender } = renderField(
      <SliderField label="Volume" value={30} onValueChange={onValueChange} />,
    );
    press(thumb(), "ArrowRight");
    expect(onValueChange).toHaveBeenCalledWith(31);
    expect(thumbValue(thumb())).toBe(30);
    rerender(<SliderField label="Volume" value={31} onValueChange={onValueChange} />);
    expect(thumbValue(thumb())).toBe(31);
  });

  it("steps with the keyboard: arrows, largeStep, Home and End", () => {
    renderField(<SliderField label="Volume" defaultValue={50} step={5} largeStep={20} />);
    const slider = thumb();
    press(slider, "ArrowRight");
    expect(thumbValue(slider)).toBe(55);
    press(slider, "ArrowDown");
    expect(thumbValue(slider)).toBe(50);
    press(slider, "PageUp");
    expect(thumbValue(slider)).toBe(70);
    press(slider, "ArrowLeft", { shiftKey: true });
    expect(thumbValue(slider)).toBe(50);
    press(slider, "End");
    expect(thumbValue(slider)).toBe(100);
    press(slider, "Home");
    expect(thumbValue(slider)).toBe(0);
  });

  it("defaults largeStep to ten steps", () => {
    renderField(<SliderField label="Volume" defaultValue={0} step={2} />);
    press(thumb(), "PageUp");
    expect(thumbValue(thumb())).toBe(20);
  });

  it("commits once per key that changes the value", () => {
    const onValueCommit = vi.fn();
    renderField(<SliderField label="Volume" defaultValue={100} onValueCommit={onValueCommit} />);
    press(thumb(), "ArrowRight");
    expect(onValueCommit).not.toHaveBeenCalled();
    press(thumb(), "ArrowLeft");
    expect(onValueCommit).toHaveBeenCalledOnce();
    expect(onValueCommit).toHaveBeenCalledWith(99);
  });

  it("reports a pair for a range and keeps minDistance", () => {
    const onValueChange = vi.fn();
    renderField(
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum", "Maximum"]}
        defaultValue={[40, 50]}
        minDistance={10}
        onValueChange={onValueChange}
      />,
    );
    press(thumb("Minimum"), "ArrowRight");
    expect(onValueChange).not.toHaveBeenCalled();
    press(thumb("Maximum"), "ArrowRight");
    expect(onValueChange).toHaveBeenCalledWith([40, 51]);
    press(thumb("Minimum"), "Home");
    expect(onValueChange).toHaveBeenLastCalledWith([0, 51]);
  });

  it("shows an out-of-order controlled pair sorted", () => {
    renderField(
      <SliderField label="Price" range thumbLabels={["Minimum", "Maximum"]} value={[80, 20]} />,
    );
    expect(thumbValue(thumb("Minimum"))).toBe(20);
    expect(thumbValue(thumb("Maximum"))).toBe(80);
  });

  it("shows an out-of-range value clamped and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<SliderField label="Volume" value={150} />);
    expect(thumbValue(thumb())).toBe(100);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("the value 150 is outside"));
    warn.mockRestore();
  });

  it("does not move while disabled", () => {
    const onValueChange = vi.fn();
    renderField(
      <SliderField label="Volume" defaultValue={10} disabled onValueChange={onValueChange} />,
    );
    press(thumb(), "ArrowRight");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("submits the value in native forms", () => {
    const { unmount } = renderField(
      <form aria-label="Single">
        <SliderField label="Volume" name="volume" defaultValue={30} />
      </form>,
    );
    expect([...new FormData(screen.getByRole("form")).entries()]).toEqual([["volume", "30"]]);
    unmount();
    renderField(
      <form aria-label="Range">
        <SliderField
          label="Price"
          name="price"
          range
          thumbLabels={["Minimum", "Maximum"]}
          defaultValue={[20, 80]}
        />
      </form>,
    );
    expect([...new FormData(screen.getByRole("form")).entries()]).toEqual([
      ["price[]", "20"],
      ["price[]", "80"],
    ]);
  });

  it("reaches the first thumb with ref and calls onBlur when focus leaves the field", () => {
    const ref = { current: null as HTMLSpanElement | null };
    const onBlur = vi.fn();
    renderField(
      <>
        <SliderField
          label="Price"
          range
          thumbLabels={["Minimum", "Maximum"]}
          ref={ref}
          onBlur={onBlur}
        />
        <button type="button">Next</button>
      </>,
    );
    expect(ref.current).toBe(thumb("Minimum"));
    fireEvent.blur(thumb("Minimum"), { relatedTarget: thumb("Maximum") });
    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(thumb("Maximum"), { relatedTarget: screen.getByRole("button") });
    expect(onBlur).toHaveBeenCalledOnce();
  });
});

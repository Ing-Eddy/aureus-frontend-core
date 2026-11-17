import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sliderProblems, useSliderWarnings } from "./use-slider-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useSliderWarnings", () => {
  it("lists nothing when every text is given", () => {
    expect(sliderProblems({ label: "Volume" })).toEqual([]);
    expect(
      sliderProblems({
        label: "Price",
        range: true,
        thumbLabels: ["Minimum", "Maximum"],
        withInput: true,
        inputLabels: ["From", "To"],
      }),
    ).toEqual([]);
    expect(
      sliderProblems({ "aria-label": "Volume", withInput: true, inputLabel: "Exact" }),
    ).toEqual([]);
  });

  it("names a slider without an accessible name", () => {
    expect(sliderProblems({})).toEqual([
      "the slider has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
    ]);
    expect(sliderProblems({ range: true, thumbLabels: ["A", "B"] })[0]).toContain(
      "the slider group has no accessible name",
    );
  });

  it("names missing thumb and input labels", () => {
    expect(sliderProblems({ label: "Price", range: true })).toEqual([
      "`range` needs two `thumbLabels`",
    ]);
    expect(sliderProblems({ label: "Price", range: true, thumbLabels: ["Low", ""] })).toEqual([
      "`range` needs two `thumbLabels`",
    ]);
    expect(sliderProblems({ label: "Volume", withInput: true })).toEqual([
      "`withInput` needs `inputLabel`",
    ]);
    expect(
      sliderProblems({ label: "Price", range: true, thumbLabels: ["A", "B"], withInput: true }),
    ).toEqual(["`withInput` with `range` needs two `inputLabels`"]);
  });

  it("names values outside the limits and an impossible minDistance", () => {
    expect(sliderProblems({ label: "Volume", value: 120 })).toEqual([
      "the value 120 is outside `min` (0) and `max` (100); it is shown clamped",
    ]);
    expect(
      sliderProblems({
        label: "Volume",
        snapToMarks: true,
        minDistance: 60,
        marks: [{ value: 20 }, { value: 50 }, { value: 300 }],
      }),
    ).toEqual(["no two marks are `minDistance` (60) apart"]);
  });

  it("warns once per problem with the component name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(() =>
      useSliderWarnings("SliderField", { label: "Volume", withInput: true, loading: true }),
    );
    rerender();
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith("SliderField: `withInput` needs `inputLabel`.");
    expect(warn).toHaveBeenCalledWith("SliderField: `loading` needs `loadingLabel`.");
  });

  it("logs nothing when everything is given", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useSliderWarnings("SliderField", { label: "Volume" }));
    expect(warn).not.toHaveBeenCalled();
  });
});

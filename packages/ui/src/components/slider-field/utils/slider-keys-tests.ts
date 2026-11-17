import { describe, expect, it } from "vitest";
import { keyboardValues, type SliderKeyInput } from "./slider-keys";

function press(key: string, overrides: Partial<SliderKeyInput> = {}) {
  return keyboardValues({
    key,
    shiftKey: false,
    index: 0,
    values: [50],
    orientation: "horizontal",
    direction: "ltr",
    limits: { min: 0, max: 100, step: 1 },
    largeStep: 10,
    ...overrides,
  });
}

describe("keyboardValues", () => {
  it("steps with the arrows", () => {
    expect(press("ArrowRight")).toEqual([51]);
    expect(press("ArrowUp")).toEqual([51]);
    expect(press("ArrowLeft")).toEqual([49]);
    expect(press("ArrowDown")).toEqual([49]);
  });

  it("uses largeStep for PageUp/PageDown and Shift+arrows", () => {
    expect(press("PageUp", { largeStep: 25 })).toEqual([75]);
    expect(press("PageDown", { largeStep: 25 })).toEqual([25]);
    expect(press("ArrowRight", { shiftKey: true })).toEqual([60]);
  });

  it("goes to the limits with Home and End, also with an off-grid max", () => {
    expect(press("Home")).toEqual([0]);
    expect(press("End")).toEqual([100]);
    expect(press("End", { limits: { min: 0, max: 99, step: 5 }, values: [50] })).toEqual([95]);
  });

  it("flips Left and Right in right-to-left horizontal sliders only", () => {
    expect(press("ArrowRight", { direction: "rtl" })).toEqual([49]);
    expect(press("ArrowLeft", { direction: "rtl" })).toEqual([51]);
    expect(press("ArrowUp", { direction: "rtl" })).toEqual([51]);
    expect(press("ArrowRight", { direction: "rtl", orientation: "vertical" })).toEqual([51]);
  });

  it("moves between marks", () => {
    const limits = { min: 0, max: 100, step: 1, marks: [0, 25, 50, 75, 100] };
    expect(press("ArrowRight", { limits, values: [25] })).toEqual([50]);
    expect(press("ArrowLeft", { limits, values: [25] })).toEqual([0]);
    expect(press("PageUp", { limits, values: [25] })).toEqual([75]);
    expect(press("ArrowDown", { limits, values: [25], shiftKey: true })).toEqual([0]);
    expect(press("Home", { limits, values: [50] })).toEqual([0]);
    expect(press("End", { limits, values: [50] })).toEqual([100]);
    expect(press("ArrowRight", { limits, values: [100] })).toEqual([100]);
  });

  it("keeps a range's thumbs apart", () => {
    const range = { values: [40, 45], limits: { min: 0, max: 100, step: 1, minDistance: 5 } };
    expect(press("ArrowRight", { ...range, index: 0 })).toEqual([40, 45]);
    expect(press("ArrowLeft", { ...range, index: 1 })).toEqual([40, 45]);
    expect(press("End", { ...range, index: 0 })).toEqual([40, 45]);
    expect(press("Home", { ...range, index: 1 })).toEqual([40, 45]);
    expect(press("Home", { ...range, index: 0 })).toEqual([0, 45]);
    expect(press("End", { ...range, index: 1 })).toEqual([40, 100]);
    expect(press("PageUp", { values: [20, 25], index: 0 })).toEqual([25, 25]);
  });

  it("leaves other keys to the browser", () => {
    expect(press("Tab")).toBeNull();
    expect(press("a")).toBeNull();
    expect(press("ArrowRight", { index: 3 })).toBeNull();
  });
});

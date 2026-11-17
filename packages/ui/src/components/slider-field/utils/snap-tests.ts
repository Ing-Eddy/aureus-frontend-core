import { describe, expect, it } from "vitest";
import {
  clamp,
  decimalsOf,
  gridMax,
  nearestMark,
  neighbourMark,
  normalizeValues,
  roundToStep,
  snapToward,
  snapValue,
} from "./snap";

const limits = { min: 0, max: 100, step: 1 };

describe("decimalsOf", () => {
  it("counts fraction digits, also in exponent notation", () => {
    expect(decimalsOf(1)).toBe(0);
    expect(decimalsOf(0.05)).toBe(2);
    expect(decimalsOf(1e-7)).toBe(7);
  });
});

describe("clamp and roundToStep", () => {
  it("clamps to the limits", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("rounds to decimal steps without float drift", () => {
    expect(roundToStep(0.30000000000000004, 0, 0.1)).toBe(0.3);
    expect(roundToStep(0.725, 0, 0.01)).toBe(0.73);
    expect(roundToStep(0.7, 0.5, 0.1)).toBe(0.7);
    expect(roundToStep(47, 0, 5)).toBe(45);
    expect(roundToStep(48, 0, 5)).toBe(50);
    expect(roundToStep(7, 1, 3)).toBe(7);
  });

  it("finds the last step below an off-grid max", () => {
    expect(gridMax({ min: 0, max: 99, step: 5 })).toBe(95);
    expect(gridMax({ min: 0, max: 1, step: 0.1 })).toBe(1);
    expect(gridMax({ min: 0, max: 0.3, step: 0.1 })).toBe(0.3);
  });

  it("snaps a value to the grid and within the limits", () => {
    expect(snapValue(101, limits)).toBe(100);
    expect(snapValue(-1, limits)).toBe(0);
    expect(snapValue(98, { min: 0, max: 99, step: 5 })).toBe(95);
  });
});

describe("marks", () => {
  const marks = [0, 25, 50, 75, 100];

  it("finds the nearest mark, the lower one on a tie", () => {
    expect(nearestMark(30, marks)).toBe(25);
    expect(nearestMark(40, marks)).toBe(50);
    expect(nearestMark(12.5, marks)).toBe(0);
  });

  it("moves between marks and stops at the ends", () => {
    expect(neighbourMark(25, marks, 1)).toBe(50);
    expect(neighbourMark(25, marks, -2)).toBe(0);
    expect(neighbourMark(100, marks, 1)).toBe(100);
    expect(neighbourMark(0, marks, -1)).toBe(0);
  });

  it("snaps to marks instead of the grid", () => {
    expect(snapValue(60, { ...limits, marks })).toBe(50);
    expect(snapToward(60, { ...limits, marks }, 1)).toBe(75);
    expect(snapToward(60, { ...limits, marks }, -1)).toBe(50);
  });
});

describe("normalizeValues", () => {
  it("snaps a single value", () => {
    expect(normalizeValues([33.4], limits)).toEqual([33]);
  });

  it("sorts, clamps and snaps a pair", () => {
    expect(normalizeValues([80, 20], limits)).toEqual([20, 80]);
    expect(normalizeValues([-10, 120], limits)).toEqual([0, 100]);
    expect(normalizeValues([22, 78], { ...limits, step: 5 })).toEqual([20, 80]);
  });

  it("keeps minDistance by moving the changed value", () => {
    const withDistance = { ...limits, minDistance: 10 };
    expect(normalizeValues([75, 80], withDistance, 0)).toEqual([70, 80]);
    expect(normalizeValues([75, 80], withDistance, 1)).toEqual([75, 85]);
    // Without an index the high value moves.
    expect(normalizeValues([40, 45], withDistance)).toEqual([40, 50]);
  });

  it("moves the other value when the changed one is at the edge", () => {
    const withDistance = { ...limits, minDistance: 10 };
    expect(normalizeValues([95, 100], withDistance, 1)).toEqual([90, 100]);
    expect(normalizeValues([0, 5], withDistance, 0)).toEqual([0, 10]);
  });

  it("follows the changed value when the pair was given out of order", () => {
    expect(normalizeValues([80, 75], { ...limits, minDistance: 10 }, 1)).toEqual([70, 80]);
  });

  it("keeps minDistance on marks", () => {
    const onMarks = { ...limits, minDistance: 30, marks: [0, 25, 50, 75, 100] };
    expect(normalizeValues([50, 75], onMarks, 0)).toEqual([25, 75]);
    expect(normalizeValues([50, 75], onMarks, 1)).toEqual([50, 100]);
  });
});

import { describe, expect, it } from "vitest";
import {
  clampCrop,
  cropTransform,
  flipCrop,
  initialCrop,
  outputSide,
  rotateCrop,
  visibleSize,
} from "./crop-math";
import { initials } from "./initials";
import { outputName } from "./render-crop";

const landscape = { width: 400, height: 200 };
const portrait = { width: 200, height: 400 };

describe("initials", () => {
  it("takes the first letters of the first and last words, uppercased", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
    expect(initials("ada")).toBe("A");
    expect(initials("  maría   josé  pérez ")).toBe("MP");
    expect(initials("")).toBe("");
    expect(initials(undefined)).toBe("");
  });
  it("uppercases with the locale and keeps astral letters whole", () => {
    expect(initials("ırmak ılgaz", "tr")).toBe("II");
    expect(initials("𝒜da 𝒵ed")).toBe("𝒜𝒵");
  });
});

describe("crop math", () => {
  it("makes the shorter side fill the window at zoom 1", () => {
    expect(visibleSize(initialCrop, landscape)).toEqual({ width: 2, height: 1 });
    expect(visibleSize({ ...initialCrop, rotation: 90 }, landscape)).toEqual({
      width: 1,
      height: 2,
    });
  });

  it("limits the offset so the image always covers the window", () => {
    expect(clampCrop({ ...initialCrop, x: 5, y: 5 }, landscape)).toMatchObject({ x: 0.5, y: 0 });
    expect(clampCrop({ ...initialCrop, zoom: 2, x: -5, y: 5 }, landscape)).toMatchObject({
      x: -1.5,
      y: 0.5,
    });
    expect(clampCrop({ ...initialCrop, rotation: 90, x: 5, y: 5 }, landscape)).toMatchObject({
      x: 0,
      y: 0.5,
    });
    expect(clampCrop({ ...initialCrop, x: 5, y: -5 }, portrait)).toMatchObject({ x: 0, y: -0.5 });
  });

  it("keeps zoom between 1 and 4", () => {
    expect(clampCrop({ ...initialCrop, zoom: 9 }, landscape).zoom).toBe(4);
    expect(clampCrop({ ...initialCrop, zoom: 0 }, landscape).zoom).toBe(1);
  });

  it("rotates what is seen, keeping the centred point in the centre", () => {
    const right = rotateCrop({ ...initialCrop, zoom: 2, x: 0.4, y: 0.1 }, 1, landscape);
    expect(right).toMatchObject({ rotation: 90, x: -0.1, y: 0.4 });
    const back = rotateCrop(right, -1, landscape);
    expect(back).toMatchObject({ rotation: 0, x: 0.4, y: 0.1 });
    expect(rotateCrop(initialCrop, -1, landscape).rotation).toBe(270);
  });

  it("turns the stored rotation the other way while one flip is on", () => {
    const flipped = flipCrop(initialCrop, "x");
    expect(rotateCrop(flipped, 1, landscape).rotation).toBe(270);
  });

  it("mirrors the offset when flipping", () => {
    expect(flipCrop({ ...initialCrop, x: 0.3, y: 0.2 }, "x")).toMatchObject({
      flipX: true,
      x: -0.3,
      y: 0.2,
    });
    expect(flipCrop({ ...initialCrop, x: 0.3, y: 0.2 }, "y")).toMatchObject({
      flipY: true,
      y: -0.2,
    });
  });

  it("never exports more pixels than the crop covers", () => {
    expect(outputSide(initialCrop, landscape, 512)).toBe(200);
    expect(outputSide(initialCrop, landscape, 128)).toBe(128);
    expect(outputSide({ ...initialCrop, zoom: 4 }, landscape, 512)).toBe(50);
  });

  it("gives the canvas operations for a rotation and a flip", () => {
    const state = { ...initialCrop, rotation: 90 as const, flipX: true, x: 0.1 };
    expect(cropTransform(state, landscape, 100)).toEqual({
      translateX: 60,
      translateY: 50,
      scaleX: -0.5,
      scaleY: 0.5,
      rotation: Math.PI / 2,
      drawX: -200,
      drawY: -100,
    });
  });
});

describe("outputName", () => {
  it("replaces the extension with the output type's", () => {
    expect(outputName("me.jpeg", "image/png")).toBe("me.png");
    expect(outputName("photo", "image/webp")).toBe("photo.webp");
    expect(outputName("a.b.c.png", "image/jpeg")).toBe("a.b.c.jpg");
  });
});

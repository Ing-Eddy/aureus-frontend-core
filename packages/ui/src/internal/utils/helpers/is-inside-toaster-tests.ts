import { afterEach, describe, expect, it } from "vitest";
import { isInsideToaster } from "./is-inside-toaster";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("isInsideToaster", () => {
  it("is true for the toaster and anything in it, and false elsewhere", () => {
    document.body.innerHTML =
      '<div data-slot="toast-viewport"><button id="in">x</button></div><button id="out">y</button>';
    expect(isInsideToaster(document.getElementById("in"))).toBe(true);
    expect(isInsideToaster(document.querySelector('[data-slot="toast-viewport"]'))).toBe(true);
    expect(isInsideToaster(document.getElementById("out"))).toBe(false);
    expect(isInsideToaster(null)).toBe(false);
    expect(isInsideToaster(document)).toBe(false);
  });
});

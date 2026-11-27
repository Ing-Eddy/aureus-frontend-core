import { act, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "../toast";
import { toast } from "../utils/helpers";
import { resetToasts, toastElements } from "./render-toaster";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(resetToasts);

/** React's development mode mounts, unmounts and mounts every effect again. */
describe("in StrictMode", () => {
  it("delivers a waiting toast once, and it still closes by itself", async () => {
    toast.info("early");
    render(
      <StrictMode>
        <Toaster label="Notifications" />
      </StrictMode>,
    );
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(toastElements()).toHaveLength(1);
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(toastElements()).toEqual([]);
  });
});

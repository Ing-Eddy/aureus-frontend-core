import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SliderBase, type SliderBaseProps } from "./slider-base";

function renderSlider(props: Partial<SliderBaseProps> = {}) {
  return render(
    <form aria-label="Form">
      <SliderBase
        min={0}
        max={100}
        values={[30]}
        onValueChange={() => {}}
        thumbs={[{ "aria-label": "Volume", "aria-valuetext": "30 %" }]}
        {...props}
      />
    </form>,
  );
}

describe("SliderBase", () => {
  it("names one thumb and gives it its value text", () => {
    renderSlider();
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("30");
    expect(thumb.getAttribute("aria-valuetext")).toBe("30 %");
  });

  it("renders one named thumb per value", () => {
    renderSlider({
      values: [20, 80],
      thumbs: [
        { "aria-label": "Minimum price", "data-thumb-index": 0 },
        { "aria-label": "Maximum price", "data-thumb-index": 1 },
      ],
    });
    const low = screen.getByRole("slider", { name: "Minimum price" });
    const high = screen.getByRole("slider", { name: "Maximum price" });
    expect(low.getAttribute("aria-valuenow")).toBe("20");
    expect(high.getAttribute("aria-valuenow")).toBe("80");
    expect(high.getAttribute("data-thumb-index")).toBe("1");
  });

  it("names the hidden inputs `name` with one value and `name[]` with two", () => {
    const { container, unmount } = renderSlider({ name: "volume" });
    expect(container.querySelectorAll('input[name="volume"]')).toHaveLength(1);
    unmount();
    const range = renderSlider({
      name: "price",
      values: [20, 80],
      thumbs: [{ "aria-label": "Low" }, { "aria-label": "High" }],
    });
    const inputs = range.container.querySelectorAll<HTMLInputElement>('input[name="price[]"]');
    expect([...inputs].map((input) => input.value)).toEqual(["20", "80"]);
  });

  it("forwards disabled and orientation", () => {
    renderSlider({ disabled: true, orientation: "vertical" });
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb.getAttribute("aria-orientation")).toBe("vertical");
    expect(thumb.hasAttribute("data-disabled")).toBe(true);
    expect(thumb.getAttribute("tabindex")).toBeNull();
  });

  it("merges the classes of each part and renders children inside the root", () => {
    const { container } = renderSlider({
      className: "root-extra",
      classNames: { track: "track-extra", range: "range-extra", thumb: "thumb-extra" },
      thumbs: [{ "aria-label": "Volume", className: "own-thumb" }],
      children: <span data-testid="marks" />,
    });
    const root = container.querySelector("form > span");
    expect(root?.className).toContain("root-extra");
    expect(root?.querySelector(".track-extra .range-extra")).not.toBeNull();
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("thumb-extra");
    expect(thumb.className).toContain("own-thumb");
    expect(root?.contains(screen.getByTestId("marks"))).toBe(true);
  });
});

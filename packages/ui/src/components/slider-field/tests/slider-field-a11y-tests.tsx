import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SliderField } from "../slider-field";
import { renderField, thumb } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("SliderField accessibility", () => {
  it("names a single thumb by the label and describes it", () => {
    renderField(
      <SliderField
        id="volume"
        label="Volume"
        required
        error
        errorMessage="Too loud."
        info="Applies to every device."
        infoLabel="More information"
        defaultValue={40}
      />,
    );
    const slider = thumb("Volume");
    expect(slider.id).toBe("volume");
    expect(slider.getAttribute("aria-labelledby")).toBe("volume-label");
    expect(slider.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "volume-helper",
      "volume-info",
    ]);
    expect(slider.getAttribute("aria-required")).toBe("true");
    expect(slider.getAttribute("aria-invalid")).toBe("true");
    expect(slider.getAttribute("aria-valuemin")).toBe("0");
    expect(slider.getAttribute("aria-valuemax")).toBe("100");
    expect(slider.getAttribute("aria-valuenow")).toBe("40");
    expect(slider.getAttribute("aria-valuetext")).toBe("40");
    expect(screen.getByRole("alert").textContent).toBe("Too loud.");
    expect(screen.getByText("Volume").closest("label")?.hasAttribute("for")).toBe(false);
  });

  it("names a range as a group with a name per thumb", () => {
    renderField(
      <SliderField
        label="Precio"
        range
        thumbLabels={["Precio mínimo", "Precio máximo"]}
        helperText="Impuestos incluidos."
      />,
    );
    const group = screen.getByRole("group", { name: "Precio" });
    const low = thumb("Precio mínimo");
    const high = thumb("Precio máximo");
    expect(group.contains(low) && group.contains(high)).toBe(true);
    expect(low.getAttribute("aria-describedby")).toBe(high.getAttribute("aria-describedby"));
    expect(document.getElementById(low.getAttribute("aria-describedby") ?? "")?.textContent).toBe(
      "Impuestos incluidos.",
    );
  });

  it("uses aria-label and aria-labelledby without a label", () => {
    const { unmount } = renderField(<SliderField aria-label="Brightness" />);
    expect(thumb("Brightness")).toBeDefined();
    unmount();
    renderField(
      <>
        <span id="outside">Contrast</span>
        <SliderField aria-labelledby="outside" />
      </>,
    );
    expect(thumb("Contrast")).toBeDefined();
    renderField(
      <SliderField aria-label="Budget" range thumbLabels={["From", "To"]} defaultValue={[1, 2]} />,
    );
    expect(screen.getByRole("group", { name: "Budget" })).toBeDefined();
  });

  it("formats the value text", () => {
    renderField(
      <SliderField
        label="Volume"
        defaultValue={0.4}
        max={1}
        step={0.01}
        locale="en-US"
        formatOptions={{ style: "percent" }}
      />,
    );
    expect(thumb("Volume").getAttribute("aria-valuetext")).toBe("40%");
  });

  it("sets aria-orientation in vertical sliders", () => {
    renderField(<SliderField label="Level" orientation="vertical" />);
    expect(thumb("Level").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("marks the thumbs busy and disabled while loading", () => {
    renderField(<SliderField label="Volume" loading loadingLabel="Saving" />);
    const slider = thumb("Volume");
    expect(slider.getAttribute("aria-busy")).toBe("true");
    expect(slider.hasAttribute("data-disabled")).toBe(true);
    expect(screen.getByRole("status", { name: "Saving" })).toBeDefined();
  });

  it("warns about a slider without an accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<SliderField />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("SliderField: the slider has no accessible name"),
    );
  });
});

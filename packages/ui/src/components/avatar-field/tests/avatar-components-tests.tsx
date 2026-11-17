import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AvatarPreview, CropArea, EditorToolbar, ZoomSlider } from "../components";
import { initialCrop } from "../utils";

describe("AvatarPreview", () => {
  it("shows the consumer's fallback first, then the initials, then an icon", () => {
    const { rerender, container } = render(
      <AvatarPreview
        shape="circle"
        size="lg"
        fallback={<span>Sin foto</span>}
        initialsFrom="Ada Lovelace"
      />,
    );
    expect(container.textContent).toBe("Sin foto");
    rerender(<AvatarPreview shape="circle" size="lg" initialsFrom="Ada Lovelace" />);
    expect(container.textContent).toBe("");
    expect(
      container.querySelector("[data-slot=avatar-initials]")?.getAttribute("data-initials"),
    ).toBe("AL");
    rerender(<AvatarPreview shape="square" size="sm" />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("[data-slot=avatar]")?.className).toContain("rounded-lg");
  });

  it("shows a named progress ring with its value", () => {
    render(
      <AvatarPreview
        shape="circle"
        size="lg"
        progress={{ value: 42.4, label: "Subiendo ada.jpg" }}
      />,
    );
    const ring = screen.getByRole("progressbar", { name: "Subiendo ada.jpg" });
    expect(ring.getAttribute("aria-valuenow")).toBe("42");
  });
});

describe("editor controls", () => {
  it("names the zoom slider's thumb and gives it a value text", () => {
    render(<ZoomSlider value={1.5} onValueChange={() => {}} label="Zoom" locale="es-ES" />);
    const slider = screen.getByRole("slider", { name: "Zoom" });
    expect(slider.getAttribute("aria-valuetext")).toBe("1,5×");
  });

  it("names every toolbar button and calls its action", () => {
    const rotate = vi.fn();
    const flip = vi.fn();
    render(
      <EditorToolbar
        texts={{
          zoomLabel: "Zoom",
          rotateLeftLabel: "Girar a la izquierda",
          rotateRightLabel: "Girar a la derecha",
          flipHorizontalLabel: "Voltear en horizontal",
          flipVerticalLabel: "Voltear en vertical",
        }}
        zoom={1}
        zoomTo={() => {}}
        rotate={rotate}
        flip={flip}
        disabled={false}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Girar a la derecha" }));
    fireEvent.click(screen.getByRole("button", { name: "Girar a la izquierda" }));
    fireEvent.click(screen.getByRole("button", { name: "Voltear en horizontal" }));
    fireEvent.click(screen.getByRole("button", { name: "Voltear en vertical" }));
    expect(rotate.mock.calls).toEqual([[1], [-1]]);
    expect(flip.mock.calls).toEqual([["x"], ["y"]]);
  });

  it("names the crop area, makes it focusable and moves with the keys", () => {
    const moveBy = vi.fn();
    render(
      <CropArea
        src="blob:x"
        size={{ width: 400, height: 200 }}
        state={initialCrop}
        shape="circle"
        label="Área de recorte"
        moveBy={moveBy}
        zoomTo={() => {}}
        center={() => {}}
        disabled={false}
      />,
    );
    const area = screen.getByRole("application", { name: "Área de recorte" });
    expect(area.tabIndex).toBe(0);
    fireEvent.keyDown(area, { key: "ArrowRight" });
    expect(moveBy).toHaveBeenCalled();
    expect(area.querySelector("[data-slot=crop-mask]")?.className).toContain("rounded-full");
  });
});

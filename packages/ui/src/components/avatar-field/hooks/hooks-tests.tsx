import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { missingTextProblems } from "@/internal/hooks";
import { initialCrop } from "../utils";
import { type AvatarWarningSources, avatarWarningChecks } from "./use-avatar-warnings";
import { MOVE_STEP, useCropDrag } from "./use-crop-drag";
import { editorReducer, useImageEditor } from "./use-image-editor";

const size = { width: 400, height: 200 };

describe("editor state", () => {
  it("zooms, moves, rotates, flips and resets, always clamped", () => {
    const { result } = renderHook(() => useImageEditor(size));
    act(() => result.current.zoomTo(2));
    act(() => result.current.moveBy(10, 10));
    expect(result.current.state).toMatchObject({ zoom: 2, x: 1.5, y: 0.5 });
    act(() => result.current.rotate(1));
    expect(result.current.state.rotation).toBe(90);
    act(() => result.current.flip("x"));
    expect(result.current.state.flipX).toBe(true);
    act(() => result.current.center());
    expect(result.current.state).toMatchObject({ x: 0, y: 0 });
    act(() => result.current.reset());
    expect(result.current.state).toEqual(initialCrop);
  });

  it("keeps the initial framing until the size is known", () => {
    const { result } = renderHook(() => useImageEditor(undefined));
    act(() => result.current.zoomTo(3));
    expect(result.current.state).toEqual(initialCrop);
  });

  it("clamps zoom through the reducer", () => {
    expect(editorReducer(initialCrop, { type: "zoom", zoom: 10 }, size).zoom).toBe(4);
  });
});

function CropHarness(props: { moveBy: () => void; zoomTo: () => void; center: () => void }) {
  const handlers = useCropDrag({ zoom: 1.5, disabled: false, ...props });
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: the crop area is a focusable custom widget driven by the keyboard.
    <div role="application" aria-label="Crop" tabIndex={0} {...handlers} />
  );
}

describe("useCropDrag keyboard", () => {
  it("moves in the arrow's direction, zooms and centres", () => {
    const moveBy = vi.fn();
    const zoomTo = vi.fn();
    const center = vi.fn();
    render(<CropHarness moveBy={moveBy} zoomTo={zoomTo} center={center} />);
    const area = screen.getByRole("application", { name: "Crop" });
    fireEvent.keyDown(area, { key: "ArrowLeft" });
    expect(moveBy).toHaveBeenLastCalledWith(-MOVE_STEP, 0);
    fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    expect(moveBy).toHaveBeenLastCalledWith(0, 0.1);
    fireEvent.keyDown(area, { key: "+" });
    expect(zoomTo).toHaveBeenLastCalledWith(1.6);
    fireEvent.keyDown(area, { key: "-" });
    expect(zoomTo.mock.lastCall?.[0]).toBeCloseTo(1.4);
    fireEvent.keyDown(area, { key: "Home" });
    expect(center).toHaveBeenCalled();
  });

  it("moves in the arrow's visual direction in right-to-left pages too", () => {
    const moveBy = vi.fn();
    render(
      <div dir="rtl">
        <CropHarness moveBy={moveBy} zoomTo={() => {}} center={() => {}} />
      </div>,
    );
    fireEvent.keyDown(screen.getByRole("application"), { key: "ArrowLeft" });
    expect(moveBy).toHaveBeenLastCalledWith(-MOVE_STEP, 0);
  });
});

const problems = (props: AvatarWarningSources) => missingTextProblems(avatarWarningChecks(props));
const base = {
  label: "Foto",
  getFileInfo: () => ({}),
  chooseLabel: "Subir",
  changeLabel: "Cambiar",
  inspectLabel: () => "",
  dialogTitle: "Foto",
  closeLabel: "Cerrar",
};

describe("avatar field warnings", () => {
  it("is silent when every text is given", () => {
    expect(problems(base)).toEqual([]);
  });
  it("names the always-required texts", () => {
    expect(problems({ label: "Foto" })).toEqual([
      "the avatar field needs `inspectLabel`",
      "the avatar field needs `dialogTitle`",
      "the avatar field needs `closeLabel`",
      "the avatar field needs `getFileInfo`",
      "the circular button needs `chooseLabel`",
      "the circular button needs `changeLabel`",
    ]);
  });
  it("needs no button texts when read-only, and names editing features it ignores", () => {
    const { chooseLabel: _choose, changeLabel: _change, ...viewOnly } = base;
    expect(problems({ ...viewOnly, readOnly: true })).toEqual([]);
    expect(problems({ ...viewOnly, readOnly: true, removable: true, removeLabel: "x" })).toEqual([
      "`readOnly` cannot be combined with `editable`, `removable`, `dropzone`, `pasteable` or `upload`; they are ignored",
    ]);
  });
  it("names each feature's texts", () => {
    expect(problems({ ...base, removable: true })).toEqual(["`removable` needs `removeLabel`"]);
    expect(problems({ ...base, downloadable: true })).toEqual([
      "`downloadable` needs `downloadLabel`",
    ]);
    expect(problems({ ...base, editable: true })).toHaveLength(10);
    expect(problems({ ...base, dropzone: true })).toEqual(["`dropzone` needs `dropzoneText`"]);
    expect(problems({ ...base, upload: () => {} })).toHaveLength(4);
  });
});

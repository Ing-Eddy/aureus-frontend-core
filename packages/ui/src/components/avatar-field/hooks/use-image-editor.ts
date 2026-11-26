import { useCallback, useReducer } from "react";
import {
  type CropState,
  clampCrop,
  flipCrop,
  type ImageSize,
  initialCrop,
  rotateCrop,
} from "../utils";

/** The edits of the crop editor. */
type EditorAction =
  | {
      /** The edit to apply. */
      type: "zoom";
      /** The new zoom. */
      zoom: number;
    }
  | {
      type: "move";
      /** Horizontal move, in fractions of the window. */
      dx: number;
      /** Vertical move, in fractions of the window. */
      dy: number;
    }
  | { type: "center" }
  | {
      type: "rotate";
      /** 1 clockwise, -1 counter-clockwise. */
      direction: 1 | -1;
    }
  | {
      type: "flip";
      /** The axis to mirror. */
      axis: "x" | "y";
    }
  | { type: "reset" };

/** Applies one editing action; the result is always clamped, so the image covers the window. */
export function editorReducer(state: CropState, action: EditorAction, size: ImageSize): CropState {
  switch (action.type) {
    case "zoom":
      // Hundredths, so repeated steps do not drift (1.1 + 0.1 is 1.2, not 1.2000000000000002).
      return clampCrop({ ...state, zoom: Math.round(action.zoom * 100) / 100 }, size);
    case "move":
      return clampCrop({ ...state, x: state.x + action.dx, y: state.y + action.dy }, size);
    case "center":
      return { ...state, x: 0, y: 0 };
    case "rotate":
      return rotateCrop(state, action.direction, size);
    case "flip":
      return flipCrop(state, action.axis);
    case "reset":
      return initialCrop;
  }
}

/**
 * The framing of the image being edited and its actions: zoom, move (in window fractions),
 * centre, rotate by 90°, flip and reset. Without a size yet, actions keep the initial framing.
 */
export function useImageEditor(size: ImageSize | undefined) {
  const [state, dispatch] = useReducer(
    (current: CropState, action: EditorAction) =>
      size ? editorReducer(current, action, size) : current,
    initialCrop,
  );
  return {
    state,
    zoomTo: useCallback((zoom: number) => dispatch({ type: "zoom", zoom }), []),
    moveBy: useCallback((dx: number, dy: number) => dispatch({ type: "move", dx, dy }), []),
    center: useCallback(() => dispatch({ type: "center" }), []),
    rotate: useCallback((direction: 1 | -1) => dispatch({ type: "rotate", direction }), []),
    flip: useCallback((axis: "x" | "y") => dispatch({ type: "flip", axis }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
  };
}

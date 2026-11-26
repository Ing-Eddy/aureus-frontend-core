/** The framing of an image inside the square crop window. */
export interface CropState {
  /** From `MIN_ZOOM` to `MAX_ZOOM`; 1 makes the image's shorter side fill the window. */
  zoom: number;
  /** Offset of the image's centre from the window's centre, as a fraction of the window side. */
  x: number;
  /** Vertical offset, like `x`. */
  y: number;
  /** Clockwise rotation, in degrees. */
  rotation: 0 | 90 | 180 | 270;
  /** Mirrors what is shown, horizontally and vertically. */
  flipX: boolean;
  /** Mirrors vertically. */
  flipY: boolean;
}

/** The size of an image, in pixels. */
export interface ImageSize {
  /** Width in pixels. */
  width: number;
  /** Height in pixels. */
  height: number;
}

/** The image fills the window. */
export const MIN_ZOOM = 1;
/** Four times the minimum. */
export const MAX_ZOOM = 4;

/** The framing before any edit: centred, unrotated, unflipped. */
export const initialCrop: CropState = {
  zoom: 1,
  x: 0,
  y: 0,
  rotation: 0,
  flipX: false,
  flipY: false,
};

/** The image's size once rotated. */
export function rotatedSize({ width, height }: ImageSize, rotation: number): ImageSize {
  return rotation % 180 === 0 ? { width, height } : { width: height, height: width };
}

/** The image's visible size in window units: at zoom 1 its shorter side is exactly 1. */
export function visibleSize(state: CropState, size: ImageSize): ImageSize {
  const rotated = rotatedSize(size, state.rotation);
  const base = 1 / Math.min(rotated.width, rotated.height);
  return { width: rotated.width * base * state.zoom, height: rotated.height * base * state.zoom };
}

/** `value` limited to `[-limit, limit]`. */
const clamp = (value: number, limit: number) => Math.min(limit, Math.max(-limit, value));

/** The state with zoom in range and the offset limited so the image always covers the window. */
export function clampCrop(state: CropState, size: ImageSize): CropState {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.zoom));
  const visible = visibleSize({ ...state, zoom }, size);
  return {
    ...state,
    zoom,
    // `|| 0` turns -0 into 0, so equal framings compare equal.
    x: clamp(state.x, (visible.width - 1) / 2) || 0,
    y: clamp(state.y, (visible.height - 1) / 2) || 0,
  };
}

/**
 * Rotates what the user sees by 90° (`1` clockwise, `-1` counter-clockwise), keeping the point
 * at the window's centre in the centre. With exactly one flip on, the stored rotation turns the
 * other way, so the visible image always turns the requested way.
 */
export function rotateCrop(state: CropState, direction: 1 | -1, size: ImageSize): CropState {
  const stored = state.flipX !== state.flipY ? -direction : direction;
  const rotation = (((state.rotation + stored * 90) % 360) + 360) % 360;
  const offset = direction === 1 ? { x: -state.y, y: state.x } : { x: state.y, y: -state.x };
  return clampCrop({ ...state, ...offset, rotation: rotation as CropState["rotation"] }, size);
}

/** Mirrors what the user sees, keeping the centred point in the centre. */
export function flipCrop(state: CropState, axis: "x" | "y"): CropState {
  return axis === "x"
    ? { ...state, flipX: !state.flipX, x: -state.x || 0 }
    : { ...state, flipY: !state.flipY, y: -state.y || 0 };
}

/**
 * The side of the exported image: `outputSize`, but never more than the source pixels the
 * window covers, so a crop is never upscaled.
 */
export function outputSide(state: CropState, size: ImageSize, outputSize: number): number {
  const rotated = rotatedSize(size, state.rotation);
  const covered = Math.min(rotated.width, rotated.height) / state.zoom;
  return Math.max(1, Math.round(Math.min(outputSize, covered)));
}

/** The canvas operations that draw the framed image on a square canvas of side `side`. */
export interface CropTransform {
  /** Canvas position of the image's centre. */
  translateX: number;
  /** Canvas position of the image's centre. */
  translateY: number;
  /** Scale, negative to flip. */
  scaleX: number;
  /** Scale, negative to flip. */
  scaleY: number;
  /** Radians, clockwise. */
  rotation: number;
  /** Where the untransformed image is drawn: centred on the origin. */
  drawX: number;
  /** Vertical draw position. */
  drawY: number;
}

/**
 * `translate`, then `scale` (the flips, in screen space), then `rotate`, then draw the image at
 * `(drawX, drawY)`. The same numbers style the on-screen preview, so what is seen is what is saved.
 */
export function cropTransform(state: CropState, size: ImageSize, side: number): CropTransform {
  const rotated = rotatedSize(size, state.rotation);
  const scale = (side * state.zoom) / Math.min(rotated.width, rotated.height);
  return {
    translateX: side / 2 + state.x * side,
    translateY: side / 2 + state.y * side,
    scaleX: scale * (state.flipX ? -1 : 1),
    scaleY: scale * (state.flipY ? -1 : 1),
    rotation: (state.rotation * Math.PI) / 180,
    drawX: -size.width / 2,
    drawY: -size.height / 2,
  };
}

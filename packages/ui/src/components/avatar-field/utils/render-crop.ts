import { type CropState, cropTransform, type ImageSize, outputSide } from "./crop-math";

/** The image types an edit can export. */
export type AvatarOutputType = "image/png" | "image/jpeg" | "image/webp";

/** How `renderCrop` exports. */
export interface RenderCropOptions {
  /** Largest side, in pixels. */
  outputSize: number;
  /** Image type. */
  outputType: AvatarOutputType;
  /** From 0 to 1, for JPEG and WebP. */
  outputQuality: number;
  /** The original file name; the extension is replaced by the output type's. */
  name: string;
}

/** Why an edit could not be applied. */
export class AvatarEditError extends Error {
  readonly reason: "cors" | "render";
  constructor(reason: "cors" | "render", cause?: unknown) {
    super(
      reason === "cors"
        ? "The image cannot be read: its server must allow CORS to edit it."
        : "The image could not be rendered.",
      { cause },
    );
    this.name = "AvatarEditError";
    this.reason = reason;
  }
}

/** File extension of each output type. */
const extensions: Record<AvatarOutputType, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/** The file name with the output type's extension. */
export function outputName(name: string, type: AvatarOutputType): string {
  const base = name.replace(/\.[^./]+$/, "") || "image";
  return `${base}.${extensions[type]}`;
}

/** Draws the framed image on a square canvas and exports it as a new file. */
export async function renderCrop(
  image: CanvasImageSource,
  size: ImageSize,
  state: CropState,
  options: RenderCropOptions,
): Promise<File> {
  const side = outputSide(state, size, options.outputSize);
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const context = canvas.getContext("2d");
  if (!context) throw new AvatarEditError("render");
  const t = cropTransform(state, size, side);
  context.imageSmoothingQuality = "high";
  context.translate(t.translateX, t.translateY);
  context.scale(t.scaleX, t.scaleY);
  context.rotate(t.rotation);
  context.drawImage(image, t.drawX, t.drawY, size.width, size.height);

  let blob: Blob | null;
  try {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, options.outputType, options.outputQuality),
    );
  } catch (error) {
    throw new AvatarEditError(
      error instanceof DOMException && error.name === "SecurityError" ? "cors" : "render",
      error,
    );
  }
  if (!blob) throw new AvatarEditError("render");
  return new File([blob], outputName(options.name, options.outputType), {
    type: options.outputType,
  });
}

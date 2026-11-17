import type { FileInfo } from "@aureus-core/ui/components/file-field";
import { asset } from "./asset";

/** A profile photo as the demo backend stores it. */
export interface StoredPhoto {
  id: number;
  filename: string;
  url: string;
}

/** A stored photo served from `public/avatars/` (same origin, so it can be edited). */
export const storedPhoto: StoredPhoto = {
  id: 7,
  filename: "ada.svg",
  url: asset("/avatars/ada.svg"),
};

/** A stored photo whose URL fails to load, to show the fallback. */
export const brokenPhoto: StoredPhoto = {
  id: 8,
  filename: "missing.png",
  url: asset("/avatars/missing.png"),
};

/** What an avatar field shows for a stored photo. */
export const storedPhotoInfo = (photo: StoredPhoto): FileInfo => ({
  name: photo.filename,
  url: photo.url,
  type: photo.filename.endsWith(".svg") ? "image/svg+xml" : "image/png",
});

/**
 * A 400×200 PNG whose left half is red and right half is blue, as a picked file. Rotating it right
 * puts red on top and blue below, which the Edit story reads back from the exported pixels.
 */
export async function twoColourPhoto(name = "flag.png"): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("no canvas");
  context.fillStyle = "#ff0000";
  context.fillRect(0, 0, 200, 200);
  context.fillStyle = "#0000ff";
  context.fillRect(200, 0, 200, 200);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("toBlob"))),
      "image/png",
    ),
  );
  return new File([blob], name, { type: "image/png" });
}

/** The colour of a pixel of an image file, as `[r, g, b]`, and its size. */
export async function readPixel(file: Blob, x: number, y: number) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("no canvas");
  context.drawImage(bitmap, 0, 0);
  const [r = 0, g = 0, b = 0] = context.getImageData(x, y, 1, 1).data;
  return { rgb: [r, g, b] as const, width: bitmap.width, height: bitmap.height };
}

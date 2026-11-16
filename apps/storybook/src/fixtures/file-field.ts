import type { FileInfo, FileUploadContext } from "@aureus-core/ui/components/file-field";
import { asset } from "./asset";

/** A file as the demo backend stores it: its own id, file name, URL, size and type. */
export interface StoredFile {
  id: number;
  filename: string;
  url: string;
  bytes?: number;
  mime?: string;
}

/** Files already stored, for update forms. Images point at local SVGs in `public/images/`. */
export const storedFiles: StoredFile[] = [
  {
    id: 101,
    filename: "mountains.svg",
    url: asset("/images/mountains.svg"),
    bytes: 48_213,
    mime: "image/svg+xml",
  },
  {
    id: 102,
    filename: "desert.svg",
    url: asset("/images/desert.svg"),
    bytes: 51_002,
    mime: "image/svg+xml",
  },
  {
    id: 103,
    filename: "forest.svg",
    url: asset("/images/forest.svg"),
    bytes: 46_880,
    mime: "image/svg+xml",
  },
];

/** What a file field shows for a stored file. */
export const storedFileInfo = (file: StoredFile): FileInfo => ({
  name: file.filename,
  url: file.url,
  size: file.bytes,
  type: file.mime,
});

const sunsetSvg = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="${color}"/><circle cx="230" cy="70" r="34" fill="#fff" fill-opacity="0.7"/><path d="M0 160 L90 110 L170 150 L250 100 L320 140 L320 200 L0 200 Z" fill="#000" fill-opacity="0.25"/></svg>`;

/** A small SVG image, as a picked file. */
export const imageFile = (name = "sunset.svg", color = "#f97316") =>
  new File([sunsetSvg(color)], name, { type: "image/svg+xml" });

/** A PDF-like file of the given size, as a picked file. */
export const pdfFile = (name = "contract.pdf", size = 240_000) =>
  new File([new Uint8Array(size)], name, { type: "application/pdf" });

/** A text file, as a picked file. */
export const textFile = (name = "notes.txt") =>
  new File(["Meeting notes"], name, { type: "text/plain" });

/** A real `DataTransfer` holding files. */
function transferOf(files: File[]) {
  const transfer = new DataTransfer();
  for (const file of files) transfer.items.add(file);
  return transfer;
}

/**
 * Dispatches a native drag event (`dragenter`, `dragover`, `drop`) carrying files, as the browser
 * does when files are dragged from the desktop.
 */
export function dragFiles(
  target: Element,
  type: "dragenter" | "dragover" | "drop",
  ...files: File[]
) {
  target.dispatchEvent(
    new DragEvent(type, { dataTransfer: transferOf(files), bubbles: true, cancelable: true }),
  );
}

/** Dispatches a native paste event carrying files, as the browser does on Ctrl+V / Cmd+V. */
export function pasteFiles(target: Element, ...files: File[]) {
  target.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: transferOf(files),
      bubbles: true,
      cancelable: true,
    }),
  );
}

let nextId = 500;

/**
 * A fake upload: reports progress in steps, then resolves with a stored file (its URL is an
 * object URL of the file, so images preview), or rejects when `fails(file)` is true. It stops
 * when the signal aborts, as a real request would.
 */
export function simulateUpload(
  file: File,
  { signal, onProgress }: FileUploadContext,
  { step = 120, fails = (f: File) => f.name.startsWith("fail") } = {},
): Promise<StoredFile> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      onProgress(Math.min(progress, 100));
      if (progress < 100) return;
      clearInterval(timer);
      if (fails(file)) {
        reject(new Error("The server rejected the file."));
        return;
      }
      nextId += 1;
      resolve({
        id: nextId,
        filename: file.name,
        url: URL.createObjectURL(file),
        bytes: file.size,
        mime: file.type,
      });
    }, step);
    signal.addEventListener("abort", () => {
      clearInterval(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** Turns an image into a PNG at most `width` pixels wide, like a `transform` that downsizes. */
export async function toSmallPng(file: File, width = 160): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, width / image.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("toBlob"))),
        "image/png",
      ),
    );
    return new File([blob], file.name.replace(/\.\w+$/, ".png"), { type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

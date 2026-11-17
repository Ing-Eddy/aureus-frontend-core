import { useEffect, useState } from "react";
import type { ImageSize } from "../utils";

export interface LoadedImage {
  image: HTMLImageElement;
  size: ImageSize;
}

/**
 * Loads an image for editing. Remote images are requested with CORS (`crossOrigin`), so their
 * pixels can be exported; without the server's permission the export fails and is reported.
 * `undefined` while loading, `null` without a source or when it fails to load.
 */
export function useLoadedImage(src: string | undefined) {
  const [state, setState] = useState<{ src?: string; loaded?: LoadedImage | null }>({});

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const image = new Image();
    if (!src.startsWith("blob:") && !src.startsWith("data:")) image.crossOrigin = "anonymous";
    image.src = src;
    const ready =
      typeof image.decode === "function"
        ? image.decode()
        : new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("load"));
          });
    ready
      .then(() => {
        if (cancelled) return;
        setState({
          src,
          loaded: { image, size: { width: image.naturalWidth, height: image.naturalHeight } },
        });
      })
      .catch(() => {
        if (!cancelled) setState({ src, loaded: null });
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return null;
  return state.src === src ? state.loaded : undefined;
}

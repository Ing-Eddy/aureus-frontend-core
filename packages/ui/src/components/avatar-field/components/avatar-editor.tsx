import { Loader2Icon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { useImageEditor, useLoadedImage } from "../hooks";
import type { CropState, ImageSize } from "../utils";
import { CropArea } from "./crop-area";
import { EditorToolbar, type EditorToolbarTexts } from "./editor-toolbar";

export interface AvatarEditorTexts extends EditorToolbarTexts {
  cropAreaLabel: string;
  resetLabel: ReactNode;
  applyLabel: ReactNode;
  cancelLabel: ReactNode;
}

export interface AvatarEditorProps {
  /** The image to edit: an object URL for a picked file, or the stored photo's URL. */
  src: string;
  shape: "circle" | "square";
  texts: AvatarEditorTexts;
  locale?: string;
  disabled: boolean;
  /** Renders and stores the edit; the editor waits for it. */
  onApply: (image: HTMLImageElement, size: ImageSize, state: CropState) => Promise<void>;
  onCancel: () => void;
}

/**
 * The editor view of the dialog: the crop area, the toolbar, and reset, cancel and apply.
 * It loads the image with CORS so its pixels can be exported.
 */
export function AvatarEditor({
  src,
  shape,
  texts,
  locale,
  disabled,
  onApply,
  onCancel,
}: AvatarEditorProps) {
  const loaded = useLoadedImage(src);
  const editor = useImageEditor(loaded?.size);
  const [busy, setBusy] = useState(false);
  const locked = disabled || busy || !loaded;

  return (
    <div data-slot="avatar-editor" className="flex flex-col items-center gap-4">
      {loaded ? (
        <CropArea
          src={src}
          size={loaded.size}
          state={editor.state}
          shape={shape}
          label={texts.cropAreaLabel}
          moveBy={editor.moveBy}
          zoomTo={editor.zoomTo}
          center={editor.center}
          disabled={locked}
        />
      ) : (
        <div className="flex aspect-square w-full max-w-72 items-center justify-center rounded-lg bg-muted">
          {loaded === undefined ? (
            <Loader2Icon
              aria-hidden="true"
              className="size-5 animate-spin motion-reduce:animate-none"
            />
          ) : null}
        </div>
      )}
      <EditorToolbar
        texts={texts}
        zoom={editor.state.zoom}
        zoomTo={editor.zoomTo}
        rotate={editor.rotate}
        flip={editor.flip}
        locale={locale}
        disabled={locked}
      />
      <div className="flex w-full flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={locked}
          onClick={editor.reset}
          className="me-auto"
        >
          {texts.resetLabel}
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
          {texts.cancelLabel}
        </Button>
        <Button
          type="button"
          disabled={locked}
          onClick={async () => {
            if (!loaded) return;
            setBusy(true);
            try {
              await onApply(loaded.image, loaded.size, editor.state);
            } finally {
              setBusy(false);
            }
          }}
        >
          {texts.applyLabel}
        </Button>
      </div>
    </div>
  );
}

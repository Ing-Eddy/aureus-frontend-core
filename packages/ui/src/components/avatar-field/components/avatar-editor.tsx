import { Loader2Icon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { useImageEditor, useLoadedImage } from "../hooks";
import type { CropState, ImageSize } from "../utils";
import { CropArea } from "./crop-area";
import { EditorToolbar, type EditorToolbarTexts } from "./editor-toolbar";

/** The names of the editor's controls. */
export interface AvatarEditorTexts extends EditorToolbarTexts {
  /** Name of the crop area. */
  cropAreaLabel: string;
  /** Text of the reset button. */
  resetLabel: ReactNode;
  /** Text of the apply button. */
  applyLabel: ReactNode;
  /** Text of the cancel button. */
  cancelLabel: ReactNode;
}

/** Props of `AvatarEditor`. */
export interface AvatarEditorProps {
  /** The image to edit: an object URL for a picked file, or the stored photo's URL. */
  src: string;
  /** The mask shown over the crop. */
  shape: "circle" | "square";
  /** Names of the controls. */
  texts: AvatarEditorTexts;
  /** Locale of the zoom value. */
  locale?: string;
  /** Disabled or loading. */
  disabled: boolean;
  /** Renders and stores the edit; the editor waits for it. */
  onApply: (image: HTMLImageElement, size: ImageSize, state: CropState) => Promise<void>;
  /** Leaves the editor without applying. */
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

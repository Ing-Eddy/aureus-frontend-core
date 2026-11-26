import {
  FlipHorizontal2Icon,
  FlipVertical2Icon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
} from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { ZoomSlider } from "./zoom-slider";

/** The names of the toolbar's controls. */
export interface EditorToolbarTexts {
  /** Name of the zoom slider. */
  zoomLabel: string;
  /** Name of the rotate-left button. */
  rotateLeftLabel: string;
  /** Name of the rotate-right button. */
  rotateRightLabel: string;
  /** Name of the horizontal flip button. */
  flipHorizontalLabel: string;
  /** Name of the vertical flip button. */
  flipVerticalLabel: string;
}

/** Props of `EditorToolbar`. */
export interface EditorToolbarProps {
  /** Names of the controls. */
  texts: EditorToolbarTexts;
  /** Current zoom. */
  zoom: number;
  /** Sets the zoom. */
  zoomTo: (zoom: number) => void;
  /** Turns 90° one way or the other. */
  rotate: (direction: 1 | -1) => void;
  /** Mirrors on an axis. */
  flip: (axis: "x" | "y") => void;
  /** Locale of the zoom value. */
  locale?: string;
  /** Disables every control. */
  disabled: boolean;
}

/** Icon buttons keep a 32 px target, and 44 px on coarse pointers. */
const toolClassName = "pointer-coarse:size-11";

/** Zoom slider, rotate left and right, and flip horizontally and vertically. */
export function EditorToolbar({
  texts,
  zoom,
  zoomTo,
  rotate,
  flip,
  locale,
  disabled,
}: EditorToolbarProps) {
  return (
    <div data-slot="editor-toolbar" className="flex w-full max-w-72 flex-col gap-3">
      <div className="flex items-center gap-2">
        <ZoomInIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <ZoomSlider
          value={zoom}
          onValueChange={zoomTo}
          label={texts.zoomLabel}
          locale={locale}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={texts.rotateLeftLabel}
          disabled={disabled}
          onClick={() => rotate(-1)}
          className={toolClassName}
        >
          <RotateCcwIcon aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={texts.rotateRightLabel}
          disabled={disabled}
          onClick={() => rotate(1)}
          className={toolClassName}
        >
          <RotateCwIcon aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={texts.flipHorizontalLabel}
          disabled={disabled}
          onClick={() => flip("x")}
          className={toolClassName}
        >
          <FlipHorizontal2Icon aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={texts.flipVerticalLabel}
          disabled={disabled}
          onClick={() => flip("y")}
          className={toolClassName}
        >
          <FlipVertical2Icon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

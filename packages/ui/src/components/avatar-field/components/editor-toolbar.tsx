import {
  FlipHorizontal2Icon,
  FlipVertical2Icon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
} from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { ZoomSlider } from "./zoom-slider";

export interface EditorToolbarTexts {
  zoomLabel: string;
  rotateLeftLabel: string;
  rotateRightLabel: string;
  flipHorizontalLabel: string;
  flipVerticalLabel: string;
}

export interface EditorToolbarProps {
  texts: EditorToolbarTexts;
  zoom: number;
  zoomTo: (zoom: number) => void;
  rotate: (direction: 1 | -1) => void;
  flip: (axis: "x" | "y") => void;
  locale?: string;
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

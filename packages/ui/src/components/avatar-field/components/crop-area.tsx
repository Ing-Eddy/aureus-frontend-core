import { cn } from "@/shadcn/lib/utils";
import { useCropDrag } from "../hooks";
import type { CropState, ImageSize } from "../utils";
import { rotatedSize } from "../utils";

export interface CropAreaProps {
  src: string;
  size: ImageSize;
  state: CropState;
  shape: "circle" | "square";
  label: string;
  moveBy: (dx: number, dy: number) => void;
  zoomTo: (zoom: number) => void;
  center: () => void;
  disabled: boolean;
  className?: string;
}

/**
 * The square crop window. The image is positioned with the same numbers the export uses (the
 * window side is `100cqw`), so what is seen is exactly what is saved. With `shape="circle"`, the
 * corners outside the circle are dimmed. Drag it, or focus it and use the arrow keys, `+`/`-` and
 * Home.
 */
export function CropArea({
  src,
  size,
  state,
  shape,
  label,
  moveBy,
  zoomTo,
  center,
  disabled,
  className,
}: CropAreaProps) {
  const handlers = useCropDrag({ zoom: state.zoom, moveBy, zoomTo, center, disabled });
  const rotated = rotatedSize(size, state.rotation);
  const unit = state.zoom / Math.min(rotated.width, rotated.height);
  return (
    <div
      role="application"
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      data-slot="crop-area"
      {...handlers}
      className={cn(
        "@container relative aspect-square w-full max-w-72 cursor-grab touch-none overflow-hidden rounded-lg bg-muted outline-none select-none active:cursor-grabbing",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        data-slot="crop-image"
        className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
        style={{
          width: `calc(100cqw * ${size.width * unit})`,
          height: `calc(100cqw * ${size.height * unit})`,
          transform: `translate(-50%, -50%) translate(calc(100cqw * ${state.x}), calc(100cqw * ${state.y})) scale(${state.flipX ? -1 : 1}, ${state.flipY ? -1 : 1}) rotate(${state.rotation}deg)`,
        }}
      />
      <div
        aria-hidden="true"
        data-slot="crop-mask"
        className={cn(
          "pointer-events-none absolute inset-0 shadow-[0_0_0_9999px_rgb(0_0_0/0.45)] ring-1 ring-white/70",
          shape === "circle" ? "rounded-full" : "rounded-none",
        )}
      />
    </div>
  );
}

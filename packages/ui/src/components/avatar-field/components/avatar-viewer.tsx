import type { DragEvent, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { shapeClassName } from "./avatar-preview";

/** Props of `AvatarViewer`. */
export interface AvatarViewerProps {
  /** The photo. */
  src?: string;
  /** Circle or square mask. */
  shape: "circle" | "square";
  /** Shown when there is no image to show (it failed to load). */
  fallback: ReactNode;
  /** Text shown while dragging over it. */
  dropzoneText?: ReactNode;
  /** A file is being dragged over it. */
  dragging: boolean;
  /** Drag events, with `dropzone`. */
  dropHandlers?: {
    /** Marks the area as dragged over. */
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    /** Allows the drop. */
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    /** Ends the highlight when the drag leaves. */
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    /** Adds the dropped files. */
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
  /** Extra classes of the photo. */
  className?: string;
}

/** The large photo in the dialog, with the field's shape; it accepts drops with `dropzone`. */
export function AvatarViewer({
  src,
  shape,
  fallback,
  dropzoneText,
  dragging,
  dropHandlers,
  className,
}: AvatarViewerProps) {
  return (
    <div
      data-slot="avatar-viewer"
      data-dragging={dragging || undefined}
      {...dropHandlers}
      className={cn(
        "relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center overflow-hidden bg-muted text-4xl text-muted-foreground",
        shapeClassName(shape),
        className,
      )}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : fallback}
      {dropHandlers && dragging ? (
        <div
          data-slot="avatar-dropzone"
          className="absolute inset-0 flex items-center justify-center bg-background/85 p-4 text-center text-sm font-medium text-foreground"
        >
          {dropzoneText}
        </div>
      ) : null}
    </div>
  );
}

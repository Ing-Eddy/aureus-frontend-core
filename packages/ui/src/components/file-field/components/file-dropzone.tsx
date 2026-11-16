import type { DragEvent, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";

export interface FileDropzoneProps {
  text: ReactNode;
  dragging: boolean;
  disabled: boolean;
  handlers: {
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
  /** The choose button (and the action), which stays the main way in. */
  children: ReactNode;
  className?: string;
}

/**
 * The drag-and-drop area. It is not focusable: keyboard and screen-reader users add files with
 * the choose button inside it. It highlights while files are dragged over it.
 */
export function FileDropzone({
  text,
  dragging,
  disabled,
  handlers,
  children,
  className,
}: FileDropzoneProps) {
  return (
    <div
      data-slot="file-dropzone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      {...handlers}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-input px-4 py-6 text-center text-sm text-muted-foreground transition-colors motion-reduce:transition-none",
        "data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[disabled]:opacity-50",
        className,
      )}
    >
      <div data-slot="file-dropzone-text" className="min-w-0 text-balance">
        {text}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  );
}

import { RotateCwIcon, XIcon } from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import type { FileInfo, FileUploadState } from "@/internal/types";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { formatFileSize } from "../utils";
import type { FileItemTexts } from "./file-item";
import { FileProgress } from "./file-progress";
import { FileTypeIcon } from "./file-type-icon";

export interface FileSingleProps {
  id: string;
  info: FileInfo;
  previewUrl?: string;
  upload?: FileUploadState;
  locale?: string;
  disabled: boolean;
  texts: FileItemTexts;
  /** The replace control: the field's trigger, as an icon button. */
  replaceTrigger: ReactNode;
  onRemove: () => void;
  onCancel: () => void;
  onRetry: () => void;
  /** With `dropzone`, files dropped on the preview replace the file. */
  dropHandlers?: {
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
  dragging?: boolean;
  className?: string;
}

/**
 * `appearance="single"` with a file: a large preview (the image, or the type icon and the name)
 * with the replace and remove actions over it, and the size, progress or error below.
 */
export function FileSingle({
  id,
  info,
  previewUrl,
  upload,
  locale,
  disabled,
  texts,
  replaceTrigger,
  onRemove,
  onCancel,
  onRetry,
  dropHandlers,
  dragging,
  className,
}: FileSingleProps) {
  const { name } = info;
  const uploading = upload?.status === "uploading";
  const failed = upload?.status === "error";
  return (
    <div
      data-slot="file-single"
      data-file-item-id={id}
      className="flex w-full min-w-0 flex-col gap-1.5"
    >
      <div
        data-slot="file-single-preview"
        data-dragging={dragging || undefined}
        {...dropHandlers}
        className={cn(
          "relative flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground transition-colors motion-reduce:transition-none data-[dragging]:border-primary",
          className,
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <FileTypeIcon type={info.type} className="size-10" />
        )}
        <div className="absolute end-2 top-2 flex gap-1">
          {replaceTrigger}
          {failed && texts.retryUploadLabel ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={texts.retryUploadLabel(name)}
              disabled={disabled}
              onClick={onRetry}
              className="pointer-coarse:size-11"
            >
              <RotateCwIcon aria-hidden="true" />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={
              uploading && texts.cancelUploadLabel
                ? texts.cancelUploadLabel(name)
                : texts.removeLabel(name)
            }
            disabled={disabled}
            onClick={uploading ? onCancel : onRemove}
            className="pointer-coarse:size-11"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="flex min-w-0 max-w-sm flex-col gap-1 text-sm">
        <span data-slot="file-single-name" className="truncate font-medium">
          {info.url ? (
            <a
              href={info.url}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </span>
        {failed && texts.uploadErrorText ? (
          <span className="text-xs text-destructive">{texts.uploadErrorText(name)}</span>
        ) : info.size !== undefined ? (
          <span className="text-xs text-muted-foreground">
            <bdi>{formatFileSize(info.size, locale)}</bdi>
          </span>
        ) : null}
        {uploading ? (
          <FileProgress value={upload.progress} label={texts.uploadProgressLabel?.(name)} />
        ) : null}
      </div>
    </div>
  );
}

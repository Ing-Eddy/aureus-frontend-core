import { GripVerticalIcon, RotateCwIcon, XIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import type { FileInfo, FileUploadState } from "@/internal/types";
import { cn } from "@/shadcn/lib/utils";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/shadcn/ui/attachment";
import { formatFileSize } from "../utils";
import { FileProgress } from "./file-progress";
import { FileTypeIcon } from "./file-type-icon";

/** The texts an item's actions and states need. */
export interface FileItemTexts {
  /** Name of the remove button. */
  removeLabel: (name: string) => string;
  /** Name of the progress bar. */
  uploadProgressLabel?: (name: string) => string;
  /** Name of the cancel button. */
  cancelUploadLabel?: (name: string) => string;
  /** Name of the retry button. */
  retryUploadLabel?: (name: string) => string;
  /** Text of a failed upload. */
  uploadErrorText?: (name: string) => ReactNode;
  /** Name of the move handle. */
  moveLabel?: (name: string) => string;
}

/** Props of `FileItemView`. */
export interface FileItemViewProps {
  /** The item's id. */
  id: string;
  /** Name, size, type and URL to show. */
  info: FileInfo;
  /** Image preview (an object URL for new images, or the stored URL of an existing image). */
  previewUrl?: string;
  /** A row or a tile. */
  layout: "list" | "grid";
  /** The upload in progress or failed. */
  upload?: FileUploadState;
  /** Locale of the size. */
  locale?: string;
  /** Disabled or loading. */
  disabled: boolean;
  /** Texts of the actions. */
  texts: FileItemTexts;
  /** Removes the item. */
  onRemove: () => void;
  /** Cancels its upload. */
  onCancel: () => void;
  /** Retries its upload. */
  onRetry: () => void;
  /** Props of the move handle; no handle without them. */
  handleProps?: HTMLAttributes<HTMLElement> & {
    /** The item the handle moves. */
    "data-file-handle": string;
  };
  /** Extra classes of the item. */
  className?: string;
  /** Extra classes of the thumbnail. */
  previewClassName?: string;
}

/**
 * Keeps every action at least 24×24 px (44 px on coarse pointers). On a grid tile the actions sit
 * over the thumbnail, so they get a background to stay visible on any image.
 */
const actionClassName =
  "min-h-6 min-w-6 pointer-coarse:min-h-11 pointer-coarse:min-w-11 group-data-[orientation=vertical]/attachment:bg-background/90 group-data-[orientation=vertical]/attachment:shadow-xs group-data-[orientation=vertical]/attachment:hover:bg-background";

/**
 * One item, on shadcn's `Attachment`: preview or type icon, name (a link when the file has a
 * URL), size, upload progress or error, and its actions, each named with the file's name.
 */
export function FileItemView({
  id,
  info,
  previewUrl,
  layout,
  upload,
  locale,
  disabled,
  texts,
  onRemove,
  onCancel,
  onRetry,
  handleProps,
  className,
  previewClassName,
}: FileItemViewProps) {
  const { name } = info;
  const uploading = upload?.status === "uploading";
  const failed = upload?.status === "error";

  return (
    <Attachment
      data-file-item-id={id}
      state={uploading ? "uploading" : failed ? "error" : "done"}
      orientation={layout === "grid" ? "vertical" : "horizontal"}
      className={cn(
        "w-full max-w-full min-w-0 motion-reduce:transition-none",
        layout === "grid" && "has-data-[slot=attachment-content]:w-full",
        className,
      )}
    >
      <AttachmentMedia variant={previewUrl ? "image" : "icon"} className={previewClassName}>
        {previewUrl ? <img src={previewUrl} alt="" /> : <FileTypeIcon type={info.type} />}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>
          {info.url ? (
            <a
              href={info.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </AttachmentTitle>
        {failed && texts.uploadErrorText ? (
          <AttachmentDescription data-slot="file-item-error">
            {texts.uploadErrorText(name)}
          </AttachmentDescription>
        ) : info.size !== undefined ? (
          <AttachmentDescription data-slot="file-item-size">
            {/* Isolated, so a right-to-left page does not reorder the number and its unit. */}
            <bdi>{formatFileSize(info.size, locale)}</bdi>
          </AttachmentDescription>
        ) : null}
        {uploading ? (
          <FileProgress
            value={upload.progress}
            label={texts.uploadProgressLabel?.(name)}
            className="mt-1.5"
          />
        ) : null}
      </AttachmentContent>
      <AttachmentActions>
        {handleProps && texts.moveLabel ? (
          <AttachmentAction
            {...handleProps}
            aria-label={texts.moveLabel(name)}
            disabled={disabled}
            className={cn(actionClassName, "cursor-grab touch-none aria-pressed:bg-muted")}
          >
            <GripVerticalIcon aria-hidden="true" />
          </AttachmentAction>
        ) : null}
        {failed && texts.retryUploadLabel ? (
          <AttachmentAction
            aria-label={texts.retryUploadLabel(name)}
            disabled={disabled}
            onClick={onRetry}
            className={actionClassName}
          >
            <RotateCwIcon aria-hidden="true" />
          </AttachmentAction>
        ) : null}
        <AttachmentAction
          aria-label={
            uploading && texts.cancelUploadLabel
              ? texts.cancelUploadLabel(name)
              : texts.removeLabel(name)
          }
          disabled={disabled}
          onClick={uploading ? onCancel : onRemove}
          className={actionClassName}
        >
          <XIcon aria-hidden="true" />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

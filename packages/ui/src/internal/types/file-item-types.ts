import type { ReactNode } from "react";

/** A file picked in this session and not sent yet. */
export interface NewFileItem {
  kind: "new";
  /** Stable while the field is mounted; used for keys, uploads and reordering. */
  id: string;
  file: File;
}

/** A file the backend already stores, described by the backend's own data. */
export interface ExistingFileItem<E> {
  kind: "existing";
  /** Stable id. Build existing items with `toExistingFile`/`toExistingFiles` to get one. */
  id: string;
  data: E;
}

/** One item of a file field's value: a new file or one the backend already stores. */
export type FileItem<E = unknown> = NewFileItem | ExistingFileItem<E>;

/** What the field shows for an existing item, returned by `getFileInfo(data)`. */
export interface FileInfo {
  /** File name, shown as the item's title (and as the link text when there is a `url`). */
  name: string;
  /** Where the file can be opened or downloaded. Also the preview of an image. */
  url?: string;
  /** Size in bytes. No size is shown without it. */
  size?: number;
  /** MIME type, used for the icon and to show image previews. */
  type?: string;
}

/** Why a file was not added. */
export type FileRejectionReason =
  | "type"
  | "size-max"
  | "size-min"
  | "count"
  | "total-size"
  | "transform";

/** A file that did not enter the value, with every reason. */
export interface FileRejection {
  file: File;
  reasons: FileRejectionReason[];
}

/** What `upload` receives besides the file. */
export interface FileUploadContext {
  /** Aborted when the user cancels the upload or the field unmounts. */
  signal: AbortSignal;
  /** Reports the upload progress, from 0 to 100. */
  onProgress: (percent: number) => void;
}

/** The state of one item's immediate upload. */
export interface FileUploadState {
  status: "uploading" | "error";
  /** From 0 to 100. */
  progress: number;
}

/** Immediate upload. Turning it on requires the texts of its progress, cancel, retry and error. */
export type FileUploadProps<E> =
  | {
      /** Uploads each file as soon as it is added. Without it, files travel with the form. */
      upload?: undefined;
      /** Only allowed together with `upload`. */
      uploadProgressLabel?: never;
      /** Only allowed together with `upload`. */
      cancelUploadLabel?: never;
      /** Only allowed together with `upload`. */
      retryUploadLabel?: never;
      /** Only allowed together with `upload`. */
      uploadErrorText?: never;
      /** Only allowed together with `upload`. */
      onUploadError?: never;
    }
  | {
      /**
       * Uploads a file and resolves with what the backend stored. The item then becomes an
       * existing item with that data. Abort the request when `signal` aborts, and report the
       * progress (0–100) through `onProgress`.
       */
      upload: (file: File, context: FileUploadContext) => Promise<E>;
      /** Accessible name of an item's progress bar. Required with `upload`. */
      uploadProgressLabel: (name: string) => string;
      /** Accessible name of an item's cancel button. Required with `upload`. */
      cancelUploadLabel: (name: string) => string;
      /** Accessible name of a failed item's retry button. Required with `upload`. */
      retryUploadLabel: (name: string) => string;
      /** Text shown on a failed item. Required with `upload`. */
      uploadErrorText: (name: string) => ReactNode;
      /** Called when an upload fails. */
      onUploadError?: (file: File, error: unknown) => void;
    };

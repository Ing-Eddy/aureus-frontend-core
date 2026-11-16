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

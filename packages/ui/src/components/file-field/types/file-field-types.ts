import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  FieldTexts,
  FileInfo,
  FileItem,
  FileRejection,
  FileUploadProps,
} from "@/internal/types";

/** Extra parts of a file field that accept classes. */
export interface FileFieldClassNames extends FieldClassNames {
  /** The label styled as a button that opens the picker. */
  trigger?: string;
  /** The drag-and-drop area. */
  dropzone?: string;
  /** The container of the items (list, grid or single preview). */
  items?: string;
  /** Each item. */
  item?: string;
  /** The thumbnail or icon of each item, or the large preview of `appearance="single"`. */
  preview?: string;
}

/**
 * Props every file field takes. Every option is independent and opt-in, and there are no
 * default texts: the texts a feature needs are required while it is on.
 */
export interface FileFieldBaseProps<E> extends Omit<FieldBaseProps, "classNames"> {
  /**
   * What the field shows for an existing item: its name, and optionally its URL, size and type.
   * Annotate its parameter (`(file: Stored) => …`) so the item type is inferred.
   */
  getFileInfo: (data: E) => FileInfo;
  /** Content of the button that opens the picker, such as "Elegir archivos". Required. */
  chooseLabel: ReactNode;
  /** Accessible name of each item's remove button, such as `(name) => "Quitar " + name`. Required. */
  removeLabel: (name: string) => string;
  /** Accepted types: MIME types, `type/*` wildcards and `.ext` extensions, comma separated. */
  accept?: string;
  /** Largest size of one file, in bytes. */
  maxSize?: number;
  /** Smallest size of one file, in bytes. */
  minSize?: number;
  /** Called with the files that did not enter the value, and why. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Text shown (as an alert) for each rejected file of the last attempt. Nothing without it. */
  rejectionMessage?: (rejection: FileRejection) => ReactNode;
  /** Announced when files are added, such as `(count) => count + " archivos añadidos"`. */
  addedAnnouncement?: (count: number) => string;
  /** Announced when an item is removed. */
  removedAnnouncement?: (name: string) => string;
  /** Locale of the sizes, formatted with `Intl`. Defaults to the browser's. */
  locale?: string;
  /** Adds the files pasted (Ctrl+V / Cmd+V) while focus is inside the field. */
  pasteable?: boolean;
  /** Opens the camera on mobile: `"user"` (front) or `"environment"` (back). */
  capture?: "user" | "environment";
  /**
   * Runs on each accepted file before it is added (and uploaded), for example to compress or
   * resize an image. A rejection reports the file through `onReject` with the reason `transform`.
   */
  transform?: (file: File) => Promise<File>;
  /** Name of the native file input, so a native form submission carries the new files. */
  name?: string;
  /** Id of the native file input. Generated when missing. */
  id?: string;
  /** Reaches the native file input, the field's focusable control. */
  ref?: Ref<HTMLInputElement>;
  /** Called when focus leaves the field. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  /** Extra ids describing the file input. */
  "aria-describedby"?: string;
  /** Accessible name of the field without a visible `label`. */
  "aria-label"?: string;
  /** Id of an element that names the field, instead of `label`. */
  "aria-labelledby"?: string;
  /** Button next to the choose button. */
  action?: FieldActionProps;
  /** Extra classes per part. */
  classNames?: FileFieldClassNames;
}

/** The drag-and-drop area. Turning it on requires its text. */
export type FileDropzoneTexts =
  | {
      /** Adds a drag-and-drop area next to the choose button. */
      dropzone?: false;
      /** Only allowed together with `dropzone`. */
      dropzoneText?: never;
    }
  | {
      /** Adds a drag-and-drop area next to the choose button. */
      dropzone: true;
      /** Text inside the area, such as "Arrastra archivos aquí". Required with `dropzone`. */
      dropzoneText: ReactNode;
    };

/** Reordering. Turning it on requires the handle's name and the move announcement. */
export type FileReorderTexts =
  | {
      /** Lets users change the order of the items, with the keyboard and the pointer. */
      reorderable?: false;
      /** Only allowed together with `reorderable`. */
      moveLabel?: never;
      /** Only allowed together with `reorderable`. */
      moveAnnouncement?: never;
    }
  | {
      /** Lets users change the order of the items, with the keyboard and the pointer. */
      reorderable: true;
      /** Accessible name of an item's move handle. Required with `reorderable`. */
      moveLabel: (name: string) => string;
      /** Announced after each move, such as "photo.png, posición 2 de 3". Required with `reorderable`. */
      moveAnnouncement: (name: string, position: number, total: number) => string;
    };

/** One file: the value is an item or `null`, and picking a file replaces it. */
export type FileSingleProps<E> = {
  /** Holds several files. Without it, the value is one item or `null`. */
  multiple?: false;
  /** Controlled value. */
  value?: FileItem<E> | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: FileItem<E> | null;
  /** Called with the whole new value after every change. */
  onValueChange?: (value: FileItem<E> | null) => void;
  /** Only allowed with `multiple`. */
  maxFiles?: never;
  /** Only allowed with `multiple`. */
  maxTotalSize?: never;
  /** Only allowed with `multiple`. */
  reorderable?: never;
  /** Only allowed with `multiple`. */
  moveLabel?: never;
  /** Only allowed with `multiple`. */
  moveAnnouncement?: never;
} & (
  | {
      /** `"list"` (the default) shows a row; `"single"` shows a large preview. */
      appearance?: "list";
      /** Only allowed with `appearance="single"`. */
      replaceLabel?: never;
    }
  | {
      /** `"list"` (the default) shows a row; `"single"` shows a large preview. */
      appearance: "single";
      /** Accessible name of the replace button. Required with `appearance="single"`. */
      replaceLabel: (name: string) => string;
    }
);

/** Several files: the value is an array, and picked files are appended. */
export type FileMultipleProps<E> = {
  /** Holds several files. Without it, the value is one item or `null`. */
  multiple: true;
  /** Controlled value. */
  value?: FileItem<E>[];
  /** Initial value when uncontrolled. Defaults to `[]`. */
  defaultValue?: FileItem<E>[];
  /** Called with the whole new value after every change. */
  onValueChange?: (value: FileItem<E>[]) => void;
  /** `"list"` (the default) shows rows; `"grid"` shows thumbnails. */
  appearance?: "list" | "grid";
  /** Only allowed with `appearance="single"`. */
  replaceLabel?: never;
  /** Most items the value can hold. */
  maxFiles?: number;
  /** Largest total size of the value, in bytes. */
  maxTotalSize?: number;
} & FileReorderTexts;

/** Props of a `FileField` holding one file. */
export type FileFieldSingleProps<E> = FileFieldBaseProps<E> &
  FieldTexts &
  FileDropzoneTexts &
  FileUploadProps<E> &
  FileSingleProps<E>;

/** Props of a `FileField` holding several files. */
export type FileFieldMultipleProps<E> = FileFieldBaseProps<E> &
  FieldTexts &
  FileDropzoneTexts &
  FileUploadProps<E> &
  FileMultipleProps<E>;

/**
 * Props of `FileField`. `E` is the backend's data of an existing file, inferred from
 * `getFileInfo` and `upload`. The component is overloaded on `multiple`, so `onValueChange` is
 * typed without annotations.
 */
export type FileFieldProps<E = unknown> = FileFieldSingleProps<E> | FileFieldMultipleProps<E>;

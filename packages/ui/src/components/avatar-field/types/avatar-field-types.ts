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

/** Extra parts of an avatar field that accept classes. */
export interface AvatarFieldClassNames extends FieldClassNames {
  /** The avatar (image or fallback). */
  avatar?: string;
  /** The choose and change buttons. */
  trigger?: string;
  /** The dialog's content box. */
  dialog?: string;
  /** The large photo in the dialog. */
  preview?: string;
  /** The editor's crop area. */
  editor?: string;
}

/** Why an edit could not be applied: the server did not allow CORS, or rendering failed. */
export interface AvatarEditFailure {
  reason: "cors" | "render";
  error: unknown;
}

/**
 * Props every avatar field takes. Every option is independent and opt-in, and there are no
 * default texts: the texts a feature needs are required while it is on.
 */
export interface AvatarFieldBaseProps<E> extends Omit<FieldBaseProps, "classNames"> {
  /**
   * What the field shows for a stored photo: its `url` is the image, and `name` names it in the
   * texts. Annotate its parameter (`(photo: Photo) => …`) so the item type is inferred. Required.
   */
  getFileInfo: (data: E) => FileInfo;
  /** Controlled value: the photo, or `null`. */
  value?: FileItem<E> | null;
  /** Initial value when uncontrolled. Defaults to `null`. */
  defaultValue?: FileItem<E> | null;
  /** Called with the new value after every change (picked, edited, removed, uploaded). */
  onValueChange?: (value: FileItem<E> | null) => void;
  /** `"circle"` (the default) or `"square"`. Crops are always square; this is the mask. */
  shape?: "circle" | "square";
  /** `"sm"`, `"md"`, `"lg"` (the default) or `"xl"`. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Shown without a photo, or when the photo fails to load. Without it, `initialsFrom` or an icon. */
  fallback?: ReactNode;
  /** A name whose initials are the fallback, such as the user's full name. */
  initialsFrom?: string;
  /** Accessible name of the avatar button that opens the dialog, from the photo's name. Required. */
  inspectLabel: (name: string) => string;
  /** Title of the dialog, such as "Foto de perfil". Required. */
  dialogTitle: ReactNode;
  /** Accessible name of the dialog's close button. Required. */
  closeLabel: string;
  /** Accepted types. Defaults to `image/*`. */
  accept?: string;
  /** Largest size of the picked file, in bytes. */
  maxSize?: number;
  /** Smallest size of the picked file, in bytes. */
  minSize?: number;
  /** Called with a picked file that was not accepted, and why. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Text shown (as an alert) for a rejected file. Nothing without it. */
  rejectionMessage?: (rejection: FileRejection) => ReactNode;
  /** Opens the camera on mobile: `"user"` (front) or `"environment"` (back). */
  capture?: "user" | "environment";
  /** Runs on each picked or edited image before it becomes the value (and is uploaded). */
  transform?: (file: File) => Promise<File>;
  /** Announced after a new photo is picked. Nothing without it. */
  changedAnnouncement?: string;
  /** Announced after the photo is removed. Nothing without it. */
  removedAnnouncement?: string;
  /** Announced after an edit is applied. Nothing without it. */
  editedAnnouncement?: string;
  /** Name of the native file input, so a native form submission carries the new photo. */
  name?: string;
  /** Id of the native file input. Generated when missing. */
  id?: string;
  /** Reaches the native file input, the field's focusable control for choosing. */
  ref?: Ref<HTMLInputElement>;
  /** Called when focus leaves the field. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  /** Extra ids describing the file input. */
  "aria-describedby"?: string;
  /** Accessible name of the field without a visible `label`. */
  "aria-label"?: string;
  /** Id of an element that names the field, instead of `label`. */
  "aria-labelledby"?: string;
  /** Button next to the choose and change buttons. */
  action?: FieldActionProps;
  /** Extra classes per part. */
  classNames?: AvatarFieldClassNames;
}

/**
 * Whether the photo can be changed. By default a circular camera button on the avatar picks or
 * changes it, and its names are required. With `readOnly`, the field only shows the photo (the
 * avatar still opens the dialog to look at it), so the editing features are not allowed.
 */
export type AvatarEditingProps =
  | {
      /** Only shows the photo: no circular button, and no change, edit or remove action. */
      readOnly?: false;
      /** Accessible name of the circular button while there is no photo, such as "Subir foto". Required. */
      chooseLabel: string;
      /** Accessible name of the circular button (and the dialog's change button) with a photo. Required. */
      changeLabel: string;
      /** Replaces the photo with an image pasted (Ctrl+V / Cmd+V) while the dialog has focus. */
      pasteable?: boolean;
    }
  | {
      /** Only shows the photo: no circular button, and no change, edit or remove action. */
      readOnly: true;
      /** Not allowed with `readOnly`: the photo cannot be changed. */
      chooseLabel?: never;
      /** Not allowed with `readOnly`: the photo cannot be changed. */
      changeLabel?: never;
      /** Not allowed with `readOnly`. */
      pasteable?: never;
      /** Not allowed with `readOnly`. */
      editable?: never;
      /** Not allowed with `readOnly`. */
      removable?: never;
      /** Not allowed with `readOnly`. */
      dropzone?: never;
      /** Not allowed with `readOnly`. */
      upload?: never;
    };

/** Removing the photo from the dialog. Turning it on requires the button's text. */
export type AvatarRemoveTexts =
  | {
      /** Adds a remove action to the dialog; the value becomes `null`. */
      removable?: false;
      /** Only allowed together with `removable`. */
      removeLabel?: never;
    }
  | {
      /** Adds a remove action to the dialog; the value becomes `null`. */
      removable: true;
      /** Text of the remove button, such as "Quitar foto". Required with `removable`. */
      removeLabel: ReactNode;
    };

/** Opening the original from the dialog. Turning it on requires the link's text. */
export type AvatarDownloadTexts =
  | {
      /** Adds a link to the original image to the dialog. */
      downloadable?: false;
      /** Only allowed together with `downloadable`. */
      downloadLabel?: never;
    }
  | {
      /** Adds a link to the original image to the dialog. */
      downloadable: true;
      /** Text of the link, such as "Abrir original". Required with `downloadable`. */
      downloadLabel: ReactNode;
    };

/** Dropping an image on the dialog's photo. Turning it on requires the area's text. */
export type AvatarDropzoneTexts =
  | {
      /** Lets people drop an image on the large photo to replace it. */
      dropzone?: false;
      /** Only allowed together with `dropzone`. */
      dropzoneText?: never;
    }
  | {
      /** Lets people drop an image on the large photo to replace it. */
      dropzone: true;
      /** Text over the photo while an image is dragged over it. Required with `dropzone`. */
      dropzoneText: ReactNode;
    };

/** The image editor. Turning it on requires the name of every control. */
export type AvatarEditorProps =
  | {
      /** Adds an editor (crop and zoom, rotate, flip, reset) to the dialog. */
      editable?: false;
      editLabel?: never;
      cropAreaLabel?: never;
      zoomLabel?: never;
      rotateLeftLabel?: never;
      rotateRightLabel?: never;
      flipHorizontalLabel?: never;
      flipVerticalLabel?: never;
      resetLabel?: never;
      applyLabel?: never;
      cancelLabel?: never;
      outputType?: never;
      outputSize?: never;
      outputQuality?: never;
      onEditError?: never;
    }
  | {
      /** Adds an editor (crop and zoom, rotate, flip, reset) to the dialog. */
      editable: true;
      /** Text of the dialog's edit button. Required with `editable`. */
      editLabel: ReactNode;
      /** Accessible name of the crop area. Required with `editable`. */
      cropAreaLabel: string;
      /** Accessible name of the zoom slider. Required with `editable`. */
      zoomLabel: string;
      /** Accessible name of the rotate-left button. Required with `editable`. */
      rotateLeftLabel: string;
      /** Accessible name of the rotate-right button. Required with `editable`. */
      rotateRightLabel: string;
      /** Accessible name of the horizontal flip button. Required with `editable`. */
      flipHorizontalLabel: string;
      /** Accessible name of the vertical flip button. Required with `editable`. */
      flipVerticalLabel: string;
      /** Text of the reset button. Required with `editable`. */
      resetLabel: ReactNode;
      /** Text of the apply button. Required with `editable`. */
      applyLabel: ReactNode;
      /** Text of the cancel button. Required with `editable`. */
      cancelLabel: ReactNode;
      /** Type of the edited image. Defaults to `"image/png"`. */
      outputType?: "image/png" | "image/jpeg" | "image/webp";
      /** Largest side of the edited image, in pixels. Defaults to 512. Never upscales. */
      outputSize?: number;
      /** Quality of JPEG and WebP output, from 0 to 1. Defaults to 0.92. */
      outputQuality?: number;
      /** Called when an edit cannot be applied (for example, a stored photo without CORS). */
      onEditError?: (failure: AvatarEditFailure) => void;
    };

/**
 * Props of `AvatarField`. `E` is the backend's data of a stored photo, inferred from
 * `getFileInfo` and `upload`. `loading`, `info`, `removable`, `downloadable`, `dropzone`,
 * `editable` and `upload` require their texts, and so does the circular button unless
 * `readOnly`; no text is generated.
 */
export type AvatarFieldProps<E = unknown> = AvatarFieldBaseProps<E> &
  FieldTexts &
  AvatarEditingProps &
  AvatarRemoveTexts &
  AvatarDownloadTexts &
  AvatarDropzoneTexts &
  AvatarEditorProps &
  FileUploadProps<E>;

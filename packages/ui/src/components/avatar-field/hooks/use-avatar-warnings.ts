import type { ReactNode } from "react";
import {
  fieldTextChecks,
  inputNameCheck,
  type MissingTextCheck,
  useMissingTexts,
} from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props the warnings read. Untyped code may leave any of them out. */
export interface AvatarWarningSources extends FieldStatusInternal {
  /** The visible label. */
  label?: ReactNode;
  /** Accessible name without a label. */
  "aria-label"?: string;
  /** Ids of the elements that name the field. */
  "aria-labelledby"?: string;
  /** Describes the stored photo. */
  getFileInfo?: unknown;
  /** Only shows the photo. */
  readOnly?: boolean;
  /** Pasting is on. */
  pasteable?: boolean;
  /** Name of the button without a photo. */
  chooseLabel?: unknown;
  /** Name of the button with a photo. */
  changeLabel?: unknown;
  /** Name of the avatar button. */
  inspectLabel?: unknown;
  /** Title of the dialog. */
  dialogTitle?: unknown;
  /** Name of the close button. */
  closeLabel?: unknown;
  /** Removing is on. */
  removable?: boolean;
  /** Text of the remove button. */
  removeLabel?: unknown;
  /** The link to the original is on. */
  downloadable?: boolean;
  /** Text of that link. */
  downloadLabel?: unknown;
  /** The editor is on. */
  editable?: boolean;
  /** Text of the edit button. */
  editLabel?: unknown;
  /** Name of the crop area. */
  cropAreaLabel?: unknown;
  /** Name of the zoom slider. */
  zoomLabel?: unknown;
  /** Name of the rotate-left button. */
  rotateLeftLabel?: unknown;
  /** Name of the rotate-right button. */
  rotateRightLabel?: unknown;
  /** Name of the horizontal flip button. */
  flipHorizontalLabel?: unknown;
  /** Name of the vertical flip button. */
  flipVerticalLabel?: unknown;
  /** Text of the reset button. */
  resetLabel?: unknown;
  /** Text of the apply button. */
  applyLabel?: unknown;
  /** Text of the cancel button. */
  cancelLabel?: unknown;
  /** Dropping is on. */
  dropzone?: boolean;
  /** Its text. */
  dropzoneText?: unknown;
  /** Immediate upload is on. */
  upload?: unknown;
  /** Name of the progress ring. */
  uploadProgressLabel?: unknown;
  /** Name of the cancel button. */
  cancelUploadLabel?: unknown;
  /** Name of the retry button. */
  retryUploadLabel?: unknown;
  /** Text of a failed upload. */
  uploadErrorText?: unknown;
}

/** The texts `editable` requires. */
const editorTexts = [
  "editLabel",
  "cropAreaLabel",
  "zoomLabel",
  "rotateLeftLabel",
  "rotateRightLabel",
  "flipHorizontalLabel",
  "flipVerticalLabel",
  "resetLabel",
  "applyLabel",
  "cancelLabel",
] as const;
/** The texts `upload` requires. */
const uploadTexts = [
  "uploadProgressLabel",
  "cancelUploadLabel",
  "retryUploadLabel",
  "uploadErrorText",
] as const;
/** The props every avatar field requires. */
const alwaysTexts = ["inspectLabel", "dialogTitle", "closeLabel", "getFileInfo"] as const;

/** Every problem the types catch, checked again for untyped code. */
export function avatarWarningChecks(props: AvatarWarningSources): MissingTextCheck[] {
  return [
    inputNameCheck(props, "avatar field"),
    ...fieldTextChecks(props),
    ...alwaysTexts.map(
      (key): MissingTextCheck => [!props[key], `the avatar field needs \`${key}\``],
    ),
    [!props.readOnly && !props.chooseLabel, "the circular button needs `chooseLabel`"],
    [!props.readOnly && !props.changeLabel, "the circular button needs `changeLabel`"],
    [
      props.readOnly &&
        Boolean(
          props.editable || props.removable || props.dropzone || props.pasteable || props.upload,
        ),
      "`readOnly` cannot be combined with `editable`, `removable`, `dropzone`, `pasteable` or `upload`; they are ignored",
    ],
    [props.removable && !props.removeLabel, "`removable` needs `removeLabel`"],
    [props.downloadable && !props.downloadLabel, "`downloadable` needs `downloadLabel`"],
    ...editorTexts.map(
      (key): MissingTextCheck => [props.editable && !props[key], `\`editable\` needs \`${key}\``],
    ),
    [props.dropzone && !props.dropzoneText, "`dropzone` needs `dropzoneText`"],
    ...uploadTexts.map(
      (key): MissingTextCheck => [
        Boolean(props.upload) && !props[key],
        `\`upload\` needs \`${key}\``,
      ],
    ),
  ];
}

/** Development warnings of an avatar field, each logged once. No text is ever generated. */
export function useAvatarWarnings(componentName: string, props: AvatarWarningSources) {
  useMissingTexts(componentName, avatarWarningChecks(props));
}

/** The development warning for an edit that the browser's CORS rules blocked. */
export const corsProblem =
  "the photo could not be edited because its server does not allow CORS. Send `Access-Control-Allow-Origin` for the image, or edit a picked file";

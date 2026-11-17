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
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  getFileInfo?: unknown;
  readOnly?: boolean;
  pasteable?: boolean;
  chooseLabel?: unknown;
  changeLabel?: unknown;
  inspectLabel?: unknown;
  dialogTitle?: unknown;
  closeLabel?: unknown;
  removable?: boolean;
  removeLabel?: unknown;
  downloadable?: boolean;
  downloadLabel?: unknown;
  editable?: boolean;
  editLabel?: unknown;
  cropAreaLabel?: unknown;
  zoomLabel?: unknown;
  rotateLeftLabel?: unknown;
  rotateRightLabel?: unknown;
  flipHorizontalLabel?: unknown;
  flipVerticalLabel?: unknown;
  resetLabel?: unknown;
  applyLabel?: unknown;
  cancelLabel?: unknown;
  dropzone?: boolean;
  dropzoneText?: unknown;
  upload?: unknown;
  uploadProgressLabel?: unknown;
  cancelUploadLabel?: unknown;
  retryUploadLabel?: unknown;
  uploadErrorText?: unknown;
}

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
const uploadTexts = [
  "uploadProgressLabel",
  "cancelUploadLabel",
  "retryUploadLabel",
  "uploadErrorText",
] as const;
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

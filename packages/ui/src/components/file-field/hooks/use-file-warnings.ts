import type { ReactNode } from "react";
import {
  fieldTextChecks,
  inputNameCheck,
  type MissingTextCheck,
  useMissingTexts,
} from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props the warnings read. Untyped code may leave any of them out. */
export interface FileWarningSources extends FieldStatusInternal {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  multiple?: boolean;
  appearance?: string;
  chooseLabel?: unknown;
  removeLabel?: unknown;
  getFileInfo?: unknown;
  dropzone?: boolean;
  dropzoneText?: unknown;
  replaceLabel?: unknown;
  upload?: unknown;
  uploadProgressLabel?: unknown;
  cancelUploadLabel?: unknown;
  retryUploadLabel?: unknown;
  uploadErrorText?: unknown;
  reorderable?: boolean;
  moveLabel?: unknown;
  moveAnnouncement?: unknown;
}

/** Every problem the types catch, checked again for untyped code. */
export function fileWarningChecks(props: FileWarningSources): MissingTextCheck[] {
  const uploads = Boolean(props.upload);
  const reorder = Boolean(props.reorderable && props.multiple);
  return [
    inputNameCheck(props, "file field"),
    ...fieldTextChecks(props),
    [!props.chooseLabel, "the choose button needs `chooseLabel`"],
    [!props.removeLabel, "the remove buttons need `removeLabel`"],
    [!props.getFileInfo, "existing files need `getFileInfo`"],
    [props.dropzone && !props.dropzoneText, "`dropzone` needs `dropzoneText`"],
    [
      props.appearance === "single" && !props.replaceLabel,
      '`appearance="single"` needs `replaceLabel`',
    ],
    [uploads && !props.uploadProgressLabel, "`upload` needs `uploadProgressLabel`"],
    [uploads && !props.cancelUploadLabel, "`upload` needs `cancelUploadLabel`"],
    [uploads && !props.retryUploadLabel, "`upload` needs `retryUploadLabel`"],
    [uploads && !props.uploadErrorText, "`upload` needs `uploadErrorText`"],
    [reorder && !props.moveLabel, "`reorderable` needs `moveLabel`"],
    [reorder && !props.moveAnnouncement, "`reorderable` needs `moveAnnouncement`"],
    [
      props.appearance === "grid" && !props.multiple,
      '`appearance="grid"` needs `multiple`; the list is shown instead',
    ],
    [
      props.appearance === "single" && props.multiple,
      '`appearance="single"` cannot be used with `multiple`; the list is shown instead',
    ],
    [props.reorderable && !props.multiple, "`reorderable` needs `multiple`; it is ignored"],
  ];
}

/** Development warnings of a file field, each logged once. No text is ever generated. */
export function useFileWarnings(componentName: string, props: FileWarningSources) {
  useMissingTexts(componentName, fileWarningChecks(props));
}

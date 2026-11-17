import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import type { FileItem } from "@/internal/types";
import { AvatarField } from "../avatar-field";
import { editorTexts, getFileInfo, type Photo } from "./render-avatar-field";

const base = {
  label: "Foto",
  getFileInfo,
  chooseLabel: "Subir",
  changeLabel: "Cambiar",
  inspectLabel: (name: string) => name,
  dialogTitle: "Foto",
  closeLabel: "Cerrar",
};
const { applyLabel: _apply, ...editorWithoutApply } = editorTexts;
const { chooseLabel: _choose, ...noChoose } = base;
const { dialogTitle: _title, ...noTitle } = base;
const { getFileInfo: _info, ...noInfo } = base;
const uploadTexts = {
  uploadProgressLabel: (n: string) => n,
  cancelUploadLabel: (n: string) => n,
  retryUploadLabel: (n: string) => n,
  uploadErrorText: (n: string) => n,
};
const upload = async (): Promise<Photo> => ({ id: 1, filename: "a.png", url: "/a.png" });
const { chooseLabel: _c, changeLabel: _h, ...viewOnly } = base;

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks: ReactElement[] = [
  <AvatarField key="plain" {...base} />,
  <AvatarField
    key="typed"
    {...base}
    onValueChange={(value) => {
      const item: FileItem<Photo> | null = value;
      return item;
    }}
  />,
  <AvatarField key="editor" {...base} {...editorTexts} />,
  <AvatarField key="remove" {...base} removable removeLabel="Quitar" />,
  <AvatarField key="download" {...base} downloadable downloadLabel="Abrir" />,
  <AvatarField key="dropzone" {...base} dropzone dropzoneText="Suelta" />,
  <AvatarField key="upload" {...base} {...uploadTexts} upload={upload} />,
  // @ts-expect-error `chooseLabel` is always required.
  <AvatarField key="no-choose" {...noChoose} />,
  // @ts-expect-error `dialogTitle` is always required.
  <AvatarField key="no-title" {...noTitle} />,
  // @ts-expect-error `getFileInfo` is always required.
  <AvatarField key="no-info" {...noInfo} />,
  // @ts-expect-error `removable` needs `removeLabel`.
  <AvatarField key="remove-text" {...base} removable />,
  // @ts-expect-error `downloadable` needs `downloadLabel`.
  <AvatarField key="download-text" {...base} downloadable />,
  // @ts-expect-error `editable` needs every editor text.
  <AvatarField key="editor-text" {...base} {...editorWithoutApply} />,
  // @ts-expect-error `dropzone` needs `dropzoneText`.
  <AvatarField key="dropzone-text" {...base} dropzone />,
  // @ts-expect-error `upload` needs its texts.
  <AvatarField key="upload-text" {...base} upload={upload} />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <AvatarField key="loading" {...base} loading />,
  // @ts-expect-error `info` needs `infoLabel`.
  <AvatarField key="info" {...base} info="Ayuda" />,
  // @ts-expect-error `outputSize` is only allowed with `editable`.
  <AvatarField key="output" {...base} outputSize={256} />,
  <AvatarField key="read-only" {...viewOnly} readOnly />,
  // @ts-expect-error `readOnly` takes no button texts.
  <AvatarField key="read-only-choose" {...viewOnly} readOnly chooseLabel="Subir" />,
  // @ts-expect-error `readOnly` cannot be editable.
  <AvatarField key="read-only-edit" {...viewOnly} {...editorTexts} readOnly />,
  // @ts-expect-error `readOnly` cannot remove the photo.
  <AvatarField key="read-only-remove" {...viewOnly} readOnly removable removeLabel="Quitar" />,
  // @ts-expect-error `readOnly` takes no dropzone.
  <AvatarField key="read-only-drop" {...viewOnly} readOnly dropzone dropzoneText="Suelta" />,
  // @ts-expect-error `readOnly` takes no paste.
  <AvatarField key="read-only-paste" {...viewOnly} readOnly pasteable />,
  // @ts-expect-error The circular button's names are text (accessible names), not elements.
  <AvatarField key="choose-node" {...base} chooseLabel={<b>Subir</b>} />,
  // @ts-expect-error The value is one item or null, not an array.
  <AvatarField key="array" {...base} value={[]} />,
];

describe("AvatarField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(26);
  });
});

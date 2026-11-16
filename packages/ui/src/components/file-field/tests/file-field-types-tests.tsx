import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { FileField } from "../file-field";
import type { FileItem } from "../types";
import { getFileInfo, type Stored } from "./render-file-field";

const base = { label: "Docs", chooseLabel: "Elegir", removeLabel: (n: string) => n, getFileInfo };
const upload = async (): Promise<Stored> => ({ id: 1, filename: "a", url: "/a" });
const uploadTexts = {
  uploadProgressLabel: (n: string) => n,
  cancelUploadLabel: (n: string) => n,
  retryUploadLabel: (n: string) => n,
  uploadErrorText: (n: string) => n,
};

const noChoose = { label: "Docs", removeLabel: (n: string) => n, getFileInfo };
const replace = { replaceLabel: (n: string) => n };
const reorderTexts = { moveLabel: (n: string) => n, moveAnnouncement: () => "" };

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks: ReactElement[] = [
  <FileField key="plain" {...base} />,
  <FileField
    key="single-typed"
    {...base}
    onValueChange={(value) => {
      const item: FileItem<Stored> | null = value;
      return item;
    }}
  />,
  <FileField
    key="multiple-typed"
    {...base}
    multiple
    onValueChange={(value) => {
      const items: FileItem<Stored>[] = value;
      return items;
    }}
  />,
  <FileField key="upload" {...base} {...uploadTexts} upload={upload} />,
  <FileField key="dropzone" {...base} dropzone dropzoneText="Suelta aquí" />,
  <FileField key="single" {...base} appearance="single" replaceLabel={(n) => n} />,
  <FileField key="grid" {...base} multiple appearance="grid" />,
  <FileField
    key="reorder"
    {...base}
    multiple
    reorderable
    moveLabel={(n) => n}
    moveAnnouncement={(n, p, t) => `${n} ${p}/${t}`}
  />,
  <FileField key="loading" {...base} loading loadingLabel="Cargando" />,
  // @ts-expect-error `chooseLabel` is always required.
  <FileField key="no-choose" {...noChoose} />,
  // @ts-expect-error `removeLabel` is always required.
  <FileField key="no-remove" label="Docs" chooseLabel="Elegir" getFileInfo={getFileInfo} />,
  // @ts-expect-error `getFileInfo` is always required.
  <FileField key="no-info" label="Docs" chooseLabel="Elegir" removeLabel={(n: string) => n} />,
  // @ts-expect-error `dropzone` needs `dropzoneText`.
  <FileField key="dropzone-text" {...base} dropzone />,
  // @ts-expect-error `appearance="single"` needs `replaceLabel`.
  <FileField key="single-text" {...base} appearance="single" />,
  // @ts-expect-error `upload` needs its texts.
  <FileField key="upload-texts" {...base} upload={upload} />,
  // @ts-expect-error `reorderable` needs its texts.
  <FileField key="reorder-texts" {...base} multiple reorderable />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <FileField key="loading-text" {...base} loading />,
  // @ts-expect-error `info` needs `infoLabel`.
  <FileField key="info-text" {...base} info="Ayuda" />,
  // @ts-expect-error `grid` needs `multiple`.
  <FileField key="grid-single" {...base} appearance="grid" />,
  // @ts-expect-error `single` cannot be used with `multiple`.
  <FileField key="single-multiple" {...base} {...replace} multiple appearance="single" />,
  // @ts-expect-error `reorderable` needs `multiple`.
  <FileField key="reorder-single" {...base} {...reorderTexts} reorderable />,
  // @ts-expect-error `maxFiles` needs `multiple`.
  <FileField key="max-files" {...base} maxFiles={3} />,
  // @ts-expect-error A single field's value is one item, not an array.
  <FileField key="single-array" {...base} value={[]} />,
];

describe("FileField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(23);
  });
});

import { describe, expect, it } from "vitest";
import type { FileItem } from "../types";
import { diffFiles } from "./diff-files";
import { isExistingFile, isNewFile, toExistingFile, toExistingFiles } from "./file-guards";
import { fileToBase64 } from "./file-to-base64";
import { formatFileSize } from "./format-file-size";
import { hasPendingUploads } from "./has-pending-uploads";
import { toFormData } from "./to-form-data";

const file = (name: string, size: number, type = "") =>
  new File([new Uint8Array(size)], name, { type });

describe("formatFileSize", () => {
  it("uses the largest unit that fits, formatted by Intl", () => {
    const intl = (value: number, unit: string, locale: string) =>
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: 1,
      }).format(value);
    expect(formatFileSize(512, "en-US")).toBe(intl(512, "byte", "en-US"));
    expect(formatFileSize(1500, "en-US")).toBe(intl(1.5, "kilobyte", "en-US"));
    expect(formatFileSize(2_000_000, "en-US")).toBe(intl(2, "megabyte", "en-US"));
    expect(formatFileSize(3_200_000_000, "en-US")).toBe(intl(3.2, "gigabyte", "en-US"));
    expect(formatFileSize(1500, "es-ES")).toContain("1,5");
  });
});

interface Stored {
  id: number;
  url: string;
}

describe("diffFiles", () => {
  const a = toExistingFile<Stored>({ id: 1, url: "/1" }, (d) => d.id);
  const b = toExistingFile<Stored>({ id: 2, url: "/2" }, (d) => d.id);
  const photo = file("photo.png", 3, "image/png");
  it("returns added files, kept data and removed data", () => {
    const current: FileItem<Stored>[] = [b, { kind: "new", id: "n1", file: photo }];
    expect(diffFiles([a, b], current)).toEqual({
      added: [photo],
      kept: [{ id: 2, url: "/2" }],
      removed: [{ id: 1, url: "/1" }],
    });
  });
  it("accepts single values and null", () => {
    expect(diffFiles(a, null)).toEqual({ added: [], kept: [], removed: [a.data] });
    expect(diffFiles(null, a)).toEqual({ added: [], kept: [a.data], removed: [] });
  });
});

describe("helpers", () => {
  it("builds existing items with stable ids", () => {
    expect(toExistingFiles(["x", "y"]).map((i) => i.id)).toEqual(["existing-0", "existing-1"]);
    expect(toExistingFiles([{ k: 7 }], (d) => d.k)[0]?.id).toBe("existing-7");
  });
  it("narrows items", () => {
    const item: FileItem<string> = { kind: "new", id: "1", file: file("a", 1) };
    expect(isNewFile(item)).toBe(true);
    expect(isExistingFile(item)).toBe(false);
  });
  it("appends only new files to FormData", () => {
    const a = file("a.txt", 1);
    const data = toFormData([{ kind: "new", id: "1", file: a }, toExistingFile("stored")], "docs");
    expect(data.getAll("docs")).toHaveLength(1);
    expect((data.get("docs") as File).name).toBe("a.txt");
  });
  it("reports pending uploads while a new item remains", () => {
    expect(hasPendingUploads([toExistingFile("x")])).toBe(false);
    expect(hasPendingUploads({ kind: "new", id: "1", file: file("a", 1) })).toBe(true);
    expect(hasPendingUploads(null)).toBe(false);
  });
  it("reads a file as a data URL", async () => {
    const url = await fileToBase64(new File(["hi"], "a.txt", { type: "text/plain" }));
    expect(url).toBe("data:text/plain;base64,aGk=");
  });
});

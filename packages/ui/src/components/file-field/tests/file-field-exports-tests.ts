import { describe, expect, it } from "vitest";
import * as fileField from "../index";

describe("file-field public API", () => {
  it("exports the same runtime values as before the internal move", () => {
    expect(Object.keys(fileField).sort()).toEqual([
      "FileField",
      "diffFiles",
      "fileToBase64",
      "hasPendingUploads",
      "isExistingFile",
      "isNewFile",
      "toExistingFile",
      "toExistingFiles",
      "toFormData",
    ]);
  });
});

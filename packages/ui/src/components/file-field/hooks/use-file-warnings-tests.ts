import { describe, expect, it } from "vitest";
import { missingTextProblems } from "@/internal/hooks";
import { type FileWarningSources, fileWarningChecks } from "./use-file-warnings";

const problems = (props: FileWarningSources) => missingTextProblems(fileWarningChecks(props));
const base = {
  label: "Docs",
  chooseLabel: "Choose",
  removeLabel: () => "",
  getFileInfo: () => ({}),
};

describe("file field warnings", () => {
  it("is silent when every text is given", () => {
    expect(problems(base)).toEqual([]);
  });

  it("names the always-required texts and the missing name", () => {
    expect(problems({})).toEqual([
      "the file field has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
      "the choose button needs `chooseLabel`",
      "the remove buttons need `removeLabel`",
      "existing files need `getFileInfo`",
    ]);
  });

  it("names each feature's texts", () => {
    expect(problems({ ...base, dropzone: true })).toEqual(["`dropzone` needs `dropzoneText`"]);
    expect(problems({ ...base, appearance: "single" })).toEqual([
      '`appearance="single"` needs `replaceLabel`',
    ]);
    expect(problems({ ...base, upload: () => {} })).toHaveLength(4);
    expect(problems({ ...base, multiple: true, reorderable: true })).toEqual([
      "`reorderable` needs `moveLabel`",
      "`reorderable` needs `moveAnnouncement`",
    ]);
    expect(problems({ ...base, loading: true, info: "x" })).toEqual([
      "`loading` needs `loadingLabel`",
      "`info` needs `infoLabel`",
    ]);
  });

  it("names invalid combinations", () => {
    expect(problems({ ...base, appearance: "grid" })[0]).toMatch(/^`appearance="grid"` needs/);
    expect(
      problems({ ...base, appearance: "single", replaceLabel: () => "", multiple: true })[0],
    ).toMatch(/cannot be used with `multiple`/);
    expect(problems({ ...base, reorderable: true })).toEqual([
      "`reorderable` needs `multiple`; it is ignored",
    ]);
  });
});

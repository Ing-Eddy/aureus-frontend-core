import { describe, expect, it } from "vitest";
import { missingTextProblems } from "@/internal/hooks";
import { type FeatureTexts, selectTextChecks } from "./select-text-checks";

const problems = (props: FeatureTexts) => missingTextProblems(selectTextChecks(props));

describe("select feature texts", () => {
  it("names each enabled feature without its text", () => {
    expect(problems({})).toEqual([]);
    expect(problems({ searchable: true })).toEqual(["`searchable` needs `searchLabel`"]);
    expect(problems({ clearable: true })).toEqual(["`clearable` needs `clearLabel`"]);
    expect(problems({ multiple: true })).toEqual([
      '`multiple` needs `multipleDisplay` ("chips" or "summary")',
    ]);
    expect(problems({ multiple: true, multipleDisplay: "chips" })).toEqual([
      '`multipleDisplay="chips"` needs `removeChipLabel`',
    ]);
    expect(problems({ multiple: true, multipleDisplay: "summary" })).toEqual([
      '`multipleDisplay="summary"` needs `renderSummary`',
    ]);
    expect(problems({ selectAll: {} })).toEqual(["`selectAll` needs `selectAll.label`"]);
    expect(problems({ creatable: true, createLabel: () => "", onCreate: () => {} })).toEqual([
      "`creatable` needs `searchable`",
    ]);
  });
});

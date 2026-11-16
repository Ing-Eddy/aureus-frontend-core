import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fieldTextChecks,
  inputNameCheck,
  missingTextProblems,
  useMissingTexts,
} from "./use-missing-texts";

afterEach(() => vi.restoreAllMocks());

describe("missing texts", () => {
  it("lists the problems that happen, in order", () => {
    expect(
      missingTextProblems([
        [true, "first"],
        [false, "skipped"],
        ["", "empty is false"],
        [1, "second"],
      ]),
    ).toEqual(["first", "second"]);
  });

  it("checks the loading and info texts", () => {
    expect(missingTextProblems(fieldTextChecks({}))).toEqual([]);
    expect(missingTextProblems(fieldTextChecks({ loading: true, info: "Help" }))).toEqual([
      "`loading` needs `loadingLabel`",
      "`info` needs `infoLabel`",
    ]);
    expect(
      missingTextProblems(
        fieldTextChecks({
          loading: true,
          loadingLabel: "Cargando",
          info: "Help",
          infoLabel: "Info",
        }),
      ),
    ).toEqual([]);
  });

  it("checks the accessible name of an input", () => {
    expect(missingTextProblems([inputNameCheck({})])).toEqual([
      "the input has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
    ]);
    expect(missingTextProblems([inputNameCheck({}, "select")])[0]).toMatch(/^the select has/);
    expect(missingTextProblems([inputNameCheck({ label: "Name" })])).toEqual([]);
    expect(missingTextProblems([inputNameCheck({ "aria-label": "Name" })])).toEqual([]);
    expect(missingTextProblems([inputNameCheck({ "aria-labelledby": "x" })])).toEqual([]);
  });

  it("warns once per problem with the component's name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(
      ({ info }: { info: boolean }) =>
        useMissingTexts("TextField", [
          [true, "`loading` needs `loadingLabel`"],
          [info, "`info` needs `infoLabel`"],
        ]),
      { initialProps: { info: false } },
    );
    rerender({ info: false });
    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith("TextField: `loading` needs `loadingLabel`.");
    rerender({ info: true });
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenLastCalledWith("TextField: `info` needs `infoLabel`.");
    rerender({ info: false });
    rerender({ info: true });
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("stays silent without problems", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useMissingTexts("TextField", [[false, "never"]]));
    expect(warn).not.toHaveBeenCalled();
  });
});

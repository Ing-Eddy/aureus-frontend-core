import { describe, expect, it } from "vitest";
import { globBase, matchGlob, toPosixPath } from "../utils/helpers/match-glob";

describe("matchGlob", () => {
  it("matches exact paths", () => {
    expect(matchGlob("src/common/locales", "src/common/locales")).toBe(true);
    expect(matchGlob("src/common/locales", "src/common")).toBe(false);
    expect(matchGlob("src/common", "src/common/locales")).toBe(false);
  });

  it("`*` matches exactly one segment", () => {
    expect(matchGlob("src/features/*/locales", "src/features/auth/locales")).toBe(true);
    expect(matchGlob("src/features/*/locales", "src/features/locales")).toBe(false);
    expect(matchGlob("src/features/*/locales", "src/features/admin/users/locales")).toBe(false);
  });

  it("`*` matches part of a segment, never across `/`", () => {
    expect(matchGlob("src/*-module/locales", "src/auth-module/locales")).toBe(true);
    expect(matchGlob("src/*-module/locales", "src/auth/module/locales")).toBe(false);
  });

  it("`**` matches zero or more segments", () => {
    expect(matchGlob("src/**/locales", "src/locales")).toBe(true);
    expect(matchGlob("src/**/locales", "src/common/locales")).toBe(true);
    expect(matchGlob("src/**/locales", "src/features/admin/users/locales")).toBe(true);
    expect(matchGlob("src/**/locales", "src/features/auth/locales/extra")).toBe(false);
    expect(matchGlob("src/legacy/**", "src/legacy")).toBe(true);
    expect(matchGlob("src/legacy/**", "src/legacy/old/locales")).toBe(true);
    expect(matchGlob("src/legacy/**", "src/features/legacy")).toBe(false);
  });

  it("treats regular-expression characters literally", () => {
    expect(matchGlob("src/a.b/locales", "src/a.b/locales")).toBe(true);
    expect(matchGlob("src/a.b/locales", "src/axb/locales")).toBe(false);
  });

  it("normalizes Windows separators and leading ./", () => {
    expect(matchGlob("./src/**/locales", "src\\features\\auth\\locales")).toBe(true);
    expect(toPosixPath(".\\src\\common\\")).toBe("src/common");
  });
});

describe("globBase", () => {
  it("is the part before the first wildcard", () => {
    expect(globBase("src/**/locales")).toBe("src");
    expect(globBase("src/features/*/locales")).toBe("src/features");
    expect(globBase("src/common/locales")).toBe("src/common/locales");
    expect(globBase("**/locales")).toBe("");
  });
});

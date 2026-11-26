import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocaleFileError, readLocaleFile } from "../utils/helpers/read-locale-file";
import { createFixtureTree } from "./helpers";

const cleanups: Array<() => void> = [];
afterEach(() => {
  for (const remove of cleanups.splice(0)) remove();
});

function read(content: string) {
  const tree = createFixtureTree({ "src/auth/locales/en.json": content });
  cleanups.push(tree.remove);
  return () => readLocaleFile(tree.root, join(tree.root, "src/auth/locales/en.json"));
}

describe("readLocaleFile", () => {
  it("returns the parsed object", () => {
    expect(read('{ "login": { "title": "Sign in" } }')()).toEqual({ login: { title: "Sign in" } });
  });

  it("names the file when the JSON is invalid", () => {
    const run = read("{ nope");
    expect(run).toThrow(LocaleFileError);
    expect(run).toThrow("[aureusI18n] src/auth/locales/en.json is not valid JSON");
  });

  it.each([
    ["[]", "an array"],
    ['"text"', "a string"],
    ["null", "null"],
    ["3", "a number"],
  ])("rejects %s at the top level", (content, description) => {
    expect(read(content)).toThrow(
      `[aureusI18n] src/auth/locales/en.json must contain a JSON object of translations, but it contains ${description}.`,
    );
  });

  it("names the file when it cannot be read", () => {
    const tree = createFixtureTree({});
    cleanups.push(tree.remove);
    expect(() => readLocaleFile(tree.root, join(tree.root, "missing.json"))).toThrow(
      "[aureusI18n] missing.json cannot be read",
    );
  });
});

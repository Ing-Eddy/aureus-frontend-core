// @vitest-environment node
import { fileURLToPath } from "node:url";
import { findUndocumented } from "@aureus-core/doc-guard";
import { describe, expect, it } from "vitest";

// Guard for the public API: every export and prop of a public module needs a doc comment
// (spec: monorepo-tooling, "Documented public API"; rules in CONTRIBUTING.md, "Doc comments").
const packageDir = fileURLToPath(new URL("..", import.meta.url));
const entries = ["src/vite/index.ts", "src/runtime/index.ts"];

describe("public API documentation", () => {
  it("documents every public export and prop", { timeout: 60_000 }, () => {
    expect(findUndocumented({ packageDir, entries })).toEqual([]);
  });
});

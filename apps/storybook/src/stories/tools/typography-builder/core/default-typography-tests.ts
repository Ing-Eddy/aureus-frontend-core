import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import { installCommand } from "./install-command";
import { parseTypographyCss } from "./parse-typography";
import { checkReadability } from "./readability-checks";
import { resolveTypography } from "./resolve-typography";
import { serializeTypography, typographyDeclarations } from "./serialize-typography";

const packageCss = readFileSync(
  fileURLToPath(
    new URL("../../../../../../../packages/ui/src/styles/typography.css", import.meta.url),
  ),
  "utf8",
);

/** The package's own `:root` declarations, whitespace-normalized. */
const packageValues = parseTypographyCss(packageCss).declarations;

describe("default typography", () => {
  const resolved = resolveTypography(createDefaultDraft());

  it("declares exactly the package's variables, in the same order", () => {
    const exported = typographyDeclarations(resolved).map((line) =>
      line.slice(0, line.indexOf(":")),
    );
    expect(exported).toEqual([...packageValues.keys()]);
  });

  it.each(typographyDeclarations(resolveTypography(createDefaultDraft())))(
    "matches the package: %s",
    (line) => {
      const name = line.slice(0, line.indexOf(":"));
      const value = line.slice(line.indexOf(":") + 1, -1).trim();
      expect(value).toBe(packageValues.get(name));
    },
  );

  it("needs no install and raises no readability warning", () => {
    expect(installCommand(resolved)).toBeUndefined();
    expect(serializeTypography(resolved)).not.toContain("@import");
    expect(checkReadability(resolved)).toEqual([]);
  });
});

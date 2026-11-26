import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findUndocumented } from "..";

const cleanups: string[] = [];
afterEach(() => {
  for (const folder of cleanups.splice(0)) rmSync(folder, { recursive: true, force: true });
});

const tsconfig = JSON.stringify({
  compilerOptions: {
    strict: true,
    target: "es2022",
    module: "esnext",
    moduleResolution: "bundler",
    skipLibCheck: true,
  },
  include: ["src"],
});

/** A throwaway package: relative path → content. */
function fixture(files: Record<string, string>) {
  const packageDir = mkdtempSync(join(tmpdir(), "doc-guard-"));
  cleanups.push(packageDir);
  for (const [path, content] of Object.entries({ "tsconfig.json": tsconfig, ...files })) {
    mkdirSync(dirname(join(packageDir, path)), { recursive: true });
    writeFileSync(join(packageDir, path), content);
  }
  return packageDir;
}

const check = (files: Record<string, string>, entries = ["src/*/index.ts"]) =>
  findUndocumented({ packageDir: fixture(files), entries });

/** A package with one public module made of `source`, re-exported through its barrel. */
const module_ = (source: string) => ({
  "src/modal/index.ts": 'export * from "./modal";\n',
  "src/modal/modal.ts": source,
});

describe("findUndocumented", () => {
  it("reports nothing for documented exports and props", () => {
    expect(
      check(
        module_(`
/** A modal. */
export interface ModalProps {
  /** Whether it is open. */
  open?: boolean;
}
/** Renders a modal. */
export function Modal(_props: ModalProps) {}
/** Sizes. */
export const sizes = ["sm"] as const;
`),
      ),
    ).toEqual([]);
  });

  it("names the file, line and symbol of an undocumented export", () => {
    expect(check(module_("export function Modal() {}\nexport const size = 1;\n"))).toEqual([
      "src/modal/modal.ts:1 → Modal has no doc comment",
      "src/modal/modal.ts:2 → size has no doc comment",
    ]);
  });

  it("does not accept a comment made only of tags, or a line comment", () => {
    expect(
      check(module_("/** @internal */\nexport const a = 1;\n// b\nexport const b = 2;\n")),
    ).toHaveLength(2);
  });

  it("names the type and the undocumented prop", () => {
    expect(
      check(
        module_(`
/** Props. */
export interface ModalProps {
  title: string;
  onClose?(): void;
}
`),
      ),
    ).toEqual([
      "src/modal/modal.ts:4 → ModalProps.title has no doc comment",
      "src/modal/modal.ts:5 → ModalProps.onClose has no doc comment",
    ]);
  });

  it("reports props inherited from a private type of the package", () => {
    expect(
      check({
        "src/modal/index.ts": 'export type { ModalProps } from "./modal";\n',
        "src/modal/modal.ts": `
import type { Base } from "../internal/base";
/** Props. */
export interface ModalProps extends Base {}
`,
        "src/internal/base.ts": "export interface Base {\n  id: string;\n}\n",
      }),
    ).toEqual(["src/internal/base.ts:2 → Base.id has no doc comment"]);
  });

  it("reports an inherited prop once, even through several exports", () => {
    expect(
      check(
        module_(`
interface Base { id: string }
/** A. */
export interface A extends Base {}
/** B. */
export interface B extends Base {}
`),
      ),
    ).toEqual(["src/modal/modal.ts:2 → Base.id has no doc comment"]);
  });

  it("reports props of inline object types, in props and in function parameters", () => {
    expect(
      check(
        module_(`
/** Props. */
export interface ModalProps {
  /** Texts. */
  texts: { close: string };
  /** Called on change. */
  onChange?: (details: { reason: string }) => void;
}
/** A handler. */
export type Handler = (event: { id: string }) => void;
`),
      ),
    ).toEqual([
      "src/modal/modal.ts:5 → ModalProps.texts.close has no doc comment",
      "src/modal/modal.ts:7 → ModalProps.onChange.reason has no doc comment",
      "src/modal/modal.ts:10 → Handler.id has no doc comment",
    ]);
  });

  it("needs no comment for `never` props, and one per prop name in a union", () => {
    expect(
      check(
        module_(`
/** Props. */
export type FieldProps =
  | {
      /** Help text. */
      info: string;
      /** Name of the help button. */
      infoLabel: string;
    }
  | { info?: never; infoLabel?: never }
  | { info: number; infoLabel: string };
`),
      ),
    ).toEqual([]);
  });

  it("reports a union prop that no member documents", () => {
    expect(
      check(module_("/** Mode. */\nexport type Mode = { value: 1 } | { value: 2 };\n")),
    ).toEqual(["src/modal/modal.ts:2 → Mode.value has no doc comment"]);
  });

  it("ignores third-party and shadcn declarations", () => {
    expect(
      check({
        "node_modules/some-lib/package.json": '{ "name": "some-lib", "types": "index.d.ts" }',
        "node_modules/some-lib/index.d.ts": "export interface ThirdParty { href: string }\n",
        "src/shadcn/button.ts": "export interface ButtonProps { variant?: string }\n",
        "src/modal/index.ts":
          'export type { ModalProps } from "./modal";\nexport type { ButtonProps } from "../shadcn/button";\nexport type { ThirdParty } from "some-lib";\n',
        "src/modal/modal.ts": `
import type { ThirdParty } from "some-lib";
import type { ButtonProps } from "../shadcn/button";
/** Props. */
export interface ModalProps extends ThirdParty, ButtonProps {}
`,
      }),
    ).toEqual([]);
  });

  it("ignores private members of an exported class", () => {
    expect(
      check(
        module_(`
/** A store. */
export class Store {
  private cache = 1;
  #secret = 2;
  size = 0;
}
`),
      ),
    ).toEqual(["src/modal/modal.ts:6 → Store.size has no doc comment"]);
  });

  it("ignores declarations that are not exported by an entry", () => {
    expect(
      check({
        ...module_("/** Shown. */\nexport const shown = 1;\nexport const hidden = 2;\n"),
        "src/modal/index.ts": 'export { shown } from "./modal";\n',
      }),
    ).toEqual([]);
  });

  it("covers a new module with no configuration", () => {
    expect(
      check({
        ...module_("/** M. */\nexport const modal = 1;\n"),
        "src/drawer/index.ts": "export const drawer = 1;\n",
      }),
    ).toEqual(["src/drawer/index.ts:1 → drawer has no doc comment"]);
  });

  it("never treats internal folders as entries", () => {
    expect(
      check({
        ...module_("/** M. */\nexport const modal = 1;\n"),
        "src/internal/index.ts": "export const helper = 1;\n",
      }),
    ).toEqual([]);
  });

  it("throws when an entry glob matches nothing", () => {
    expect(() => check({ "src/internal/index.ts": "export {};\n" })).toThrow(
      'doc-guard: no public entry point matches "src/*/index.ts"',
    );
    expect(() => check(module_("export {};\n"), ["src/modal/index.ts", "src/gone.ts"])).toThrow(
      '"src/gone.ts"',
    );
    expect(() => check(module_("export {};\n"), [])).toThrow("no entry point was given");
  });
});

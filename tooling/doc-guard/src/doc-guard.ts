import { globSync, realpathSync } from "node:fs";
import { join, relative, sep } from "node:path";
// TypeScript 5 under an alias: its compiler API is stable, TypeScript 7's is not yet.
import ts from "typescript-api";
import type { FindUndocumentedOptions } from "./types";

/** One missing comment, before it is formatted. */
interface Finding {
  readonly file: string;
  readonly line: number;
  readonly name: string;
}

const toPosix = (path: string) => path.split(sep).join("/");

/** The entry files matched by the globs. Throws when a glob matches none. */
function entryFiles(packageDir: string, entries: readonly string[]): string[] {
  const files = entries.flatMap((pattern) => {
    const matches = globSync(pattern, { cwd: packageDir })
      .map(toPosix)
      .filter((file) => !file.split("/").includes("internal"));
    // A guard that silently checks nothing would pass forever.
    if (matches.length === 0) {
      throw new Error(`doc-guard: no public entry point matches "${pattern}" in ${packageDir}.`);
    }
    return matches.map((file) => join(packageDir, file));
  });
  if (files.length === 0) throw new Error("doc-guard: no entry point was given.");
  return [...new Set(files)].sort();
}

/** The package's own compiler options, so imports and path aliases resolve as in its build. */
function compilerOptions(packageDir: string): ts.CompilerOptions {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    join(packageDir, "tsconfig.json"),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throw new Error(
          `doc-guard: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
        );
      },
    },
  );
  if (!parsed) throw new Error(`doc-guard: cannot read ${packageDir}/tsconfig.json.`);
  // No global types: only what the sources import matters here.
  return { ...parsed.options, noEmit: true, types: [] };
}

/** Whether a declaration has a `/** … *\/` comment with text (a comment of only tags is empty). */
const hasComment = (declaration: ts.Declaration) =>
  ts
    .getJSDocCommentsAndTags(declaration)
    .some((node) => ts.isJSDoc(node) && Boolean(ts.getTextOfJSDocComment(node.comment)?.trim()));

type Member =
  | ts.PropertySignature
  | ts.PropertyDeclaration
  | ts.MethodSignature
  | ts.MethodDeclaration
  | ts.PropertyAssignment
  | ts.ShorthandPropertyAssignment
  | ts.GetAccessorDeclaration;

const isMember = (node: ts.Node): node is Member =>
  ts.isPropertySignature(node) ||
  ts.isPropertyDeclaration(node) ||
  ts.isMethodSignature(node) ||
  ts.isMethodDeclaration(node) ||
  ts.isPropertyAssignment(node) ||
  ts.isShorthandPropertyAssignment(node) ||
  ts.isGetAccessorDeclaration(node);

/** `prop?: never` only keeps a prop out of one branch of a union: it describes nothing. */
const isNever = (member: Member) =>
  (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) &&
  member.type?.kind === ts.SyntaxKind.NeverKeyword;

const isPrivate = (member: Member) =>
  (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Private) !== 0 ||
  ts.isPrivateIdentifier(member.name);

/** The members of every object type written inline inside `node`. */
function inlineMembers(node: ts.Node): Member[] {
  const found: Member[] = [];
  const visit = (child: ts.Node) => {
    if (!ts.isTypeLiteralNode(child)) {
      ts.forEachChild(child, visit);
      return;
    }
    const members: readonly ts.Node[] = child.members;
    found.push(...members.filter(isMember));
  };
  visit(node);
  return found;
}

/**
 * Every public export and prop of a package that has no doc comment, as sorted
 * `"src/file.ts:12 → Name has no doc comment"` lines. An empty array means the public API is
 * documented.
 *
 * Public means exported by one of the `entries` and declared under the package's `src/`, outside
 * `src/shadcn/`. The props of an exported type include the ones inherited from the package's own
 * private types and those of object types written inline. A prop declared by several members of a
 * union needs one comment among them, and `never` props need none.
 *
 * @example
 * expect(findUndocumented({ packageDir, entries: ["src/*\/index.ts"] })).toEqual([]);
 */
export function findUndocumented({ packageDir, entries }: FindUndocumentedOptions): string[] {
  const root = realpathSync(packageDir);
  const source = `${toPosix(root)}/src/`;
  const files = entryFiles(root, entries);
  const program = ts.createProgram({ rootNames: files, options: compilerOptions(root) });
  const checker = program.getTypeChecker();

  const isOwn = (declaration: ts.Declaration) => {
    const file = declaration.getSourceFile().fileName;
    return (
      file.startsWith(source) &&
      !file.startsWith(`${source}shadcn/`) &&
      !file.includes("/node_modules/")
    );
  };

  /** Keyed by declaration, so a prop reached through several exports is reported once. */
  const findings = new Map<ts.Declaration, Finding>();
  const report = (declaration: ts.Declaration, name: string) => {
    if (findings.has(declaration)) return;
    const file = declaration.getSourceFile();
    const at = ts.getNameOfDeclaration(declaration) ?? declaration;
    findings.set(declaration, {
      file: toPosix(relative(root, file.fileName)),
      line: file.getLineAndCharacterOfPosition(at.getStart(file)).line + 1,
      name,
    });
  };

  /** The type or interface that declares a member, or `fallback` for inline object types. */
  const ownerOf = (member: Member, fallback: string) => {
    const parent = member.parent;
    return ts.isInterfaceDeclaration(parent) || ts.isClassDeclaration(parent)
      ? (parent.name?.text ?? fallback)
      : fallback;
  };

  /** One prop name with all its declarations: documented when any of them has a comment. */
  function checkProp(path: string, members: readonly Member[], named: boolean): void {
    const [first] = members;
    if (!first) return;
    const name = named
      ? `${ownerOf(first, path)}.${first.name.getText()}`
      : `${path}.${first.name.getText()}`;
    if (!members.some(hasComment)) report(first, name);
    checkInline(
      name,
      members.flatMap((member) =>
        "type" in member && member.type ? inlineMembers(member.type) : [],
      ),
    );
  }

  /** The members of inline object types, grouped by name (they may come from a union). */
  function checkInline(path: string, members: readonly Member[]): void {
    for (const [, group] of groupByName(members.filter((member) => !isNever(member)))) {
      checkProp(path, group, false);
    }
  }

  function checkType(
    symbol: ts.Symbol,
    name: string,
    declarations: readonly ts.Declaration[],
  ): void {
    const type = checker.getDeclaredTypeOfSymbol(symbol);
    const constituents = type.isUnion() ? type.types : [type];
    const props = new Map<string, Set<Member>>();
    for (const constituent of constituents) {
      for (const property of checker.getPropertiesOfType(constituent)) {
        for (const declaration of property.declarations ?? []) {
          if (!isMember(declaration) || !isOwn(declaration)) continue;
          if (isNever(declaration) || isPrivate(declaration)) continue;
          const group = props.get(property.name) ?? new Set<Member>();
          props.set(property.name, group.add(declaration));
        }
      }
    }
    for (const group of props.values()) checkProp(name, [...group], true);
    // Function types have no props: check the object types written in their parameters.
    if (type.getCallSignatures().length > 0) {
      for (const declaration of declarations) {
        if (ts.isTypeAliasDeclaration(declaration))
          checkInline(name, inlineMembers(declaration.type));
      }
    }
  }

  const seen = new Set<ts.Symbol>();
  for (const file of files) {
    const sourceFile = program.getSourceFile(file);
    const module = sourceFile && checker.getSymbolAtLocation(sourceFile);
    if (!module) continue;
    for (const exported of checker.getExportsOfModule(module)) {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      const declarations = (symbol.declarations ?? []).filter(isOwn);
      const [first] = declarations;
      if (!first || seen.has(symbol)) continue;
      seen.add(symbol);
      if (!symbol.getDocumentationComment(checker).some((part) => part.text.trim())) {
        report(first, symbol.name);
      }
      const typeLike = ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Class;
      if (symbol.flags & typeLike) checkType(symbol, symbol.name, declarations);
    }
  }

  return [...findings.values()]
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.name.localeCompare(b.name))
    .map((finding) => `${finding.file}:${finding.line} → ${finding.name} has no doc comment`);
}

function groupByName(members: readonly Member[]): Map<string, Member[]> {
  const groups = new Map<string, Member[]>();
  for (const member of members) {
    const name = member.name.getText();
    groups.set(name, [...(groups.get(name) ?? []), member]);
  }
  return groups;
}

// Verifies the built package the way a consumer would receive it. Run after `build`.
// Every failure names the module or file at fault; the script exits 1 if any check fails.
import { execFileSync, spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { publint } from "publint";
import { formatMessage } from "publint/utils";

const pkgDir = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(pkgDir, "src");
const distDir = join(pkgDir, "dist");
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));

const failures = [];
const fail = (check, message) => failures.push(`[${check}] ${message}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

if (!existsSync(distDir)) {
  console.error("dist/ not found: run `pnpm build` first.");
  process.exit(1);
}

// 1. Every public module (a `src/<module>/index.ts`, except `internal`) has JavaScript and types.
const modules = readdirSync(srcDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "internal")
  .map((entry) => entry.name)
  .filter((name) => existsSync(join(srcDir, name, "index.ts")));

if (modules.length === 0) fail("outputs", "no public module found in src/");
for (const name of modules) {
  for (const ext of [".js", ".d.ts"]) {
    if (!existsSync(join(distDir, name, `index${ext}`))) {
      fail("outputs", `module "${name}": missing dist/${name}/index${ext}`);
    }
  }
}

// 2. No internal path alias leaks into the output.
const aliasPattern = /(?:from\s*|import\s*\(\s*)["']@\//;
for (const file of walk(distDir).filter((path) => /\.(js|d\.ts)$/.test(path))) {
  if (aliasPattern.test(readFileSync(file, "utf8"))) {
    fail("aliases", `${relative(pkgDir, file)} imports an unresolved "@/" alias`);
  }
}

// 3. Packaging lint.
const { messages } = await publint({ pkgDir, level: "warning", strict: true, pack: "pnpm" });
for (const message of messages) fail("publint", formatMessage(message, pkg) ?? message.code);

// 4. Every module resolves to ESM + types for ESM consumers (node16 and bundler).
//    attw cannot expand wildcard exports, so the entry points are listed explicitly.
const entrypoints = modules.map((name) => `./${name}`);
const esmResolutions = new Set(["node16-esm", "bundler"]);
// attw exits before flushing large output to a pipe, so its JSON goes to a file (synchronous writes).
const attwDir = mkdtempSync(join(tmpdir(), "check-package-"));
const attwFile = join(attwDir, "attw.json");
const attwFd = openSync(attwFile, "w");
try {
  execFileSync(
    "pnpm",
    [
      "exec",
      "attw",
      "--pack",
      ".",
      "--profile",
      "esm-only",
      "--format",
      "json",
      "--entrypoints",
      ...entrypoints,
    ],
    { cwd: pkgDir, stdio: ["ignore", attwFd, "pipe"], encoding: "utf8" },
  );
} catch (error) {
  // attw exits 1 when it finds problems; the JSON report is still written.
  if (error.status !== 1) fail("attw", `attw did not run:\n${error.stderr ?? error.message}`);
} finally {
  closeSync(attwFd);
}
const attwOutput = readFileSync(attwFile, "utf8");
rmSync(attwDir, { recursive: true, force: true });
if (attwOutput) {
  for (const problem of JSON.parse(attwOutput).analysis.problems) {
    if (!esmResolutions.has(problem.resolutionKind)) continue; // CJS/node10 are out of scope (esm-only)
    fail("attw", `${problem.entrypoint} (${problem.resolutionKind}): ${problem.kind}`);
  }
}

// 5. Through the package's own exports (self-reference), every module loads and the private layer
//    and the root do not resolve.
const resolves = (specifier) =>
  spawnSync(
    process.execPath,
    ["--input-type=module", "-e", `await import(${JSON.stringify(specifier)});`],
    { cwd: pkgDir, encoding: "utf8" },
  );
for (const name of modules) {
  const result = resolves(`${pkg.name}/${name}`);
  if (result.status !== 0) {
    fail("exports", `module "${name}" does not load through its export:\n${result.stderr}`);
  }
}
const privateSpecifiers = [
  pkg.name,
  `${pkg.name}/internal`,
  ...readdirSync(join(srcDir, "internal"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${pkg.name}/internal/${entry.name}`),
];
for (const specifier of privateSpecifiers) {
  if (resolves(specifier).status === 0) fail("exports", `"${specifier}" must not resolve`);
}

// 6. The tarball ships only build output and package metadata.
const packed = JSON.parse(
  execFileSync("pnpm", ["pack", "--dry-run", "--json"], { cwd: pkgDir, encoding: "utf8" }),
);
const allowedMetadata = /^(package\.json|README(\.md)?|CHANGELOG\.md|LICENSE(\.md)?)$/i;
for (const { path } of packed.files) {
  if (/(^|\/)src\//.test(path)) fail("tarball", `${path}: source files must not be published`);
  else if (/-tests\.(js|d\.ts)$|(^|\/)tests\//.test(path)) {
    fail("tarball", `${path}: tests must not be published`);
  } else if (!path.startsWith("dist/") && !allowedMetadata.test(path)) {
    fail("tarball", `${path}: only dist/ and package metadata may be published`);
  }
}

if (failures.length > 0) {
  console.error(`check:package failed (${failures.length}):\n\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(
  `check:package passed: ${modules.length} modules (${modules.join(", ")}), ` +
    `${packed.files.length} packed files.`,
);

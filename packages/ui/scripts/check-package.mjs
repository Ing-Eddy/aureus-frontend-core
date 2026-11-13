// Verifies the built package the way a consumer would receive it. Run after `build`.
// Every failure names the component or file at fault; the script exits 1 if any check fails.
import { execFileSync } from "node:child_process";
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

const basenames = (dir, ext) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => file.endsWith(ext))
        .map((file) => file.slice(0, -ext.length))
    : [];

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

if (!existsSync(distDir)) {
  console.error("dist/ not found: run `pnpm build` first.");
  process.exit(1);
}

// 1. Every installed shadcn component, hook and custom component has a compiled module and declarations.
const components = basenames(join(srcDir, "shadcn/ui"), ".tsx");
const hooks = basenames(join(srcDir, "shadcn/hooks"), ".ts");
const customComponents = readdirSync(join(srcDir, "components")).filter((entry) =>
  existsSync(join(srcDir, "components", entry, "index.ts")),
);

const expectedOutputs = [
  ...components.map((name) => ({ label: `component "${name}"`, base: `shadcn/ui/${name}` })),
  ...hooks.map((name) => ({ label: `hook "${name}"`, base: `shadcn/hooks/${name}` })),
  ...customComponents.map((name) => ({
    label: `custom component "${name}"`,
    base: `components/${name}/index`,
  })),
  { label: "lib/utils", base: "shadcn/lib/utils" },
];
for (const { label, base } of expectedOutputs) {
  for (const ext of [".js", ".d.ts"]) {
    if (!existsSync(join(distDir, base + ext)))
      fail("outputs", `${label}: missing dist/${base}${ext}`);
  }
}
if (!existsSync(join(distDir, "styles/index.css")))
  fail("outputs", "missing dist/styles/index.css");

// 2. No internal path alias leaks into the output.
const aliasPattern = /(?:from\s*|import\s*\(\s*)["']@\//;
for (const file of walk(distDir).filter((path) => /\.(js|d\.ts)$/.test(path))) {
  if (aliasPattern.test(readFileSync(file, "utf8"))) {
    fail("aliases", `${relative(pkgDir, file)} imports an unresolved "@/" alias`);
  }
}

// 3. Packaging lint. The `./components/*` wildcard legitimately matches nothing while
//    src/components/ has no component yet; that single case is tolerated.
const { messages } = await publint({ pkgDir, level: "warning", strict: true, pack: "pnpm" });
for (const message of messages) {
  const emptyComponentsWildcard =
    customComponents.length === 0 &&
    message.code === "EXPORTS_GLOB_NO_MATCHED_FILES" &&
    message.path.includes("./components/*");
  if (!emptyComponentsWildcard) fail("publint", formatMessage(message, pkg) ?? message.code);
}

// 4. Every public entry point resolves to ESM + types for ESM consumers (node16 and bundler).
//    attw cannot expand wildcard exports, so the entry points are listed explicitly.
const entrypoints = [
  ...components.map((name) => `./shadcn/${name}`),
  ...hooks.map((name) => `./hooks/${name}`),
  ...customComponents.map((name) => `./components/${name}`),
  "./lib/utils",
];
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

// 5. The tarball ships only build output and package metadata.
const packed = JSON.parse(
  execFileSync("pnpm", ["pack", "--dry-run", "--json"], { cwd: pkgDir, encoding: "utf8" }),
);
const allowedMetadata = /^(package\.json|README(\.md)?|CHANGELOG\.md|LICENSE(\.md)?)$/i;
for (const { path } of packed.files) {
  if (/(^|\/)src\//.test(path)) fail("tarball", `${path}: source files must not be published`);
  else if (/-(tests|stories)\.[jt]sx?$|-(tests|stories)\.d\.ts$/.test(path)) {
    fail("tarball", `${path}: tests and stories must not be published`);
  } else if (!path.startsWith("dist/") && !allowedMetadata.test(path)) {
    fail("tarball", `${path}: only dist/ and package metadata may be published`);
  }
}

if (failures.length > 0) {
  console.error(`check:package failed (${failures.length}):\n\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(
  `check:package passed: ${components.length} components, ${hooks.length} hooks, ` +
    `${customComponents.length} custom components, ${entrypoints.length} entry points, ` +
    `${packed.files.length} packed files.`,
);

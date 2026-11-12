// Re-pulls every installed shadcn component (and utils) from the registry, overwriting the CLI-owned files.
// Review the resulting git diff: hand edits in src/shadcn show up as removals.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

const uiDir = new URL("../src/shadcn/ui/", import.meta.url);
const components = readdirSync(uiDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.slice(0, -".tsx".length));

if (components.length === 0) {
  console.log("No shadcn components installed.");
  process.exit(0);
}

execFileSync("pnpm", ["exec", "shadcn", "add", "utils", ...components, "--overwrite", "--yes"], {
  stdio: "inherit",
});

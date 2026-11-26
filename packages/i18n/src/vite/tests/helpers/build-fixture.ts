import { build, type Rolldown } from "vite";
import type { AureusI18nOptions } from "../../types";
import { aureusI18n } from "../../vite";

/** The app entry of fixture projects: it imports the virtual module like a real app. */
export const fixtureApp = {
  "index.html":
    '<!doctype html><html><body><script type="module" src="/src/main.js"></script></body></html>',
  "src/main.js":
    'import resources from "virtual:aureus-i18n";\nconsole.log(resources.namespaces);\n',
};

/** Runs `vite build` on `root` without writing to disk, and returns the output chunks. */
export async function buildFixture(root: string, options: AureusI18nOptions) {
  const result = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [aureusI18n(options)],
    build: { write: false },
  });
  const outputs = (Array.isArray(result) ? result : [result]) as Rolldown.RolldownOutput[];
  return outputs.flatMap((output) => output.output);
}

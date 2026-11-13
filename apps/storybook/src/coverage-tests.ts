import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { type ComponentDocs, validateComponentDocs } from "@sb/docs/define-component-docs";
import { describe, expect, it } from "vitest";

const shadcnUiDir = fileURLToPath(new URL("../../../packages/ui/src/shadcn/ui", import.meta.url));
const storiesDir = fileURLToPath(new URL("./stories/shadcn", import.meta.url));

/** Sidebar categories (folder → title segment). A component folder must live in one of them. */
const categories = {
  actions: "Actions",
  forms: "Forms",
  overlays: "Overlays",
  navigation: "Navigation",
  "data-display": "Data Display",
  feedback: "Feedback",
  layout: "Layout",
  "ai-chat": "AI & Chat",
} as const;

const installed = readdirSync(shadcnUiDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.slice(0, -".tsx".length))
  .sort();

/** component name → its category folder, for every `stories/shadcn/<category>/<name>/` found. */
const located = new Map<string, string>();
for (const category of readdirSync(storiesDir, { withFileTypes: true })) {
  if (!category.isDirectory()) continue;
  for (const folder of readdirSync(join(storiesDir, category.name), { withFileTypes: true })) {
    if (folder.isDirectory()) located.set(folder.name, category.name);
  }
}

const exportedStories = (source: string) =>
  [...source.matchAll(/^export const (\w+)/gm)].map((match) => match[1] ?? "");

describe("every installed shadcn component is documented", () => {
  it.each(installed)("%s", async (name) => {
    const category = located.get(name);
    expect(category, `no folder stories/shadcn/<category>/${name}/`).toBeDefined();
    if (!category) return;
    expect(Object.keys(categories), `unknown category folder "${category}"`).toContain(category);

    const folder = join(storiesDir, category, name);
    const storiesFile = join(folder, `${name}-stories.tsx`);
    const docsFile = join(folder, `${name}-docs.ts`);
    expect(existsSync(storiesFile), `missing ${name}-stories.tsx`).toBe(true);
    expect(existsSync(docsFile), `missing ${name}-docs.ts`).toBe(true);
    if (!existsSync(storiesFile) || !existsSync(docsFile)) return;

    const stories = readFileSync(storiesFile, "utf8");
    expect(stories, "stories must attach the docs as parameters.aureusDocs").toMatch(/aureusDocs/);
    const title = `shadcn/${categories[category as keyof typeof categories]}/`;
    expect(stories, `stories title must start with "${title}"`).toContain(`title: "${title}`);

    const docs = (await import(/* @vite-ignore */ docsFile)).docs as ComponentDocs | undefined;
    expect(docs, `${name}-docs.ts must export \`docs\``).toBeDefined();
    if (!docs) return;
    expect(docs.importPath).toBe(`@aureus-core/ui/shadcn/${name}`);

    const missingStories = docs.stories.filter(
      (story) => !exportedStories(stories).includes(story),
    );
    expect(missingStories, "docs describe stories that the stories file does not export").toEqual(
      [],
    );
    // Playground is rendered at the top of the page by <Primary />; every other story is an example.
    const undocumented = exportedStories(stories).filter(
      (story) => story !== "Playground" && !docs.stories.includes(story),
    );
    expect(undocumented, "stories without a localized description in docs.stories").toEqual([]);
    expect(validateComponentDocs(docs), "incomplete documentation content").toEqual([]);
  });
});

const mdxDirs = ["guides", "foundations"].map((dir) =>
  fileURLToPath(new URL(`./stories/${dir}`, import.meta.url)),
);
const mdxFiles = mdxDirs.flatMap((dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => join(dir, file))
    : [],
);

/** Opening tags of each locale block (`<En>` / `<Es>`), ignoring the import line. */
const count = (source: string, tag: string) =>
  (source.match(new RegExp(`<${tag}>`, "g")) ?? []).length;

describe("every guide is bilingual", () => {
  it("finds the guides and foundations pages", () => {
    expect(mdxFiles.length).toBeGreaterThanOrEqual(9);
  });

  it.each(mdxFiles.map((file) => [file.split("/stories/")[1], file]))("%s", (_name, file) => {
    const source = readFileSync(file as string, "utf8");
    const en = count(source, "En");
    const es = count(source, "Es");
    expect(en, "no <En> blocks").toBeGreaterThan(0);
    expect(es, `${en} <En> blocks but ${es} <Es> blocks`).toBe(en);
    expect(count(source, "/En"), "unclosed <En>").toBe(en);
    expect(count(source, "/Es"), "unclosed <Es>").toBe(es);
  });
});

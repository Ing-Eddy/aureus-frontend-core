import { Source } from "@storybook/addon-docs/blocks";
import { useDocsGlobal } from "../i18n/use-locale";

export interface ImportSpec {
  path: string;
  names: readonly string[];
}

function importLine({ path, names }: ImportSpec): string {
  const list = names.length > 3 ? `{\n  ${names.join(",\n  ")},\n}` : `{ ${names.join(", ")} }`;
  return `import ${list} from "${path}";`;
}

/** Copyable import statements for public paths (the Source block has a copy button). */
export function ImportSnippet({ imports }: { imports: readonly ImportSpec[] }) {
  const dark = useDocsGlobal("theme") === "dark";
  return <Source language="tsx" code={imports.map(importLine).join("\n")} dark={dark} />;
}

import type { I18nResourceContent } from "@/internal/types";
import { flattenKeys } from "./flatten-keys";
import type { ScanResult } from "./scan-namespaces";

/** One difference between a language and the reference language. */
export type ParityFinding =
  | {
      readonly kind: "missing" | "extra";
      readonly namespace: string;
      readonly language: string;
      readonly key: string;
    }
  | {
      readonly kind: "missing-file";
      readonly namespace: string;
      readonly language: string;
      readonly file: string;
    };

const PLURAL_SUFFIX = /_(?:ordinal_)?(?:zero|one|two|few|many|other)$/;

/**
 * A key without its plural suffix (`items_one` → `items`, `place_ordinal_two` → `place`).
 * Languages use different plural categories, so plural forms are compared by their base key.
 */
export const pluralBase = (key: string) => key.replace(PLURAL_SUFFIX, "");

const baseKeys = (content: I18nResourceContent) => new Set(flattenKeys(content).map(pluralBase));

/**
 * Compares, per namespace, every language with `reference`: keys missing from a language, keys a
 * language has that the reference lacks, and language files missing from a namespace. `contentOf`
 * returns a file's parsed content, or `undefined` for a file that could not be read (it is
 * reported elsewhere and skipped here). The findings are sorted.
 */
export function checkKeyParity(
  scan: ScanResult,
  reference: string,
  contentOf: (file: string) => I18nResourceContent | undefined,
): ParityFinding[] {
  const findings: ParityFinding[] = [];
  for (const namespace of scan.namespaces) {
    for (const language of scan.languages) {
      if (!namespace.files[language]) {
        findings.push({
          kind: "missing-file",
          namespace: namespace.name,
          language,
          file: `${namespace.dir}/${language}.json`,
        });
      }
    }
    const referenceFile = namespace.files[reference];
    const referenceContent = referenceFile ? contentOf(referenceFile) : undefined;
    if (!referenceContent) continue;
    const expected = baseKeys(referenceContent);

    for (const [language, file] of Object.entries(namespace.files)) {
      if (language === reference) continue;
      const content = contentOf(file);
      if (!content) continue;
      const actual = baseKeys(content);
      for (const key of [...expected].sort()) {
        if (!actual.has(key))
          findings.push({ kind: "missing", namespace: namespace.name, language, key });
      }
      for (const key of [...actual].sort()) {
        if (!expected.has(key))
          findings.push({ kind: "extra", namespace: namespace.name, language, key });
      }
    }
  }
  return findings;
}

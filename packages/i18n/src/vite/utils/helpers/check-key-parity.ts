import type { I18nResourceContent } from "@/internal/types";
import { flattenKeys } from "./flatten-keys";
import type { ScanResult } from "./scan-namespaces";

/** One difference between a language and the reference language. */
export type ParityFinding =
  | {
      /** What differs: a key missing from `language`, or one only `language` has. */
      readonly kind: "missing" | "extra";
      /** The namespace where it differs. */
      readonly namespace: string;
      /** The language compared with the reference. */
      readonly language: string;
      /** The key's dot path, without a plural suffix. */
      readonly key: string;
    }
  | {
      readonly kind: "missing-file";
      readonly namespace: string;
      readonly language: string;
      /** The expected file of a language that has none in the namespace, relative to the root. */
      readonly file: string;
    };

/** i18next's plural suffixes, cardinal and ordinal. */
const PLURAL_SUFFIX = /_(?:ordinal_)?(?:zero|one|two|few|many|other)$/;

/**
 * A key without its plural suffix (`items_one` → `items`, `place_ordinal_two` → `place`).
 * Languages use different plural categories, so plural forms are compared by their base key.
 */
export const pluralBase = (key: string) => key.replace(PLURAL_SUFFIX, "");

/** The keys of a file with plural forms collapsed into their base key. */
const baseKeys = (content: I18nResourceContent) => new Set(flattenKeys(content).map(pluralBase));

/**
 * Compares, per namespace, every language with `reference`: keys missing from a language, keys a
 * language has that the reference lacks, and language files missing from a namespace. A namespace
 * without a readable reference file only reports its missing files. `contentOf` returns a file's
 * parsed content, or `undefined` for a file that could not be read (it is reported elsewhere and
 * skipped here). The findings follow the order of the scan, with keys sorted.
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

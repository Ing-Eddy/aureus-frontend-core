import type { ParityFinding } from "./check-key-parity";

const quoteList = (keys: readonly string[]) => keys.map((key) => `"${key}"`).join(", ");

/**
 * The parity findings as one message, grouped by namespace and then by language. The same text is
 * the development warning and the build error. Returns `undefined` when there is nothing to report.
 *
 * ```text
 * [aureusI18n] The translations are out of sync with "es" (the typesFrom language):
 *   auth
 *     en: missing "login.title"
 *   payments
 *     en: no file (expected src/features/payments/locales/en.json)
 * ```
 */
export function formatParityReport(
  findings: readonly ParityFinding[],
  reference: string,
): string | undefined {
  if (findings.length === 0) return undefined;
  const lines = [
    `[aureusI18n] The translations are out of sync with "${reference}" (the typesFrom language):`,
  ];
  const namespaces = [...new Set(findings.map((finding) => finding.namespace))].sort();
  for (const namespace of namespaces) {
    lines.push(`  ${namespace}`);
    const ofNamespace = findings.filter((finding) => finding.namespace === namespace);
    const languages = [...new Set(ofNamespace.map((finding) => finding.language))].sort();
    for (const language of languages) {
      const ofLanguage = ofNamespace.filter((finding) => finding.language === language);
      for (const finding of ofLanguage) {
        if (finding.kind === "missing-file")
          lines.push(`    ${language}: no file (expected ${finding.file})`);
      }
      const keysOf = (kind: "missing" | "extra") =>
        ofLanguage.flatMap((finding) => (finding.kind === kind ? [finding.key] : []));
      const missing = keysOf("missing");
      const extra = keysOf("extra");
      if (missing.length > 0) lines.push(`    ${language}: missing ${quoteList(missing)}`);
      if (extra.length > 0)
        lines.push(`    ${language}: not in "${reference}" ${quoteList(extra)}`);
    }
  }
  return lines.join("\n");
}

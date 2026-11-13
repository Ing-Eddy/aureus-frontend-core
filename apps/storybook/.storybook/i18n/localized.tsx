import type { ReactNode } from "react";
import type { Locale } from "./locale-types";
import { useLocale } from "./use-locale";

/** Renders the content of the active locale, for short inline text: `<Localized en="Hi" es="Hola" />`. */
export function Localized(props: Record<Locale, ReactNode>) {
  return <>{props[useLocale()]}</>;
}

function OnlyIn({ locale, children }: { locale: Locale; children?: ReactNode }) {
  return useLocale() === locale ? <>{children}</> : null;
}

/**
 * Markdown blocks for MDX guides. Leave a blank line after the opening tag so MDX parses the
 * children as Markdown (headings, lists, tables, code fences):
 *
 *     <En>
 *
 *     ## Install
 *
 *     </En>
 *     <Es>
 *
 *     ## Instalación
 *
 *     </Es>
 *
 * Every `<En>` block needs an `<Es>` counterpart; `coverage-tests.ts` checks the counts match.
 */
export function En({ children }: { children?: ReactNode }) {
  return <OnlyIn locale="en">{children}</OnlyIn>;
}

export function Es({ children }: { children?: ReactNode }) {
  return <OnlyIn locale="es">{children}</OnlyIn>;
}

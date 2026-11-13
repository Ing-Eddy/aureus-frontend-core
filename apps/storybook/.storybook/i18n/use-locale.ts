import { DocsContext, type DocsContextProps } from "@storybook/addon-docs/blocks";
import { useContext, useEffect, useState } from "react";
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from "storybook/internal/core-events";
import { defaultLocale, isLocale, type Locale } from "./locale-types";

type GlobalsPayload = { globals?: Record<string, unknown> };

/** The docs context implementation carries the story store, which is not part of its public type. */
type DocsContextWithStore = { store?: { userGlobals?: { globals?: Record<string, unknown> } } };

function globalFromUrl(name: string): string | undefined {
  // The preview iframe receives globals as `globals=locale:es;theme:dark`.
  const raw = new URLSearchParams(globalThis.location?.search ?? "").get("globals") ?? "";
  return new RegExp(`(?:^|;)${name}:([a-z-]+)`).exec(raw)?.[1];
}

/**
 * Current value of a toolbar global (`locale`, `theme`, `direction`) inside a docs page.
 * Docs pages are not re-rendered by Storybook when globals change, so this hook listens to the
 * preview channel and re-renders its component itself.
 *
 * Mode decision (design D4): live switching, no localStorage fallback. Measured on Storybook 10.6.7:
 * - MDX pages (guides, foundations) and story canvases update in place: the preview iframe keeps its
 *   JS state when a global changes.
 * - Component docs pages (CSF autodocs) are remounted by Storybook itself on ANY global change (theme
 *   and direction too, with or without this custom page), so the iframe reloads. The initial read
 *   below (story store, then URL) still renders the new value. The manager page never reloads.
 *
 * `explicitContext` is for the docs container itself, which renders above the DocsContext provider.
 */
export function useDocsGlobal(name: string, explicitContext?: DocsContextProps): unknown {
  const contextFromTree = useContext(DocsContext);
  const context = explicitContext ?? contextFromTree;
  const [value, setValue] = useState<unknown>(
    () =>
      (context as unknown as DocsContextWithStore).store?.userGlobals?.globals?.[name] ??
      globalFromUrl(name),
  );

  useEffect(() => {
    const channel = context.channel;
    const onGlobals = ({ globals }: GlobalsPayload = {}) => {
      if (globals && name in globals) setValue(globals[name]);
    };
    for (const event of [GLOBALS_UPDATED, UPDATE_GLOBALS, SET_GLOBALS]) {
      channel.on(event, onGlobals);
    }
    return () => {
      for (const event of [GLOBALS_UPDATED, UPDATE_GLOBALS, SET_GLOBALS]) {
        channel.off(event, onGlobals);
      }
    };
  }, [context, name]);

  return value;
}

/** Active documentation locale, chosen with the 🌐 toolbar. */
export function useLocale(): Locale {
  const locale = useDocsGlobal("locale");
  return isLocale(locale) ? locale : defaultLocale;
}

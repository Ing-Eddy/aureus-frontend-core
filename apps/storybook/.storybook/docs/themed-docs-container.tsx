import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { useEffect } from "react";
import { useDocsGlobal } from "../i18n/use-locale";
import { storybookThemeFor } from "../theme/storybook-themes";

/**
 * Applies the theme (`.dark` on `<html>`) and direction (`dir` on `<html>`) toolbars to docs pages.
 * Story decorators do that for canvases, but MDX pages without stories (guides, foundations) never
 * run a decorator, so their tokens would ignore the toolbars. The docs chrome (page background, text,
 * story frames, code blocks) also switches to the dark Storybook theme, so dark components are not
 * shown on a white page.
 */
export function ThemedDocsContainer(props: DocsContainerProps) {
  const theme = useDocsGlobal("theme", props.context);
  return (
    <DocsContainer {...props} theme={storybookThemeFor(theme)}>
      <ApplyToolbarGlobals theme={theme} />
      {props.children}
    </DocsContainer>
  );
}

function ApplyToolbarGlobals({ theme }: { theme: unknown }) {
  const direction = useDocsGlobal("direction");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(() => {
    document.documentElement.dir = direction === "rtl" ? "rtl" : "ltr";
  }, [direction]);
  return null;
}

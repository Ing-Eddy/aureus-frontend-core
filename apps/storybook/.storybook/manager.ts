import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { addons } from "storybook/manager-api";
import { lightTheme, storybookThemeFor } from "./theme/storybook-themes";

addons.setConfig({ theme: lightTheme });

/** The manager UI follows the `theme` toolbar, like the stories and docs pages. */
addons.register("aureus/theme-sync", (api) => {
  let current: unknown;
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => {
    const theme = globals?.theme;
    if (theme === current) return;
    current = theme;
    api.setOptions({ theme: storybookThemeFor(theme) });
  };
  api.on(SET_GLOBALS, apply);
  api.on(GLOBALS_UPDATED, apply);
});

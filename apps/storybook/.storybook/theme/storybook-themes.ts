import { create, type ThemeVars } from "storybook/theming";

/**
 * Storybook chrome themes (manager UI and docs pages). They follow the `theme` toolbar so a dark story
 * is never shown on a white docs page. `create()` needs concrete colors, so these are the hex values of
 * the shadcn neutral tokens: #0a0a0a = --background (dark), #171717 = --card, #262626 = --muted,
 * #fafafa = --foreground, #a1a1a1 = --muted-foreground.
 */
const brand = {
  brandTitle: "Aureus Frontend Kit",
  brandUrl: "https://github.com/Ing-Eddy/aureus-frontend-core",
  brandTarget: "_blank",
} as const;

export const lightTheme: ThemeVars = create({
  base: "light",
  ...brand,
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
});

export const darkTheme: ThemeVars = create({
  base: "dark",
  ...brand,
  // Accent for links and the selected sidebar item: 5.4:1 on the page background (docs links).
  colorSecondary: "#3b82f6",
  appBg: "#171717",
  appContentBg: "#0a0a0a",
  appPreviewBg: "#0a0a0a",
  appHoverBg: "#262626",
  appBorderColor: "rgba(255, 255, 255, 0.1)",
  textColor: "#fafafa",
  textMutedColor: "#a1a1a1",
  barBg: "#171717",
  barTextColor: "#a1a1a1",
  barHoverColor: "#fafafa",
  barSelectedColor: "#fafafa",
  inputBg: "#262626",
  inputBorder: "rgba(255, 255, 255, 0.15)",
  inputTextColor: "#fafafa",
});

/** Theme for a value of the `theme` global set by addon-themes ("light" | "dark"). */
export const storybookThemeFor = (theme: unknown): ThemeVars =>
  theme === "dark" ? darkTheme : lightTheme;

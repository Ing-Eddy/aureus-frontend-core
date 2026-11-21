import "@aureus-core/ui/styles.css";
import { DirectionProvider } from "@aureus-core/ui/shadcn/direction";
import { TooltipProvider } from "@aureus-core/ui/shadcn/tooltip";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";
import { ComponentDocsPage } from "./docs/component-docs-page";
import { ThemedDocsContainer } from "./docs/themed-docs-container";
import { defaultLocale, localeLabels, locales } from "./i18n/locale-types";

type Direction = "ltr" | "rtl";

/** Mirrors what a consumer does for RTL: `dir` on <html> plus the package's DirectionProvider. */
const withDirection: Decorator = (Story, context) => {
  const direction: Direction = context.globals.direction === "rtl" ? "rtl" : "ltr";
  document.documentElement.dir = direction;
  return (
    <DirectionProvider direction={direction}>
      <Story />
    </DirectionProvider>
  );
};

/** Tooltip and Sidebar need a TooltipProvider; consumers mount one once at the app root. */
const withTooltipProvider: Decorator = (Story) => (
  <TooltipProvider>
    <Story />
  </TooltipProvider>
);

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    locale: {
      description: "Documentation language",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: locales.map((value) => ({ value, title: localeLabels[value] })),
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "Left to right" },
          { value: "rtl", title: "Right to left" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: defaultLocale, direction: "ltr" },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
      parentSelector: "html",
    }),
    withDirection,
    withTooltipProvider,
  ],
  parameters: {
    a11y: { test: "error" },
    docs: { page: ComponentDocsPage, container: ThemedDocsContainer },
    controls: { expanded: true, sort: "requiredFirst" },
    options: {
      storySort: {
        order: [
          "Guides",
          [
            "Introduction",
            "Getting started",
            "Theming",
            "Dark mode",
            "Right-to-left",
            "Hooks & utilities",
            "Fields & controls",
          ],
          "Foundations",
          ["Colors", "Radius", "Typography"],
          "shadcn",
          [
            "Actions",
            "Forms",
            "Overlays",
            "Navigation",
            "Data Display",
            "Feedback",
            "Layout",
            "AI & Chat",
          ],
          "components",
          "utils",
          ["Date formats", ["Guide", "Catalog"], "Display", ["Guide", "Playground"]],
          "Tools",
        ],
      },
    },
  },
};

export default preview;

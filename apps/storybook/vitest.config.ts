import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

const configDir = fileURLToPath(new URL("./.storybook", import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          // Every story is a test: render + play function + axe (a11y.test: "error" in preview).
          extends: true,
          plugins: [storybookTest({ configDir })],
          // Pre-scan every story so Vite optimizes all component dependencies before the first test.
          // Otherwise a dependency discovered mid-run triggers a re-optimize and reload, and the test
          // file being imported at that moment fails ("Failed to fetch dynamically imported module").
          optimizeDeps: { entries: ["src/stories/**/*-stories.tsx", ".storybook/preview.tsx"] },
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({ contextOptions: { reducedMotion: "reduce" } }),
              instances: [{ browser: "chromium" }],
            },
          },
        },
        {
          // Node tests: docs-kit types/validation and story/docs coverage of every component.
          extends: true,
          test: {
            name: "unit",
            environment: "node",
            include: ["src/**/*-tests.ts", ".storybook/**/*-tests.ts"],
          },
        },
      ],
    },
  }),
);

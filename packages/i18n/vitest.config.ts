import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

export default defineConfig({
  resolve: { alias },
  test: {
    passWithNoTests: true,
    projects: [
      {
        // The plugin runs in Node, and its tests drive Vite through its JavaScript API.
        extends: true,
        test: { name: "vite", environment: "node", include: ["src/vite/**/*-tests.{ts,tsx}"] },
      },
      {
        extends: true,
        test: {
          name: "runtime",
          environment: "jsdom",
          include: ["src/runtime/**/*-tests.{ts,tsx}", "src/internal/**/*-tests.{ts,tsx}"],
          setupFiles: ["./vitest-setup.ts"],
        },
      },
    ],
  },
});

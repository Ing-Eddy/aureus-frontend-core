import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Hooks render real forms, so the tests run in jsdom.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: ["src/**/*-tests.{ts,tsx}"],
    setupFiles: ["./vitest-setup.ts"],
    passWithNoTests: true,
  },
});

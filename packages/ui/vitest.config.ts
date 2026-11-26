import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Component tests render in jsdom; the setup file fills the browser APIs jsdom lacks.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: ["src/**/*-tests.{ts,tsx}"],
    setupFiles: ["./vitest-setup.ts"],
    passWithNoTests: true,
  },
});

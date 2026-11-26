import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Components default to the browser's locale, which in Node comes from the machine. Tests start in
// one known locale, so they give the same result everywhere; the test workers inherit it.
process.env.LC_ALL = "en_US.UTF-8";

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

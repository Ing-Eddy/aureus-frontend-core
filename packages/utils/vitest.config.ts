import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/**/*-tests.ts"],
    // A zone with daylight-saving changes, so local-time handling is tested against real gaps.
    env: { TZ: "America/New_York" },
    passWithNoTests: true,
  },
});

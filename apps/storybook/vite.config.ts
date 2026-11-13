import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // `@sb/*` → `.storybook/*` and `@fixtures/*` → `src/fixtures/*`, mirrored in tsconfig `paths`.
    // Explicit aliases (not tsconfig paths) so MDX files, which tsconfig does not include, resolve too.
    alias: {
      "@sb": fileURLToPath(new URL("./.storybook", import.meta.url)),
      "@fixtures": fileURLToPath(new URL("./src/fixtures", import.meta.url)),
    },
  },
});

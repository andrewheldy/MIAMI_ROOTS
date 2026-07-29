import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Component tests (`*.test.tsx`) render with the automatic JSX runtime, so no
  // `import React` boilerplate is needed and no test dependency is added.
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    // Database tests need a running Postgres and run via `npm run db:test`
    // (vitest.db.config.ts); the default unit run stays dependency-free.
    exclude: ["tests/db/**", "**/node_modules/**"],
  },
});

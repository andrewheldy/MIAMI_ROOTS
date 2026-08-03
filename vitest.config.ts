import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Server modules under test import `server-only`, which resolves to a
      // deliberately-throwing build outside an RSC graph. See the stub for why
      // replacing it here does not weaken the real boundary.
      "server-only": fileURLToPath(
        new URL("./tests/stubs/server-only.ts", import.meta.url),
      ),
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

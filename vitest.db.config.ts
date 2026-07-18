import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Database test runner (`npm run db:test`). Separate from the unit config so
 * `npm test` stays runnable with no database. Requires SUPABASE_DB_URL to
 * point at a harness database that `npm run db:reset` has prepared.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/db/**/*.test.ts"],
    // The suites share one database; serial execution keeps fixtures simple.
    fileParallelism: false,
  },
});

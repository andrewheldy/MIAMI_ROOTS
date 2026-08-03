import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * A `"use server"` module may export **async functions only**. Exporting
 * anything else — a constant, an object, a class — compiles and builds
 * cleanly, then fails at request time with:
 *
 *   A "use server" file can only export async functions, found object.
 *
 * That failure surfaces as the site's error boundary the first time a visitor
 * submits the form, which is exactly when it is most expensive. Vitest does
 * not apply Next.js's Server Actions rules, so this is a source-level guard
 * instead: it reads every `"use server"` module and asserts that each of its
 * value exports is an async function.
 */

const APP_DIR = join(process.cwd(), "src", "app");

function collectFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const serverActionFiles = collectFiles(APP_DIR).filter((file) =>
  /^\s*["']use server["']\s*;/.test(readFileSync(file, "utf8")),
);

describe('"use server" modules', () => {
  it("finds the Server Action modules to check", () => {
    // If this ever hits zero, the regex above stopped matching and every
    // assertion below would pass vacuously.
    expect(serverActionFiles.length).toBeGreaterThan(0);
  });

  it.each(serverActionFiles)("%s exports only async functions", (file) => {
    const source = readFileSync(file, "utf8");
    const valueExports = [
      ...source.matchAll(/^export\s+(?!type\b)(?!interface\b)(.+)$/gm),
    ].map((match) => (match[1] ?? "").trim());

    expect(valueExports.length).toBeGreaterThan(0);
    for (const declaration of valueExports) {
      expect(
        declaration.startsWith("async function"),
        `${file}: "export ${declaration}" is not an async function. Move non-function exports (constants, objects, types-with-values) into a plain module — see src/app/(site)/connectors/nomination-state.ts.`,
      ).toBe(true);
    }
  });
});

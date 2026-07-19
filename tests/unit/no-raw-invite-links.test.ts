import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Repository-wide guard: no raw WhatsApp invite URL may ever be committed.
 * Invite links are credentials (docs/05-operations/chat-link-management.md);
 * they live exclusively in server environment variables. This sweep fails the
 * build if an actual invite URL (host + invite token/path) appears anywhere in
 * tracked source, docs, or config. Bare hostnames are fine — the redirect
 * allowlist in src/lib/chat-redirect.ts legitimately names approved hosts.
 */

const ROOT = join(__dirname, "..", "..");

/**
 * Directories/files that can contain committed text worth sweeping. `tests/`
 * is deliberately excluded: it is an approved location for made-up,
 * example-shaped URLs that exercise validation logic (never real invites).
 */
const SWEEP_TARGETS = [
  "src",
  "docs",
  "scripts",
  "supabase",
  ".env.example",
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "next.config.ts",
];

/** Binary/asset extensions that carry no committed text. */
const SKIPPED_EXTENSIONS =
  /\.(png|jpe?g|webp|gif|ico|svg|mp4|webm|woff2?|ttf|otf)$/i;

/** An invite URL is a WhatsApp host followed by a path segment (the token). */
const INVITE_URL_PATTERN = /(chat\.whatsapp\.com|wa\.me)\/[A-Za-z0-9]/i;

function collectFiles(path: string, found: string[]): void {
  const stats = statSync(path, { throwIfNoEntry: false });
  if (!stats) return;
  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) {
      collectFiles(join(path, entry), found);
    }
    return;
  }
  if (!SKIPPED_EXTENSIONS.test(path)) {
    found.push(path);
  }
}

describe("no raw WhatsApp invite links in the repository", () => {
  it("finds no invite URL in any tracked text file", () => {
    const files: string[] = [];
    for (const target of SWEEP_TARGETS) {
      collectFiles(join(ROOT, target), files);
    }
    // Sanity: the sweep actually covered the codebase.
    expect(files.length).toBeGreaterThan(50);

    const offenders = files.filter((file) =>
      INVITE_URL_PATTERN.test(readFileSync(file, "utf8")),
    );
    expect(
      offenders.map((file) => relative(ROOT, file)),
      "raw WhatsApp invite URLs are credentials and must live only in server env vars",
    ).toEqual([]);
  });
});

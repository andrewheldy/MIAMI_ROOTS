// Build assertion (M3 acceptance criterion): no client bundle may contain the
// service-role key, a reference to its variable name, or the privileged client
// factory. Runs after `next build` against .next/static — the JS actually
// shipped to browsers. `server-only` should make such a leak impossible at
// build time; this is the belt to that suspender, and it fails loudly if the
// boundary ever regresses.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const STATIC_DIR = join(process.cwd(), ".next", "static");

// Variable NAMES and identifiers only — never secret values.
const FORBIDDEN_MARKERS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "createServiceRoleSupabaseClient",
];

function collectJsFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      collectJsFiles(full, out);
    } else if (entry.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

let files;
try {
  files = collectJsFiles(STATIC_DIR);
} catch {
  console.error(
    `check-client-bundle: ${STATIC_DIR} not found — run \`npm run build\` first.`,
  );
  process.exit(1);
}

const offenders = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const marker of FORBIDDEN_MARKERS) {
    if (source.includes(marker)) {
      offenders.push({ file: file.replace(process.cwd() + "/", ""), marker });
    }
  }
}

if (offenders.length > 0) {
  console.error(
    "check-client-bundle: service-role material found in client bundles:",
  );
  for (const { file, marker } of offenders) {
    console.error(`  ${file}: contains "${marker}"`);
  }
  process.exit(1);
}

console.log(
  `check-client-bundle: OK — ${files.length} client chunks contain no service-role material.`,
);

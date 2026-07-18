import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { readPublicSupabaseEnv, readServiceRoleKey } from "./env";

/**
 * Service-role Supabase client — configuration 3 of 3 in
 * `docs/03-architecture/application-architecture.md`, and the ONLY module
 * allowed to touch `SUPABASE_SERVICE_ROLE_KEY`.
 *
 * Guard rails:
 *  - `import "server-only"` makes any import from client-component code a
 *    build error, so this module (and the key it reads) can never enter a
 *    client bundle. CI additionally asserts no client chunk references the
 *    service key (`scripts/check-client-bundle.mjs`), and shared UI code is
 *    lint-blocked from importing this module at all.
 *  - The client is created per call and never at module load, so builds and
 *    tests that merely import server code don't require the key to exist.
 *  - No session persistence: this is a stateless privileged connection, not a
 *    user.
 *
 * Every call site must carry a comment justifying why RLS bypass is required
 * (per the application architecture). As of M3 there are none — the first
 * legitimate uses arrive with onboarding processing (M6) and server event
 * writes (M5+).
 */
export function createServiceRoleSupabaseClient(): SupabaseClient {
  const { url } = readPublicSupabaseEnv();
  const serviceRoleKey = readServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

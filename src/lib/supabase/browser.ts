import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { readPublicSupabaseEnv } from "./env";

/**
 * Anon (browser) Supabase client — configuration 1 of 3 in
 * `docs/03-architecture/application-architecture.md`.
 *
 * Public credentials only; RLS constrains everything it can touch. Most pages
 * don't need it at all (Server Components read server-side), so it is created
 * lazily on first use, never at module load — importing this module during a
 * build must not require Supabase env to be present.
 */
let client: SupabaseClient | undefined;

export function getBrowserSupabaseClient(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = readPublicSupabaseEnv();
    client = createBrowserClient(url, anonKey);
  }
  return client;
}

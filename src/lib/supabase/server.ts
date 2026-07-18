import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { readPublicSupabaseEnv } from "./env";

/**
 * User-scoped server Supabase client — configuration 2 of 3 in
 * `docs/03-architecture/application-architecture.md`.
 *
 * Bound to the current request's auth cookies, so every query runs under RLS
 * *as that user* — this is the client member/admin server rendering uses.
 * Created per request (cookies are request-scoped); never cached in a module.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const { url, anonKey } = readPublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where Next.js forbids
          // cookie writes. Safe to ignore: session refresh cookies are set
          // by middleware/route handlers, which are allowed to write.
        }
      },
    },
  });
}

/**
 * Environment validation for the Supabase configuration.
 *
 * Every Supabase client reads its configuration through these functions so a
 * misconfigured environment fails immediately with a message that names the
 * missing/invalid variable — never with a downstream fetch error, and never
 * by echoing a configured value back (keys are credentials; error messages
 * only ever contain variable NAMES).
 *
 * The variable matrix per environment is documented in
 * `docs/08-delivery/milestone-3-database-foundation.md`.
 */

export interface PublicSupabaseEnv {
  /** The Supabase project URL (safe to expose; paired with the anon key). */
  readonly url: string;
  /** The anon/publishable key (safe to expose; RLS constrains what it can do). */
  readonly anonKey: string;
}

/** Environment source, injectable for tests. */
export type EnvSource = Record<string, string | undefined>;

function fail(message: string): never {
  throw new Error(`Supabase environment invalid: ${message}`);
}

function requireNonEmpty(env: EnvSource, name: string): string {
  const value = env[name]?.trim();
  if (!value) {
    fail(
      `${name} is not set. Add it to your environment (see .env.example for the variable list; values live in Vercel/Supabase settings, never in Git).`,
    );
  }
  return value;
}

/**
 * Read and validate the public (client-safe) Supabase configuration.
 * Used by the browser client and the user-scoped server client.
 */
export function readPublicSupabaseEnv(
  env: EnvSource = process.env,
): PublicSupabaseEnv {
  const url = requireNonEmpty(env, "NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireNonEmpty(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  }
  const isLocalhost =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLocalhost)) {
    fail(
      "NEXT_PUBLIC_SUPABASE_URL must use https:// (plain http is allowed only for localhost development).",
    );
  }

  return { url: parsed.origin, anonKey };
}

/**
 * Read and validate the service-role key. Server-only by construction: the
 * sole importer is `src/lib/supabase/service.ts`, which is guarded by
 * `server-only`. The un-prefixed name means Next.js never inlines it into
 * client bundles.
 */
export function readServiceRoleKey(env: EnvSource = process.env): string {
  const serviceKey = requireNonEmpty(env, "SUPABASE_SERVICE_ROLE_KEY");

  // A service key equal to the anon key means someone pasted the wrong value —
  // treat it as unsafe rather than silently running "privileged" code without
  // privileges (or worse, having published the real service key as public).
  const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]?.trim();
  if (anonKey && serviceKey === anonKey) {
    fail(
      "SUPABASE_SERVICE_ROLE_KEY equals NEXT_PUBLIC_SUPABASE_ANON_KEY — one of them is the wrong value. Re-copy both from the Supabase dashboard.",
    );
  }
  if (env["NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"]) {
    fail(
      "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set. The service-role key must NEVER carry the NEXT_PUBLIC_ prefix — that would ship it to every browser. Remove that variable and rotate the key.",
    );
  }

  return serviceKey;
}

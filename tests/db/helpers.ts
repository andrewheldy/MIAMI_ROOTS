import { randomUUID } from "node:crypto";

import { Client } from "pg";

/**
 * Harness helpers for database security tests.
 *
 * Tests connect as the superuser and then impersonate the Supabase runtime
 * roles per statement block: `SET LOCAL ROLE anon|authenticated|service_role`
 * plus the `request.jwt.claims` GUC that `auth.uid()` reads — the same
 * mechanism PostgREST uses in production. Every impersonated block runs in a
 * transaction that is always rolled back, so assertions never leak state;
 * fixtures are inserted explicitly (and cleaned up) as the superuser.
 */

export function databaseUrl(): string {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error(
      "SUPABASE_DB_URL is not set. Run `npm run db:start` (or start Postgres) and `npm run db:reset` first — see supabase/README.md.",
    );
  }
  return url;
}

export async function withSuperuser<T>(
  fn: (client: Client) => Promise<T>,
): Promise<T> {
  const client = new Client({ connectionString: databaseUrl() });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

export type HarnessRole = "anon" | "authenticated" | "service_role";

export interface RunAsOptions {
  role: HarnessRole;
  /** Supabase auth user id to impersonate (sets the JWT `sub` claim). */
  authUserId?: string;
}

/**
 * Run `fn` impersonating a Supabase runtime role inside a rolled-back
 * transaction. Returns fn's result; rethrows database errors (tests assert on
 * the error code — 42501 is "insufficient privilege").
 */
export async function runAs<T>(
  { role, authUserId }: RunAsOptions,
  fn: (client: Client) => Promise<T>,
): Promise<T> {
  return withSuperuser(async (client) => {
    await client.query("begin");
    try {
      const claims = authUserId
        ? JSON.stringify({ sub: authUserId, role })
        : "";
      await client.query("select set_config('request.jwt.claims', $1, true)", [
        claims,
      ]);
      // Role names come from a closed union type, not user input.
      await client.query(`set local role ${role}`);
      return await fn(client);
    } finally {
      await client.query("rollback").catch(() => {
        // A failed statement may have aborted the transaction already.
      });
    }
  });
}

/** Postgres error code for "permission denied". */
export const PERMISSION_DENIED = "42501";
/** Postgres error code for RLS `WITH CHECK`/policy violation on write. */
export const RLS_VIOLATION = "42501";
/** Postgres error code for unique violations. */
export const UNIQUE_VIOLATION = "23505";
/** Postgres error code for foreign-key violations. */
export const FOREIGN_KEY_VIOLATION = "23503";
/** Postgres error code for CHECK-constraint violations. */
export const CHECK_VIOLATION = "23514";

export interface PgError extends Error {
  code?: string;
}

/** Await an operation and return its Postgres error code (fails if it succeeds). */
export async function errorCodeOf(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error) {
    return (error as PgError).code ?? "unknown";
  }
  throw new Error("expected the operation to fail, but it succeeded");
}

export interface MemberFixture {
  memberId: string;
  authUserId: string;
  phone: string;
}

let phoneCounter = 1000;

/**
 * Insert an auth user + linked member as the superuser. Callers clean up via
 * `deleteMemberFixture` (tests only ever add fixtures they remove).
 */
export async function createMemberFixture(
  client: Client,
  overrides: { role?: "member" | "admin" | "owner"; status?: string } = {},
): Promise<MemberFixture> {
  const authUserId = randomUUID();
  const phone = `+1305555${phoneCounter++}`;
  await client.query("insert into auth.users (id, email) values ($1, $2)", [
    authUserId,
    `${authUserId}@example.test`,
  ]);
  const result = await client.query(
    `insert into public.members (first_name, phone_e164, auth_user_id, role, status)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [
      overrides.role === "admin"
        ? "Admin"
        : overrides.role === "owner"
          ? "Owner"
          : "Member",
      phone,
      authUserId,
      overrides.role ?? "member",
      overrides.status ?? "active",
    ],
  );
  return { memberId: result.rows[0].id, authUserId, phone };
}

export async function deleteMemberFixture(
  client: Client,
  fixture: MemberFixture,
): Promise<void> {
  await client.query("delete from public.consent_events where member_id = $1", [
    fixture.memberId,
  ]);
  await client.query("delete from public.members where id = $1", [
    fixture.memberId,
  ]);
  await client.query("delete from auth.users where id = $1", [
    fixture.authUserId,
  ]);
}

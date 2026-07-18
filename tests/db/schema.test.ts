import { describe, expect, it } from "vitest";

import { withSuperuser } from "./helpers";

/**
 * Structural assertions for the M3 spine: the migrations that just replayed
 * from zero (`npm run db:reset`) produced exactly the documented shape with
 * security enabled everywhere.
 */

const SPINE_TABLES = [
  "members",
  "community_groups",
  "onboarding_submissions",
  "consent_events",
  "audit_log",
  "events",
] as const;

/** Tables that must expose no client-role policies at all (fail closed). */
const NO_CLIENT_POLICY_TABLES = ["onboarding_submissions", "events"] as const;

/** Mechanically append-only tables (no UPDATE/DELETE for any app role). */
const APPEND_ONLY_TABLES = ["consent_events", "audit_log"] as const;

describe("M3 schema", () => {
  it("creates exactly the six spine tables in public", async () => {
    const rows = await withSuperuser(async (c) =>
      (
        await c.query(
          `select tablename from pg_tables where schemaname = 'public' order by tablename`,
        )
      ).rows.map((r) => r.tablename),
    );
    expect(rows).toEqual([...SPINE_TABLES].sort());
  });

  it("has row level security enabled on every application table", async () => {
    const disabled = await withSuperuser(async (c) =>
      (
        await c.query(
          `select relname
           from pg_class cls
           join pg_namespace ns on ns.oid = cls.relnamespace
           where ns.nspname = 'public' and cls.relkind = 'r'
             and not cls.relrowsecurity`,
        )
      ).rows.map((r) => r.relname),
    );
    expect(disabled).toEqual([]);
  });

  it("defines zero client policies on server-only tables", async () => {
    for (const table of NO_CLIENT_POLICY_TABLES) {
      const policies = await withSuperuser(async (c) =>
        (
          await c.query(
            `select polname from pg_policy p
             join pg_class cls on cls.oid = p.polrelid
             where cls.relname = $1`,
            [table],
          )
        ).rows.map((r) => r.polname),
      );
      expect(policies, `${table} must have no policies`).toEqual([]);
    }
  });

  it("revokes UPDATE/DELETE from every app role on append-only tables", async () => {
    for (const table of APPEND_ONLY_TABLES) {
      for (const role of ["anon", "authenticated", "service_role"]) {
        const privileges = await withSuperuser(async (c) =>
          (
            await c.query(
              `select privilege_type
               from information_schema.role_table_grants
               where table_schema = 'public' and table_name = $1 and grantee = $2`,
              [table, role],
            )
          ).rows.map((r) => r.privilege_type),
        );
        expect(
          privileges.filter(
            (p) => p === "UPDATE" || p === "DELETE" || p === "TRUNCATE",
          ),
          `${role} on ${table}`,
        ).toEqual([]);
      }
    }
  });

  it("enforces the documented unique constraints", async () => {
    const uniques = await withSuperuser(async (c) =>
      (
        await c.query(
          `select cls.relname as table, idx.relname as index
           from pg_index i
           join pg_class idx on idx.oid = i.indexrelid
           join pg_class cls on cls.oid = i.indrelid
           join pg_namespace ns on ns.oid = cls.relnamespace
           where ns.nspname = 'public' and i.indisunique
           order by 1, 2`,
        )
      ).rows.map((r) => `${r.table}.${r.index}`),
    );
    for (const expected of [
      "members.members_phone_e164_key",
      "members.members_auth_user_id_key",
      "members.members_email_key",
      "community_groups.community_groups_slug_key",
      "events.events_dedup_key_key",
    ]) {
      expect(uniques).toContain(expected);
    }
  });

  it("maintains updated_at via trigger on mutable tables", async () => {
    await withSuperuser(async (c) => {
      await c.query("begin");
      try {
        const inserted = await c.query(
          `insert into public.community_groups
             (slug, name, short_description, full_description)
           values ('trigger-check', 'Trigger Check', 'short', 'full')
           returning updated_at`,
        );
        // Force a clock difference; now() is transaction-stable, so use a
        // clock_timestamp-based update check instead.
        await c.query(
          `update public.community_groups
             set name = 'Trigger Check 2',
                 updated_at = '2000-01-01T00:00:00Z' -- trigger must overwrite this
           where slug = 'trigger-check'`,
        );
        const after = await c.query(
          `select updated_at from public.community_groups where slug = 'trigger-check'`,
        );
        expect(after.rows[0].updated_at.getTime()).toBeGreaterThanOrEqual(
          inserted.rows[0].updated_at.getTime(),
        );
        expect(after.rows[0].updated_at.getFullYear()).not.toBe(2000);
      } finally {
        await c.query("rollback");
      }
    });
  });

  it("exposes the identity helper functions", async () => {
    const functions = await withSuperuser(async (c) =>
      (
        await c.query(
          `select proname from pg_proc p
           join pg_namespace ns on ns.oid = p.pronamespace
           where ns.nspname = 'public'
             and proname in ('is_admin', 'is_owner', 'current_member_id', 'set_updated_at')
           order by proname`,
        )
      ).rows.map((r) => r.proname),
    );
    expect(functions).toEqual([
      "current_member_id",
      "is_admin",
      "is_owner",
      "set_updated_at",
    ]);
  });
});

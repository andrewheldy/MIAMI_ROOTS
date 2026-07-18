import { describe, expect, it } from "vitest";

import {
  CHECK_VIOLATION,
  FOREIGN_KEY_VIOLATION,
  UNIQUE_VIOLATION,
  errorCodeOf,
  withSuperuser,
} from "./helpers";

/**
 * Database-enforced integrity (docs/03-architecture/data-model.md): the
 * constraints must fail *in the database*, not rely on application-level
 * assumptions. Each test runs in a rolled-back transaction as the superuser —
 * privilege is irrelevant here; the constraint itself must object.
 */

async function failingInsert(sql: string, params: unknown[] = []) {
  return errorCodeOf(
    withSuperuser(async (c) => {
      await c.query("begin");
      try {
        await c.query(sql, params);
      } finally {
        await c.query("rollback").catch(() => {});
      }
    }),
  );
}

describe("members constraints", () => {
  it("rejects duplicate phone numbers", async () => {
    const code = await errorCodeOf(
      withSuperuser(async (c) => {
        await c.query("begin");
        try {
          await c.query(
            `insert into public.members (first_name, phone_e164)
             values ('A', '+13055551111'), ('B', '+13055551111')`,
          );
        } finally {
          await c.query("rollback").catch(() => {});
        }
      }),
    );
    expect(code).toBe(UNIQUE_VIOLATION);
  });

  it("rejects duplicate emails case-insensitively", async () => {
    const code = await errorCodeOf(
      withSuperuser(async (c) => {
        await c.query("begin");
        try {
          await c.query(
            `insert into public.members (first_name, phone_e164, email)
             values ('A', '+13055551112', 'Same@Example.test'),
                    ('B', '+13055551113', 'same@example.test')`,
          );
        } finally {
          await c.query("rollback").catch(() => {});
        }
      }),
    );
    expect(code).toBe(UNIQUE_VIOLATION);
  });

  it("rejects malformed phone numbers and unknown roles/statuses", async () => {
    expect(
      await failingInsert(
        `insert into public.members (first_name, phone_e164) values ('A', '3055551111')`,
      ),
    ).toBe(CHECK_VIOLATION);
    expect(
      await failingInsert(
        `insert into public.members (first_name, phone_e164, role) values ('A', '+13055551114', 'superuser')`,
      ),
    ).toBe(CHECK_VIOLATION);
    expect(
      await failingInsert(
        `insert into public.members (first_name, phone_e164, status) values ('A', '+13055551115', 'banned')`,
      ),
    ).toBe(CHECK_VIOLATION);
  });
});

describe("community_groups constraints", () => {
  it("rejects duplicate and malformed slugs", async () => {
    const code = await errorCodeOf(
      withSuperuser(async (c) => {
        await c.query("begin");
        try {
          await c.query(
            `insert into public.community_groups (slug, name, short_description, full_description)
             values ('dup-slug', 'A', 's', 'f'), ('dup-slug', 'B', 's', 'f')`,
          );
        } finally {
          await c.query("rollback").catch(() => {});
        }
      }),
    );
    expect(code).toBe(UNIQUE_VIOLATION);
    expect(
      await failingInsert(
        `insert into public.community_groups (slug, name, short_description, full_description)
         values ('Bad Slug!', 'A', 's', 'f')`,
      ),
    ).toBe(CHECK_VIOLATION);
  });
});

describe("cross-table integrity", () => {
  it("rejects submissions pointing at a nonexistent member", async () => {
    expect(
      await failingInsert(
        `insert into public.onboarding_submissions
           (member_id, first_name, phone_e164, guidelines_version_accepted)
         values (gen_random_uuid(), 'A', '+13055551116', 'v1')`,
      ),
    ).toBe(FOREIGN_KEY_VIOLATION);
  });

  it("rejects consent events with no subject at all", async () => {
    expect(
      await failingInsert(
        `insert into public.consent_events (consent_type, granted, recorded_via)
         values ('guidelines', true, 'admin')`,
      ),
    ).toBe(CHECK_VIOLATION);
  });

  it("rejects human audit entries with no actor", async () => {
    expect(
      await failingInsert(
        `insert into public.audit_log (actor_type, action, entity_type)
         values ('admin', 'x', 'member')`,
      ),
    ).toBe(CHECK_VIOLATION);
  });

  it("enforces event dedup keys as an idempotency seam", async () => {
    const code = await errorCodeOf(
      withSuperuser(async (c) => {
        await c.query("begin");
        try {
          await c.query(
            `insert into public.events (event_name, actor_kind, dedup_key)
             values ('onboarding_submitted', 'anon', 'once'),
                    ('onboarding_submitted', 'anon', 'once')`,
          );
        } finally {
          await c.query("rollback").catch(() => {});
        }
      }),
    );
    expect(code).toBe(UNIQUE_VIOLATION);
  });

  it("blocks hard-deleting a member with consent history (anonymize instead)", async () => {
    const code = await errorCodeOf(
      withSuperuser(async (c) => {
        await c.query("begin");
        try {
          const inserted = await c.query(
            `insert into public.members (first_name, phone_e164)
             values ('ToDelete', '+13055551117') returning id`,
          );
          await c.query(
            `insert into public.consent_events (member_id, consent_type, granted, recorded_via)
             values ($1, 'guidelines', true, 'admin')`,
            [inserted.rows[0].id],
          );
          await c.query(`delete from public.members where id = $1`, [
            inserted.rows[0].id,
          ]);
        } finally {
          await c.query("rollback").catch(() => {});
        }
      }),
    );
    expect(code).toBe(FOREIGN_KEY_VIOLATION);
  });
});

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  PERMISSION_DENIED,
  createMemberFixture,
  deleteMemberFixture,
  errorCodeOf,
  runAs,
  withSuperuser,
  type MemberFixture,
} from "./helpers";

/**
 * The RLS matrix (docs/03-architecture/identity-and-authorization.md), proven
 * by behavior: anon, an authenticated member, an authenticated admin, and the
 * service role each attempt reads/writes and get exactly what the matrix
 * grants — nothing more.
 */

let member: MemberFixture;
let otherMember: MemberFixture;
let admin: MemberFixture;
let publicGroupId: string;
let hiddenGroupId: string;

beforeAll(async () => {
  await withSuperuser(async (c) => {
    member = await createMemberFixture(c, { role: "member" });
    otherMember = await createMemberFixture(c, { role: "member" });
    admin = await createMemberFixture(c, { role: "admin" });
    const groups = await c.query(
      `insert into public.community_groups
         (slug, name, short_description, full_description, status, visibility)
       values
         ('rls-public-group', 'Public Group', 's', 'f', 'active', 'public'),
         ('rls-hidden-group', 'Hidden Group', 's', 'f', 'hidden', 'public')
       returning id`,
    );
    publicGroupId = groups.rows[0].id;
    hiddenGroupId = groups.rows[1].id;
    await c.query(
      `insert into public.consent_events (member_id, consent_type, granted, recorded_via)
       values ($1, 'guidelines', true, 'admin'), ($2, 'guidelines', true, 'admin')`,
      [member.memberId, otherMember.memberId],
    );
    await c.query(
      `insert into public.audit_log (actor_type, actor_id, action, entity_type, entity_id)
       values ('admin', $1, 'test_action', 'member', $2)`,
      [admin.memberId, member.memberId],
    );
  });
});

afterAll(async () => {
  await withSuperuser(async (c) => {
    await c.query(`delete from public.audit_log where action = 'test_action'`);
    await c.query(
      `delete from public.community_groups where slug like 'rls-%'`,
    );
    for (const fixture of [member, otherMember, admin]) {
      await deleteMemberFixture(c, fixture);
    }
  });
});

describe("anonymous (anon)", () => {
  it("cannot read members, submissions, consent, audit, or events at all", async () => {
    for (const table of [
      "members",
      "onboarding_submissions",
      "consent_events",
      "audit_log",
      "events",
    ]) {
      const code = await errorCodeOf(
        runAs({ role: "anon" }, (c) =>
          c.query(`select * from public.${table}`),
        ),
      );
      expect(code, table).toBe(PERMISSION_DENIED);
    }
  });

  it("reads only active+public community groups", async () => {
    const rows = await runAs({ role: "anon" }, async (c) =>
      (
        await c.query(
          `select slug from public.community_groups where slug like 'rls-%'`,
        )
      ).rows.map((r) => r.slug),
    );
    expect(rows).toEqual(["rls-public-group"]);
  });

  it("cannot write community groups or submissions", async () => {
    expect(
      await errorCodeOf(
        runAs({ role: "anon" }, (c) =>
          c.query(
            `insert into public.community_groups (slug, name, short_description, full_description)
             values ('rls-anon-insert', 'X', 's', 'f')`,
          ),
        ),
      ),
    ).toBe(PERMISSION_DENIED);
    expect(
      await errorCodeOf(
        runAs({ role: "anon" }, (c) =>
          c.query(
            `insert into public.onboarding_submissions (first_name, phone_e164, guidelines_version_accepted)
             values ('X', '+13055550000', 'v1')`,
          ),
        ),
      ),
    ).toBe(PERMISSION_DENIED);
  });
});

describe("authenticated member", () => {
  it("reads own member row and only own row", async () => {
    const rows = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (await c.query(`select id, first_name, phone_e164 from public.members`))
          .rows,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(member.memberId);
  });

  it("cannot read the admin-only notes_admin column even on their own row", async () => {
    const code = await errorCodeOf(
      runAs({ role: "authenticated", authUserId: member.authUserId }, (c) =>
        c.query(`select notes_admin from public.members`),
      ),
    );
    expect(code).toBe(PERMISSION_DENIED);
  });

  it("updates own profile fields", async () => {
    const updated = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (
          await c.query(
            `update public.members set instagram_handle = 'mia.roots'
             where id = $1 returning instagram_handle`,
            [member.memberId],
          )
        ).rows,
    );
    expect(updated).toHaveLength(1);
    expect(updated[0].instagram_handle).toBe("mia.roots");
  });

  it("cannot update role, status, or another member's row", async () => {
    // Privileged columns are not in the UPDATE column grant.
    expect(
      await errorCodeOf(
        runAs({ role: "authenticated", authUserId: member.authUserId }, (c) =>
          c.query(`update public.members set role = 'owner' where id = $1`, [
            member.memberId,
          ]),
        ),
      ),
    ).toBe(PERMISSION_DENIED);
    // Another member's row is invisible to the policy: zero rows updated.
    const updated = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (
          await c.query(
            `update public.members set first_name = 'Hijacked'
             where id = $1 returning id`,
            [otherMember.memberId],
          )
        ).rows,
    );
    expect(updated).toHaveLength(0);
  });

  it("reads own consent events and nobody else's", async () => {
    const rows = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (await c.query(`select member_id from public.consent_events`)).rows,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].member_id).toBe(member.memberId);
  });

  it("cannot write consent events (server-side writes only)", async () => {
    const code = await errorCodeOf(
      runAs({ role: "authenticated", authUserId: member.authUserId }, (c) =>
        c.query(
          `insert into public.consent_events (member_id, consent_type, granted, recorded_via)
           values ($1, 'marketing', true, 'member_area')`,
          [member.memberId],
        ),
      ),
    );
    expect(code).toBe(PERMISSION_DENIED);
  });

  it("sees no audit log rows (admin-only policy)", async () => {
    const rows = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) => (await c.query(`select id from public.audit_log`)).rows,
    );
    expect(rows).toHaveLength(0);
  });

  it("cannot read raw events or submissions", async () => {
    for (const table of ["events", "onboarding_submissions"]) {
      const code = await errorCodeOf(
        runAs({ role: "authenticated", authUserId: member.authUserId }, (c) =>
          c.query(`select * from public.${table}`),
        ),
      );
      expect(code, table).toBe(PERMISSION_DENIED);
    }
  });

  it("sees hidden groups no more than anon does", async () => {
    const rows = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (
          await c.query(
            `select slug from public.community_groups where slug like 'rls-%'`,
          )
        ).rows.map((r) => r.slug),
    );
    expect(rows).toEqual(["rls-public-group"]);
  });

  it("cannot create or edit groups (owner-only writes)", async () => {
    // The INSERT policy raises; the UPDATE policy filters the row away, so
    // the write silently affects zero rows — either way, nothing changes.
    const insertCode = await errorCodeOf(
      runAs({ role: "authenticated", authUserId: member.authUserId }, (c) =>
        c.query(
          `insert into public.community_groups (slug, name, short_description, full_description)
           values ('rls-member-insert', 'X', 's', 'f')`,
        ),
      ),
    );
    expect(insertCode).toBe(PERMISSION_DENIED);
    const updated = await runAs(
      { role: "authenticated", authUserId: member.authUserId },
      async (c) =>
        (
          await c.query(
            `update public.community_groups set name = 'Renamed'
             where id = $1 returning id`,
            [publicGroupId],
          )
        ).rows,
    );
    expect(updated).toHaveLength(0);
  });
});

describe("authenticated admin", () => {
  it("reads every member row", async () => {
    const rows = await runAs(
      { role: "authenticated", authUserId: admin.authUserId },
      async (c) => (await c.query(`select id from public.members`)).rows,
    );
    const ids = rows.map((r) => r.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        member.memberId,
        otherMember.memberId,
        admin.memberId,
      ]),
    );
  });

  it("reads hidden groups and the audit log", async () => {
    const groups = await runAs(
      { role: "authenticated", authUserId: admin.authUserId },
      async (c) =>
        (
          await c.query(
            `select slug from public.community_groups where slug like 'rls-%' order by slug`,
          )
        ).rows.map((r) => r.slug),
    );
    expect(groups).toEqual(["rls-hidden-group", "rls-public-group"]);

    const audit = await runAs(
      { role: "authenticated", authUserId: admin.authUserId },
      async (c) =>
        (
          await c.query(
            `select action from public.audit_log where action = 'test_action'`,
          )
        ).rows,
    );
    expect(audit).toHaveLength(1);
  });

  it("is not the owner: group writes affect zero rows", async () => {
    const updated = await runAs(
      { role: "authenticated", authUserId: admin.authUserId },
      async (c) =>
        (
          await c.query(
            `update public.community_groups set name = 'Admin Rename'
             where id = $1 returning id`,
            [hiddenGroupId],
          )
        ).rows,
    );
    expect(updated).toHaveLength(0);
  });
});

describe("authenticated owner", () => {
  it("can write group content (the one intended client-side write path)", async () => {
    await withSuperuser(async (c) => {
      const owner = await createMemberFixture(c, { role: "owner" });
      try {
        const updated = await runAs(
          { role: "authenticated", authUserId: owner.authUserId },
          async (inner) =>
            (
              await inner.query(
                `update public.community_groups set name = 'Owner Rename'
                 where id = $1 returning name`,
                [publicGroupId],
              )
            ).rows,
        );
        expect(updated).toEqual([{ name: "Owner Rename" }]);
      } finally {
        await deleteMemberFixture(c, owner);
      }
    });
  });
});

describe("service role (privileged server paths only)", () => {
  it("performs the server-side writes the app needs", async () => {
    await runAs({ role: "service_role" }, async (c) => {
      const submission = await c.query(
        `insert into public.onboarding_submissions (first_name, phone_e164, guidelines_version_accepted)
         values ('Service', '+13055559999', 'v1') returning id, status`,
      );
      expect(submission.rows[0].status).toBe("received");
      const event = await c.query(
        `insert into public.events (event_name, actor_kind) values ('onboarding_submitted', 'anon') returning id`,
      );
      expect(event.rows[0].id).toBeTruthy();
      const audit = await c.query(
        `insert into public.audit_log (actor_type, action, entity_type)
         values ('system', 'purge_check', 'onboarding_submission') returning id`,
      );
      expect(audit.rows[0].id).toBeTruthy();
    });
  });

  it("cannot rewrite history: append-only tables reject even service-role UPDATE/DELETE", async () => {
    expect(
      await errorCodeOf(
        runAs({ role: "service_role" }, (c) =>
          c.query(`update public.audit_log set reason = 'rewritten'`),
        ),
      ),
    ).toBe(PERMISSION_DENIED);
    expect(
      await errorCodeOf(
        runAs({ role: "service_role" }, (c) =>
          c.query(`delete from public.consent_events`),
        ),
      ),
    ).toBe(PERMISSION_DENIED);
  });
});

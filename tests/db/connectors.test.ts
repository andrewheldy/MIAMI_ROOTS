import { describe, expect, it } from "vitest";

import {
  CHECK_VIOLATION,
  PERMISSION_DENIED,
  UNIQUE_VIOLATION,
  errorCodeOf,
  runAs,
  withSuperuser,
} from "./helpers";

/**
 * Database security and integrity for the Founding Connectors program.
 *
 * Two properties matter most here and are proven by behavior rather than by
 * reading the migration:
 *
 *  1. **Nothing a browser can reach may touch either table.** `connectors`
 *     carries admin notes; `connector_nominations` carries a real person's
 *     contact details. Both are server-only, so anon and authenticated must
 *     fail closed on every verb.
 *  2. **A destination can never be an absolute URL.** That constraint is what
 *     keeps `/r/<code>` from becoming an open redirect once the registry lives
 *     in the database rather than in application content.
 */

async function insertConnector(
  overrides: Record<string, unknown> = {},
): Promise<string> {
  const row = {
    code: `t-${Math.random().toString(36).slice(2, 10)}`,
    display_name: "Test Connector",
    category: "wellness",
    ...overrides,
  };
  const columns = Object.keys(row);
  const values = Object.values(row);
  return withSuperuser(async (c) => {
    const result = await c.query(
      `insert into public.connectors (${columns.join(", ")})
       values (${columns.map((_, i) => `$${i + 1}`).join(", ")})
       returning id`,
      values,
    );
    return result.rows[0].id as string;
  });
}

async function deleteConnector(id: string): Promise<void> {
  await withSuperuser(async (c) => {
    await c.query("delete from public.events where connector_id = $1", [id]);
    await c.query("delete from public.connectors where id = $1", [id]);
  });
}

describe("connectors table", () => {
  it("is unreachable from every client role", async () => {
    for (const role of ["anon", "authenticated"] as const) {
      const selectCode = await runAs({ role }, (c) =>
        errorCodeOf(c.query("select * from public.connectors")),
      );
      expect(selectCode, `${role} select`).toBe(PERMISSION_DENIED);

      const insertCode = await runAs({ role }, (c) =>
        errorCodeOf(
          c.query(
            `insert into public.connectors (code, display_name, category)
             values ('sneaky', 'Sneaky', 'events')`,
          ),
        ),
      );
      expect(insertCode, `${role} insert`).toBe(PERMISSION_DENIED);

      const updateCode = await runAs({ role }, (c) =>
        errorCodeOf(
          c.query("update public.connectors set destination_ref = '/join'"),
        ),
      );
      expect(updateCode, `${role} update`).toBe(PERMISSION_DENIED);

      const deleteCode = await runAs({ role }, (c) =>
        errorCodeOf(c.query("delete from public.connectors")),
      );
      expect(deleteCode, `${role} delete`).toBe(PERMISSION_DENIED);
    }
  });

  it("lets the service role manage cards, which is how the server resolves them", async () => {
    const id = await insertConnector({ code: "svc-role-card" });
    try {
      const rows = await runAs(
        { role: "service_role" },
        async (c) =>
          (
            await c.query(
              "select code, status from public.connectors where id = $1",
              [id],
            )
          ).rows,
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe("active");
    } finally {
      await deleteConnector(id);
    }
  });

  it("refuses an absolute or protocol-relative destination", async () => {
    for (const destination of [
      "https://evil.example",
      "http://evil.example",
      "//evil.example",
      "javascript:alert(1)",
      "HTTPS://EVIL.EXAMPLE",
    ]) {
      const code = await errorCodeOf(
        insertConnector({ destination_ref: destination }),
      );
      expect(code, destination).toBe(CHECK_VIOLATION);
    }
  });

  it("accepts the internal destination forms the application allowlists", async () => {
    const ids: string[] = [];
    try {
      for (const [kind, ref] of [
        ["page", "/join"],
        ["group", "general-chat"],
        ["chat", "general-chat"],
      ] as const) {
        ids.push(
          await insertConnector({
            destination_kind: kind,
            destination_ref: ref,
          }),
        );
      }
      expect(ids).toHaveLength(3);
    } finally {
      for (const id of ids) {
        await deleteConnector(id);
      }
    }
  });

  it("rejects malformed and over-long codes", async () => {
    for (const code of ["Maya", "dj marcus", "-maya", "a", "x".repeat(31)]) {
      expect(await errorCodeOf(insertConnector({ code })), code).toBe(
        CHECK_VIOLATION,
      );
    }
  });

  it("never lets one code belong to two cards", async () => {
    const id = await insertConnector({ code: "duplicate-card" });
    try {
      expect(
        await errorCodeOf(insertConnector({ code: "duplicate-card" })),
      ).toBe(UNIQUE_VIOLATION);
    } finally {
      await deleteConnector(id);
    }
  });

  it("rejects statuses and categories outside the documented sets", async () => {
    expect(await errorCodeOf(insertConnector({ status: "deleted" }))).toBe(
      CHECK_VIOLATION,
    );
    expect(await errorCodeOf(insertConnector({ category: "influencer" }))).toBe(
      CHECK_VIOLATION,
    );
  });

  it("defaults to no public recognition — naming someone is opt-in", async () => {
    const id = await insertConnector();
    try {
      const consent = await withSuperuser(
        async (c) =>
          (
            await c.query(
              "select public_recognition_consent from public.connectors where id = $1",
              [id],
            )
          ).rows[0].public_recognition_consent,
      );
      expect(consent).toBe(false);
    } finally {
      await deleteConnector(id);
    }
  });

  it("stamps updated_at on change", async () => {
    const id = await insertConnector();
    try {
      await withSuperuser(async (c) => {
        await c.query(
          `update public.connectors
             set status = 'paused', updated_at = '2000-01-01T00:00:00Z'
           where id = $1`,
          [id],
        );
        const after = await c.query(
          "select updated_at from public.connectors where id = $1",
          [id],
        );
        expect(after.rows[0].updated_at.getFullYear()).not.toBe(2000);
      });
    } finally {
      await deleteConnector(id);
    }
  });
});

describe("events.connector_id", () => {
  it("links a scan event to its card and survives the card being removed", async () => {
    const id = await insertConnector({ code: "scan-link-card" });
    try {
      await withSuperuser(async (c) => {
        await c.query(
          `insert into public.events (event_name, actor_kind, connector_id, properties)
           values ('connector_link_visited', 'anon', $1, '{"source":"nfc"}'::jsonb)`,
          [id],
        );
      });
      // Deleting the card nulls the link rather than destroying history.
      await withSuperuser(async (c) => {
        await c.query("delete from public.connectors where id = $1", [id]);
        const rows = await c.query(
          `select connector_id from public.events
           where event_name = 'connector_link_visited'`,
        );
        expect(rows.rows.every((r) => r.connector_id === null)).toBe(true);
        await c.query(
          "delete from public.events where event_name = 'connector_link_visited'",
        );
      });
    } finally {
      await withSuperuser(async (c) => {
        await c.query(
          "delete from public.events where event_name = 'connector_link_visited'",
        );
        await c.query("delete from public.connectors where id = $1", [id]);
      });
    }
  });
});

describe("connector_nominations table", () => {
  const validNomination = {
    kind: "self",
    nominee_name: "Test Person",
    contact_method: "instagram",
    contact_value: "@testperson",
    neighborhood: "Wynwood",
    community_role: "Runs a thing",
    why: "Because they introduce everyone to everyone.",
    consent_to_contact: true,
  };

  async function insertNomination(
    overrides: Record<string, unknown> = {},
  ): Promise<string> {
    const row = { ...validNomination, ...overrides };
    const columns = Object.keys(row);
    const values = Object.values(row);
    return withSuperuser(async (c) => {
      const result = await c.query(
        `insert into public.connector_nominations (${columns.join(", ")})
         values (${columns.map((_, i) => `$${i + 1}`).join(", ")})
         returning id`,
        values,
      );
      return result.rows[0].id as string;
    });
  }

  async function deleteNomination(id: string): Promise<void> {
    await withSuperuser(async (c) => {
      await c.query("delete from public.connector_nominations where id = $1", [
        id,
      ]);
    });
  }

  it("is unreachable from every client role — it holds contact details", async () => {
    for (const role of ["anon", "authenticated"] as const) {
      expect(
        await runAs({ role }, (c) =>
          errorCodeOf(c.query("select * from public.connector_nominations")),
        ),
        `${role} select`,
      ).toBe(PERMISSION_DENIED);

      expect(
        await runAs({ role }, (c) =>
          errorCodeOf(
            c.query(
              `insert into public.connector_nominations
                 (kind, nominee_name, contact_method, contact_value,
                  neighborhood, community_role, why, consent_to_contact)
               values ('self', 'X', 'email', 'x@example.com', 'X', 'X', 'X', true)`,
            ),
          ),
        ),
        `${role} insert`,
      ).toBe(PERMISSION_DENIED);
    }
  });

  it("stores a valid submission via the service role", async () => {
    const id = await insertNomination();
    try {
      const row = await withSuperuser(
        async (c) =>
          (
            await c.query(
              "select status, nominator_name from public.connector_nominations where id = $1",
              [id],
            )
          ).rows[0],
      );
      expect(row.status).toBe("received");
      expect(row.nominator_name).toBeNull();
    } finally {
      await deleteNomination(id);
    }
  });

  it("cannot store a submission without consent to be contacted", async () => {
    expect(
      await errorCodeOf(insertNomination({ consent_to_contact: false })),
    ).toBe(CHECK_VIOLATION);
  });

  it("requires a nominator when the nomination is about someone else", async () => {
    expect(await errorCodeOf(insertNomination({ kind: "other" }))).toBe(
      CHECK_VIOLATION,
    );
    expect(
      await errorCodeOf(
        insertNomination({ kind: "other", nominator_name: "   " }),
      ),
    ).toBe(CHECK_VIOLATION);

    const id = await insertNomination({
      kind: "other",
      nominator_name: "The Nominator",
    });
    await deleteNomination(id);
  });

  it("rejects blank required answers and unknown enum values", async () => {
    expect(await errorCodeOf(insertNomination({ why: "   " }))).toBe(
      CHECK_VIOLATION,
    );
    expect(await errorCodeOf(insertNomination({ kind: "referral" }))).toBe(
      CHECK_VIOLATION,
    );
    expect(
      await errorCodeOf(insertNomination({ contact_method: "telepathy" })),
    ).toBe(CHECK_VIOLATION);
    expect(await errorCodeOf(insertNomination({ status: "hired" }))).toBe(
      CHECK_VIOLATION,
    );
  });
});

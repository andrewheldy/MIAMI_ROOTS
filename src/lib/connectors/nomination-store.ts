import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

import type { Nomination } from "./nomination";

/**
 * The write path for Founding Connector nominations.
 *
 * Honesty rule for this module: it either really stores a nomination or it
 * says it did not. There is no branch that accepts a submission, discards it,
 * and thanks the person anyway. When no database is configured — which is the
 * current state of this project, since Milestone 3's hosted half is
 * owner-gated — `isNominationCaptureConfigured()` returns false and the public
 * page renders a direct-contact route instead of a form. The exact steps to
 * turn capture on are in
 * `docs/08-delivery/founding-connectors-mvp.md` ("Enabling nomination capture").
 */

export type NominationWriteResult =
  | { readonly status: "stored" }
  /** No write path exists in this environment; nothing was stored. */
  | { readonly status: "unconfigured" }
  /** A write path exists but the insert failed; nothing was stored. */
  | { readonly status: "error" };

/**
 * Whether nominations can actually be persisted in this environment. Checked
 * without `readServiceRoleKey()` (which throws by design) so a page render can
 * ask the question safely.
 */
export function isNominationCaptureConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
    env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

/**
 * Store one validated nomination.
 *
 * Service role is required because `connector_nominations` is deny-by-default
 * with no client grants or policies (same posture as `onboarding_submissions`):
 * the row contains a real person's contact details, so no browser-reachable
 * role may read or write the table — the server writes on the visitor's behalf
 * and only admin-side server rendering ever reads it back.
 */
export async function storeNomination(
  nomination: Nomination,
): Promise<NominationWriteResult> {
  if (!isNominationCaptureConfigured()) {
    return { status: "unconfigured" };
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from("connector_nominations").insert({
      kind: nomination.kind,
      nominee_name: nomination.nomineeName,
      nominator_name: nomination.nominatorName,
      contact_method: nomination.contactMethod,
      contact_value: nomination.contactValue,
      instagram_handle: nomination.instagramHandle,
      neighborhood: nomination.neighborhood,
      community_role: nomination.communityRole,
      why: nomination.why,
      referral_source: nomination.referralSource,
      consent_to_contact: nomination.consentToContact,
    });

    if (error) {
      // Never log the row: it holds a person's contact details. The Postgres
      // error code is enough to diagnose a schema or permission problem.
      console.error(
        `Connector nomination insert failed (code ${error.code ?? "unknown"}).`,
      );
      return { status: "error" };
    }
    return { status: "stored" };
  } catch {
    console.error(
      "Connector nomination insert failed: the Supabase service client could not be created or reached.",
    );
    return { status: "error" };
  }
}

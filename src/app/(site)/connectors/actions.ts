"use server";

import {
  isHoneypotTripped,
  validateNomination,
  type NominationInput,
} from "@/lib/connectors/nomination";
import { storeNomination } from "@/lib/connectors/nomination-store";

import type { NominationState } from "./nomination-state";

/**
 * Server action behind the Founding Connector nomination form.
 *
 * The contract this action keeps: **it never tells someone their nomination
 * was received unless a row was actually written.** If no write path is
 * configured, or the write fails, the person is told plainly and given another
 * way to reach us. Silent-drop-and-thank-you is the failure mode this whole
 * design exists to avoid.
 *
 * This module may export **async functions only** — the state type and its
 * initial value live in `./nomination-state` for that reason. See
 * `tests/unit/connector-action-exports.test.ts`.
 */

function read(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

export async function submitNomination(
  _previous: NominationState,
  formData: FormData,
): Promise<NominationState> {
  const input: NominationInput = {
    kind: read(formData, "kind"),
    nomineeName: read(formData, "nomineeName"),
    nominatorName: read(formData, "nominatorName"),
    contactMethod: read(formData, "contactMethod"),
    contactValue: read(formData, "contactValue"),
    instagram: read(formData, "instagram"),
    neighborhood: read(formData, "neighborhood"),
    communityRole: read(formData, "communityRole"),
    why: read(formData, "why"),
    referralSource: read(formData, "referralSource"),
    consentToContact: read(formData, "consentToContact"),
    website: read(formData, "website"),
  };

  // Honeypot: a field no human sees and no human fills. Answered with the
  // ordinary success state so a script learns nothing from the difference; no
  // human is misled, because no human reaches this branch.
  if (isHoneypotTripped(input)) {
    return { status: "success" };
  }

  const validation = validateNomination(input);
  if (!validation.ok) {
    return { status: "invalid", errors: validation.errors };
  }

  const result = await storeNomination(validation.value);
  switch (result.status) {
    case "stored":
      return { status: "success" };
    case "unconfigured":
      return { status: "unavailable" };
    case "error":
      return { status: "error" };
  }
}

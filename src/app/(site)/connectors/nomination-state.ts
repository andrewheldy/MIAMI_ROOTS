import type { NominationField } from "@/lib/connectors/nomination";

/**
 * The state the nomination form and its Server Action pass back and forth.
 *
 * This lives in its own plain module rather than in `actions.ts` because a
 * `"use server"` file may only export async functions — exporting the initial
 * state object from there builds fine and then fails at request time with
 * "A 'use server' file can only export async functions, found object."
 * `tests/unit/connector-action-exports.test.ts` guards the rule.
 */
export type NominationState =
  | { readonly status: "idle" }
  | { readonly status: "success" }
  | {
      readonly status: "invalid";
      readonly errors: Partial<Record<NominationField, string>>;
    }
  /** No capture backend is configured in this environment. */
  | { readonly status: "unavailable" }
  /** A backend exists but the write failed. */
  | { readonly status: "error" };

export const initialNominationState: NominationState = { status: "idle" };

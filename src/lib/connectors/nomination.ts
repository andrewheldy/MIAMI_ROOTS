/**
 * Founding Connector nomination intake — field shape, normalization, and
 * validation.
 *
 * Pure logic with no I/O or framework imports, so the same rules are used by
 * the server action, by tests, and (for the trivial checks) by the browser.
 * The write path lives in `nomination-store.ts`, which is server-only.
 *
 * **Data-minimization decision.** A nomination collects exactly one person's
 * contact details: the person filling in the form. When someone nominates
 * another person we take that person's *name*, their *public* profile handle
 * if offered, and why they'd be good — never their phone number, email, or
 * address. Somebody who has not been asked yet has not consented to having
 * their contact details entered into a database by a third party. The
 * introduction comes back through the nominator instead, which is also how a
 * trust-based program should work.
 */

export type NominationKind = "self" | "other";

export const NOMINATION_KINDS: readonly NominationKind[] = ["self", "other"];

/** How the submitter prefers to be reached. */
export type ContactMethod = "email" | "instagram" | "whatsapp" | "other";

export const CONTACT_METHODS: readonly ContactMethod[] = [
  "email",
  "instagram",
  "whatsapp",
  "other",
];

/** Raw, untrusted values as they arrive from a form submission. */
export interface NominationInput {
  readonly kind?: string;
  readonly nomineeName?: string;
  readonly nominatorName?: string;
  readonly contactMethod?: string;
  readonly contactValue?: string;
  readonly instagram?: string;
  readonly neighborhood?: string;
  readonly communityRole?: string;
  readonly why?: string;
  readonly referralSource?: string;
  readonly consentToContact?: string | boolean;
  /**
   * Honeypot. A field no human sees and no human fills; a value here means a
   * bot. Rejected silently-successfully by the caller so scripts learn nothing.
   */
  readonly website?: string;
}

/** A validated nomination, ready to store. */
export interface Nomination {
  readonly kind: NominationKind;
  readonly nomineeName: string;
  readonly nominatorName: string | null;
  readonly contactMethod: ContactMethod;
  readonly contactValue: string;
  readonly instagramHandle: string | null;
  readonly neighborhood: string;
  readonly communityRole: string;
  readonly why: string;
  readonly referralSource: string | null;
  readonly consentToContact: true;
}

export type NominationField = keyof NominationInput;

export type NominationValidation =
  | { readonly ok: true; readonly value: Nomination }
  | {
      readonly ok: false;
      readonly errors: Partial<Record<NominationField, string>>;
    };

/** Field length bounds. Generous for humans, bounded against abuse. */
export const NOMINATION_LIMITS = {
  name: { min: 2, max: 80 },
  contact: { min: 3, max: 120 },
  instagram: { max: 40 },
  neighborhood: { min: 2, max: 60 },
  role: { min: 2, max: 80 },
  why: { min: 20, max: 1000 },
  referralSource: { max: 120 },
} as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

/** Multi-line answers keep their line breaks; only trailing space is trimmed. */
function paragraph(value: unknown): string {
  return typeof value === "string"
    ? value.trim().replace(/[ \t]+\n/g, "\n")
    : "";
}

/**
 * Normalize an Instagram handle to bare form: strips a leading `@`, a full
 * profile URL, and any trailing slash, so `@maya`,
 * `https://instagram.com/maya/`, and `maya` all store identically.
 */
export function normalizeInstagramHandle(value: unknown): string | null {
  let handle = text(value);
  if (!handle) {
    return null;
  }
  handle = handle.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  handle = handle.replace(/^@/, "").replace(/\/+$/, "").trim();
  if (!handle || !/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
    return null;
  }
  return handle.toLowerCase();
}

/** A deliberately forgiving email shape check — real delivery is the real test. */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@,]+\.[^\s@,]{2,}$/.test(value);
}

function checkLength(
  value: string,
  bounds: { min?: number; max: number },
  label: string,
): string | undefined {
  if (bounds.min !== undefined && value.length < bounds.min) {
    return `${label} — please add a little more.`;
  }
  if (value.length > bounds.max) {
    return `${label} — please keep it under ${bounds.max} characters.`;
  }
  return undefined;
}

/**
 * Validate and normalize a submission. Returns every field error at once
 * (rather than failing on the first) so a person fixes one form, not five.
 */
export function validateNomination(
  input: NominationInput,
): NominationValidation {
  const errors: Partial<Record<NominationField, string>> = {};

  const kind = NOMINATION_KINDS.includes(input.kind as NominationKind)
    ? (input.kind as NominationKind)
    : undefined;
  if (!kind) {
    errors.kind = "Tell us whether this is you or someone else.";
  }

  const nomineeName = text(input.nomineeName);
  if (!nomineeName) {
    errors.nomineeName = "A name is required.";
  } else {
    const problem = checkLength(nomineeName, NOMINATION_LIMITS.name, "Name");
    if (problem) {
      errors.nomineeName = problem;
    }
  }

  const nominatorName = text(input.nominatorName);
  if (kind === "other") {
    if (!nominatorName) {
      errors.nominatorName = "Tell us who you are, so we can follow up.";
    } else {
      const problem = checkLength(
        nominatorName,
        NOMINATION_LIMITS.name,
        "Your name",
      );
      if (problem) {
        errors.nominatorName = problem;
      }
    }
  }

  const contactMethod = CONTACT_METHODS.includes(
    input.contactMethod as ContactMethod,
  )
    ? (input.contactMethod as ContactMethod)
    : undefined;
  if (!contactMethod) {
    errors.contactMethod = "Pick how we should reach you.";
  }

  const contactValue = text(input.contactValue);
  if (!contactValue) {
    errors.contactValue = "We need one way to reach you.";
  } else {
    const problem = checkLength(
      contactValue,
      NOMINATION_LIMITS.contact,
      "Contact",
    );
    if (problem) {
      errors.contactValue = problem;
    } else if (contactMethod === "email" && !looksLikeEmail(contactValue)) {
      errors.contactValue = "That doesn't look like an email address.";
    }
  }

  const rawInstagram = text(input.instagram);
  const instagramHandle = normalizeInstagramHandle(rawInstagram);
  if (rawInstagram && !instagramHandle) {
    errors.instagram = "Use a handle like @miamiroots, or leave this blank.";
  }

  const neighborhood = text(input.neighborhood);
  if (!neighborhood) {
    errors.neighborhood = "Which part of Miami do you move through?";
  } else {
    const problem = checkLength(
      neighborhood,
      NOMINATION_LIMITS.neighborhood,
      "Neighborhood",
    );
    if (problem) {
      errors.neighborhood = problem;
    }
  }

  const communityRole = text(input.communityRole);
  if (!communityRole) {
    errors.communityRole = "What do you do in the community?";
  } else {
    const problem = checkLength(
      communityRole,
      NOMINATION_LIMITS.role,
      "Community role",
    );
    if (problem) {
      errors.communityRole = problem;
    }
  }

  const why = paragraph(input.why);
  if (!why) {
    errors.why = "This is the part we actually read.";
  } else {
    const problem = checkLength(why, NOMINATION_LIMITS.why, "Your answer");
    if (problem) {
      errors.why = problem;
    }
  }

  const referralSource = text(input.referralSource);
  const referralProblem = referralSource
    ? checkLength(referralSource, NOMINATION_LIMITS.referralSource, "Source")
    : undefined;
  if (referralProblem) {
    errors.referralSource = referralProblem;
  }

  const consented =
    input.consentToContact === true ||
    input.consentToContact === "on" ||
    input.consentToContact === "true";
  if (!consented) {
    errors.consentToContact = "We need your OK before we reach out.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      kind: kind as NominationKind,
      nomineeName,
      nominatorName: kind === "other" ? nominatorName : null,
      contactMethod: contactMethod as ContactMethod,
      contactValue,
      instagramHandle,
      neighborhood,
      communityRole,
      why,
      referralSource: referralSource || null,
      consentToContact: true,
    },
  };
}

/** Whether a submission tripped the honeypot (i.e. was almost certainly a bot). */
export function isHoneypotTripped(input: NominationInput): boolean {
  return text(input.website).length > 0;
}

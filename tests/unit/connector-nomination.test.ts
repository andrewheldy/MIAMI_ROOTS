import { describe, expect, it } from "vitest";

import {
  isHoneypotTripped,
  looksLikeEmail,
  normalizeInstagramHandle,
  validateNomination,
  type NominationInput,
} from "@/lib/connectors/nomination";

/** A submission that should always pass, which each test then breaks one way. */
const validSelfNomination: NominationInput = {
  kind: "self",
  nomineeName: "Maya",
  contactMethod: "instagram",
  contactValue: "@mayamoves",
  neighborhood: "Little Haiti",
  communityRole: "Runs a Saturday morning run club",
  why: "I have been organizing a free run club for two years and most of the regulars now know each other outside of it.",
  consentToContact: "on",
};

function errorsFor(overrides: Partial<NominationInput>) {
  const result = validateNomination({ ...validSelfNomination, ...overrides });
  return result.ok ? {} : result.errors;
}

describe("validateNomination", () => {
  it("accepts and normalizes a complete self-nomination", () => {
    const result = validateNomination({
      ...validSelfNomination,
      nomineeName: "  Maya   Suarez ",
      instagram: "https://instagram.com/MayaMoves/",
      referralSource: "Tapped a card at a run",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.nomineeName).toBe("Maya Suarez");
    expect(result.value.instagramHandle).toBe("mayamoves");
    expect(result.value.nominatorName).toBeNull();
    expect(result.value.referralSource).toBe("Tapped a card at a run");
    expect(result.value.consentToContact).toBe(true);
  });

  it("requires the nominator's own name when nominating someone else", () => {
    expect(errorsFor({ kind: "other" })).toHaveProperty("nominatorName");
    const result = validateNomination({
      ...validSelfNomination,
      kind: "other",
      nominatorName: "Andre",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nominatorName).toBe("Andre");
    }
  });

  it("drops a nominator name supplied on a self-nomination", () => {
    const result = validateNomination({
      ...validSelfNomination,
      nominatorName: "Somebody Else",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nominatorName).toBeNull();
    }
  });

  it("reports every problem at once rather than one at a time", () => {
    const errors = errorsFor({
      nomineeName: "",
      neighborhood: "",
      why: "",
      consentToContact: undefined,
    });
    expect(Object.keys(errors).sort()).toEqual([
      "consentToContact",
      "neighborhood",
      "nomineeName",
      "why",
    ]);
  });

  it("refuses to accept a submission without consent to be contacted", () => {
    expect(errorsFor({ consentToContact: undefined })).toHaveProperty(
      "consentToContact",
    );
    expect(errorsFor({ consentToContact: "false" })).toHaveProperty(
      "consentToContact",
    );
    expect(errorsFor({ consentToContact: true })).not.toHaveProperty(
      "consentToContact",
    );
  });

  it("checks the shape of an email only when email was chosen", () => {
    expect(
      errorsFor({ contactMethod: "email", contactValue: "not-an-email" }),
    ).toHaveProperty("contactValue");
    expect(
      errorsFor({ contactMethod: "email", contactValue: "maya@example.com" }),
    ).not.toHaveProperty("contactValue");
    // Same value under a different method is fine — it's just a handle.
    expect(
      errorsFor({ contactMethod: "other", contactValue: "not-an-email" }),
    ).not.toHaveProperty("contactValue");
  });

  it("rejects unknown enum values instead of coercing them", () => {
    expect(errorsFor({ kind: "admin" })).toHaveProperty("kind");
    expect(errorsFor({ contactMethod: "telepathy" })).toHaveProperty(
      "contactMethod",
    );
  });

  it("bounds every free-text field", () => {
    expect(errorsFor({ nomineeName: "x".repeat(81) })).toHaveProperty(
      "nomineeName",
    );
    expect(errorsFor({ why: "too short" })).toHaveProperty("why");
    expect(errorsFor({ why: "x".repeat(1001) })).toHaveProperty("why");
    expect(errorsFor({ referralSource: "x".repeat(121) })).toHaveProperty(
      "referralSource",
    );
  });

  it("flags an Instagram value it cannot make sense of, but allows blank", () => {
    expect(errorsFor({ instagram: "not a handle!" })).toHaveProperty(
      "instagram",
    );
    expect(errorsFor({ instagram: "" })).not.toHaveProperty("instagram");
  });
});

describe("normalizeInstagramHandle", () => {
  it("reduces every way people write a handle to one stored form", () => {
    for (const input of [
      "maya",
      "@maya",
      "MAYA",
      "https://instagram.com/maya",
      "https://www.instagram.com/maya/",
      "  @Maya  ",
    ]) {
      expect(normalizeInstagramHandle(input), input).toBe("maya");
    }
  });

  it("returns null for blanks and for things that are not handles", () => {
    expect(normalizeInstagramHandle("")).toBeNull();
    expect(normalizeInstagramHandle(undefined)).toBeNull();
    expect(normalizeInstagramHandle("two words")).toBeNull();
    expect(normalizeInstagramHandle("a".repeat(31))).toBeNull();
  });
});

describe("looksLikeEmail", () => {
  it("accepts ordinary addresses and rejects obvious non-addresses", () => {
    expect(looksLikeEmail("maya@example.com")).toBe(true);
    expect(looksLikeEmail("maya.s+roots@mail.example.co")).toBe(true);
    expect(looksLikeEmail("maya@example")).toBe(false);
    expect(looksLikeEmail("maya at example.com")).toBe(false);
    expect(looksLikeEmail("@example.com")).toBe(false);
  });
});

describe("isHoneypotTripped", () => {
  it("is quiet for humans and loud for bots", () => {
    expect(isHoneypotTripped(validSelfNomination)).toBe(false);
    expect(isHoneypotTripped({ ...validSelfNomination, website: "  " })).toBe(
      false,
    );
    expect(
      isHoneypotTripped({
        ...validSelfNomination,
        website: "https://spam.example",
      }),
    ).toBe(true);
  });
});

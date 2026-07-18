import { describe, expect, it } from "vitest";

import { readPublicSupabaseEnv, readServiceRoleKey } from "@/lib/supabase/env";

// Keys below are obviously-fake placeholders exercising validation shape only.
const VALID_PUBLIC = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-placeholder",
};

describe("readPublicSupabaseEnv", () => {
  it("returns the validated url + anon key", () => {
    expect(readPublicSupabaseEnv(VALID_PUBLIC)).toEqual({
      url: "https://example-project.supabase.co",
      anonKey: "anon-key-placeholder",
    });
  });

  it("names the missing variable without echoing values", () => {
    expect(() => readPublicSupabaseEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() =>
      readPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: VALID_PUBLIC.NEXT_PUBLIC_SUPABASE_URL,
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
    expect(() =>
      readPublicSupabaseEnv({
        ...VALID_PUBLIC,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "   ",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });

  it("rejects malformed and non-https URLs", () => {
    expect(() =>
      readPublicSupabaseEnv({
        ...VALID_PUBLIC,
        NEXT_PUBLIC_SUPABASE_URL: "not a url",
      }),
    ).toThrow(/not a valid URL/);
    expect(() =>
      readPublicSupabaseEnv({
        ...VALID_PUBLIC,
        NEXT_PUBLIC_SUPABASE_URL: "http://example-project.supabase.co",
      }),
    ).toThrow(/https/);
  });

  it("allows plain http only for localhost development", () => {
    expect(
      readPublicSupabaseEnv({
        ...VALID_PUBLIC,
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      }).url,
    ).toBe("http://127.0.0.1:54321");
  });
});

describe("readServiceRoleKey", () => {
  it("returns the key when configured safely", () => {
    expect(
      readServiceRoleKey({
        ...VALID_PUBLIC,
        SUPABASE_SERVICE_ROLE_KEY: "service-key-placeholder",
      }),
    ).toBe("service-key-placeholder");
  });

  it("rejects a missing key with the variable name", () => {
    expect(() => readServiceRoleKey({})).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("rejects a service key equal to the anon key (wrong paste)", () => {
    expect(() =>
      readServiceRoleKey({
        ...VALID_PUBLIC,
        SUPABASE_SERVICE_ROLE_KEY: VALID_PUBLIC.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }),
    ).toThrow(/wrong value/);
  });

  it("rejects a NEXT_PUBLIC_-prefixed service key outright", () => {
    expect(() =>
      readServiceRoleKey({
        ...VALID_PUBLIC,
        SUPABASE_SERVICE_ROLE_KEY: "service-key-placeholder",
        NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "leaked",
      }),
    ).toThrow(/NEVER carry the NEXT_PUBLIC_ prefix/);
  });
});

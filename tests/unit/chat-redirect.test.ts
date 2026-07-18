import { describe, expect, it } from "vitest";

import {
  APPROVED_REDIRECT_HOSTS,
  resolveChatDestination,
} from "@/lib/chat-redirect";

// Example invite codes below are made up — they exercise URL shape only.
describe("resolveChatDestination", () => {
  it("reports missing for unset or blank values", () => {
    expect(resolveChatDestination(undefined)).toEqual({
      ok: false,
      reason: "missing",
    });
    expect(resolveChatDestination("")).toEqual({
      ok: false,
      reason: "missing",
    });
    expect(resolveChatDestination("   ")).toEqual({
      ok: false,
      reason: "missing",
    });
  });

  it("accepts https URLs on every approved WhatsApp host", () => {
    for (const host of APPROVED_REDIRECT_HOSTS) {
      const result = resolveChatDestination(`https://${host}/AbCdEf123`);
      expect(result).toEqual({ ok: true, url: `https://${host}/AbCdEf123` });
    }
  });

  it("tolerates surrounding whitespace in the configured value", () => {
    expect(
      resolveChatDestination("  https://chat.whatsapp.com/AbCdEf123  "),
    ).toEqual({ ok: true, url: "https://chat.whatsapp.com/AbCdEf123" });
  });

  it("rejects non-https schemes", () => {
    for (const value of [
      "http://chat.whatsapp.com/AbCdEf123",
      "ftp://chat.whatsapp.com/AbCdEf123",
      "javascript:alert(1)",
      "whatsapp://chat",
    ]) {
      expect(resolveChatDestination(value)).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });

  it("rejects hosts outside the allowlist", () => {
    for (const value of [
      "https://example.com/AbCdEf123",
      "https://evil.example/chat.whatsapp.com",
      // Lookalike subdomain — hostname is NOT chat.whatsapp.com.
      "https://chat.whatsapp.com.evil.example/AbCdEf123",
      // Userinfo trick — real hostname is evil.example.
      "https://chat.whatsapp.com@evil.example/AbCdEf123",
      // Subdomain of an approved host is still not an exact match.
      "https://api.whatsapp.com/send",
    ]) {
      expect(resolveChatDestination(value)).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });

  it("rejects values that are not URLs at all", () => {
    for (const value of ["not a url", "chat.whatsapp.com/AbCdEf123", "//x"]) {
      expect(resolveChatDestination(value)).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });
});

import { afterEach, describe, expect, it } from "vitest";

import {
  APPROVED_REDIRECT_HOSTS,
  resolveChatDestination,
} from "@/lib/chat-redirect";
import { getChatLinkByRedirectSlug } from "@/content/join/chat-links";

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

/**
 * Exercises the exact wiring `/go/ticket-exchange` uses: read the group's own
 * server env var (name from the registry) and resolve it. Mirrors the shipped
 * route so a regression in either the var name or the resolution shows up here.
 */
describe("Ticket Exchange redirect wiring (/go/ticket-exchange)", () => {
  const ticket = getChatLinkByRedirectSlug("ticket-exchange");
  const envVar = ticket!.envVar;
  const original = process.env[envVar];

  afterEach(() => {
    if (original === undefined) delete process.env[envVar];
    else process.env[envVar] = original;
  });

  it("reads the WHATSAPP_TICKET_EXCHANGE_URL variable", () => {
    expect(envVar).toBe("WHATSAPP_TICKET_EXCHANGE_URL");
  });

  it("shows the unavailable state when the variable is missing", () => {
    delete process.env[envVar];
    expect(resolveChatDestination(process.env[envVar])).toEqual({
      ok: false,
      reason: "missing",
    });
  });

  it("shows the unavailable state when the variable is an invalid URL", () => {
    process.env[envVar] = "https://evil.example/not-whatsapp";
    expect(resolveChatDestination(process.env[envVar])).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("redirects when the variable is a valid WhatsApp invite URL", () => {
    process.env[envVar] = "https://chat.whatsapp.com/TicketExch123";
    expect(resolveChatDestination(process.env[envVar])).toEqual({
      ok: true,
      url: "https://chat.whatsapp.com/TicketExch123",
    });
  });
});

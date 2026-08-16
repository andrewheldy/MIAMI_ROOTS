import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import GoPage from "@/app/go/[slug]/page";
import { chatLinks } from "@/content/join/chat-links";
import { MIAMI_ROOTS_COMMUNITY_URL } from "@/content/join/community-link";

/**
 * Behavior of the `/go/<slug>` redirect gate, exercised through the route
 * component itself rather than through a stand-in, because the thing worth
 * proving is what the route does with a request.
 *
 * Next signals both redirects and 404s by throwing a tagged error, so a call
 * that "throws" here is the success path. The error's digest carries the
 * destination and the HTTP status, which is exactly what a browser will act on:
 *
 *   NEXT_REDIRECT;replace;https://example.test/x;307;
 */

/** Run the route and report how it answered. */
async function callGoPage(
  slug: string,
): Promise<
  | { readonly kind: "redirect"; readonly url: string; readonly status: string }
  | { readonly kind: "notFound" }
  | { readonly kind: "rendered"; readonly html: string }
> {
  let element: ReactElement;
  try {
    element = (await GoPage({
      params: Promise.resolve({ slug }),
    })) as ReactElement;
  } catch (error) {
    const digest = (error as { digest?: string }).digest ?? "";
    if (digest.startsWith("NEXT_REDIRECT")) {
      const [, , url, status] = digest.split(";");
      return { kind: "redirect", url: url!, status: status! };
    }
    if (digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) {
      return { kind: "notFound" };
    }
    throw error;
  }
  return { kind: "rendered", html: renderToStaticMarkup(element) };
}

const CHAT_SLUG = "general-chat";
const CHAT_ENV_VAR = chatLinks.find(
  (link) => link.redirectSlug === CHAT_SLUG,
)!.envVar;

describe("/go/community (the one call to action)", () => {
  const saved = process.env.WHATSAPP_COMMUNITY_URL;

  afterEach(() => {
    if (saved === undefined) {
      delete process.env.WHATSAPP_COMMUNITY_URL;
    } else {
      process.env.WHATSAPP_COMMUNITY_URL = saved;
    }
  });

  it("redirects to the canonical WhatsApp Community URL", async () => {
    const result = await callGoPage("community");
    expect(result).toEqual({
      kind: "redirect",
      url: MIAMI_ROOTS_COMMUNITY_URL,
      status: "307",
    });
  });

  it("redirects with no WHATSAPP_COMMUNITY_URL present", async () => {
    delete process.env.WHATSAPP_COMMUNITY_URL;
    const result = await callGoPage("community");
    expect(result).toMatchObject({
      kind: "redirect",
      url: MIAMI_ROOTS_COMMUNITY_URL,
    });
  });

  it("ignores the retired environment variable entirely", async () => {
    // A stale value left behind in a hosting dashboard must not win over the
    // constant, or the bug this change fixed would come back quietly.
    process.env.WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/StaleValue";
    const result = await callGoPage("community");
    expect(result).toMatchObject({
      kind: "redirect",
      url: MIAMI_ROOTS_COMMUNITY_URL,
    });
  });

  it("never renders the unavailable state, whatever the environment", async () => {
    delete process.env.WHATSAPP_COMMUNITY_URL;
    const result = await callGoPage("community");
    expect(result.kind).toBe("redirect");
    expect(JSON.stringify(result)).not.toContain("rekeyed");
  });

  it("redirects temporarily, so the destination stays changeable", async () => {
    const result = await callGoPage("community");
    // 307, not 308: a permanent redirect would be cached by browsers and
    // outlive the next rotation of the invite.
    expect(result).toMatchObject({ status: "307" });
  });
});

describe("/go/<chat> (per-chat links, unchanged)", () => {
  const saved = process.env[CHAT_ENV_VAR];

  beforeEach(() => {
    delete process.env[CHAT_ENV_VAR];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (saved === undefined) {
      delete process.env[CHAT_ENV_VAR];
    } else {
      process.env[CHAT_ENV_VAR] = saved;
    }
  });

  it("still resolves its destination from its environment variable", async () => {
    process.env[CHAT_ENV_VAR] = "https://chat.whatsapp.com/PerChatValue";
    const result = await callGoPage(CHAT_SLUG);
    expect(result).toMatchObject({
      kind: "redirect",
      url: "https://chat.whatsapp.com/PerChatValue",
    });
  });

  it("keeps its honest unavailable state when the variable is unset", async () => {
    const result = await callGoPage(CHAT_SLUG);
    expect(result.kind).toBe("rendered");
    if (result.kind !== "rendered") return;
    expect(result.html).toContain("isn&#x27;t open right now");
    expect(result.html).toContain("Back to the front door");
  });

  it("refuses a destination that is not an approved WhatsApp host", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    process.env[CHAT_ENV_VAR] = "https://evil.example/chat.whatsapp.com";
    const result = await callGoPage(CHAT_SLUG);
    expect(result.kind).toBe("rendered");
    // The warning names the variable, never its value.
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]![0]).toContain(CHAT_ENV_VAR);
    expect(warn.mock.calls[0]![0]).not.toContain("evil.example");
  });

  it("404s on a slug that was never issued", async () => {
    const result = await callGoPage("not-a-real-chat");
    expect(result).toEqual({ kind: "notFound" });
  });
});

/**
 * Server-side resolution of a chat redirect destination. Pure logic, kept out
 * of the route file so it can be unit-tested. Only ever called from server
 * code (`/go/[slug]`); invite URLs must never reach a client bundle.
 */

/**
 * Hosts a `/go` route may redirect to. Exact hostname match — this rejects
 * lookalike subdomains (`chat.whatsapp.com.evil.example`) and userinfo tricks
 * (`https://chat.whatsapp.com@evil.example`), since `URL` resolves the real
 * hostname before we compare.
 */
export const APPROVED_REDIRECT_HOSTS: readonly string[] = [
  "chat.whatsapp.com",
  "wa.me",
  "whatsapp.com",
  "www.whatsapp.com",
];

export type ChatDestination =
  | { readonly ok: true; readonly url: string }
  | { readonly ok: false; readonly reason: "missing" | "invalid" };

/**
 * Validate a configured invite URL. Returns `ok` only for a well-formed
 * `https://` URL on an approved WhatsApp host; everything else collapses to
 * `missing` (unset/blank) or `invalid` (set but unsafe), and the caller shows
 * the unavailable state rather than redirecting. Never include the raw value
 * in errors or logs — treat it as a credential even when malformed.
 */
export function resolveChatDestination(
  envValue: string | undefined,
): ChatDestination {
  const value = envValue?.trim();
  if (!value) {
    return { ok: false, reason: "missing" };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "invalid" };
  }
  if (!APPROVED_REDIRECT_HOSTS.includes(parsed.hostname)) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, url: parsed.toString() };
}

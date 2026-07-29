/**
 * Share and copy behavior, expressed as small pure-ish functions that take the
 * platform `navigator` as an argument. Keeping the branching logic out of the
 * React components makes every path — native share, dismissal, copy fallback,
 * and hard failure — unit-testable in Node with a fake navigator, and keeps the
 * components thin.
 *
 * Contract: use the Web Share API when the browser exposes it (iOS/Android and
 * some desktop browsers); otherwise, or if a share attempt fails for any reason
 * other than the user dismissing it, fall back to copying the URL to the
 * clipboard. There is always a graceful outcome.
 */

export interface SharePayload {
  readonly url: string;
  readonly title: string;
  readonly text?: string;
}

/** What actually happened, so the UI can show the right feedback. */
export type ShareOutcome = "shared" | "copied" | "dismissed" | "error";

/** The minimal navigator surface these helpers depend on (for testability). */
export interface ShareCapableNavigator {
  share?: (data: {
    title?: string;
    text?: string;
    url?: string;
  }) => Promise<void>;
  clipboard?: { writeText?: (text: string) => Promise<void> };
}

/** Whether the runtime can present a native share sheet. */
export function canNativeShare(
  nav: ShareCapableNavigator | undefined,
): nav is ShareCapableNavigator & {
  share: NonNullable<ShareCapableNavigator["share"]>;
} {
  return typeof nav?.share === "function";
}

function isAbort(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "AbortError"
  );
}

/** Copy `text` to the clipboard, resolving to whether it succeeded. */
export async function copyToClipboard(
  nav: ShareCapableNavigator | undefined,
  text: string,
): Promise<boolean> {
  const clipboard = nav?.clipboard;
  const writeText = clipboard?.writeText;
  if (typeof writeText !== "function") {
    return false;
  }
  try {
    await writeText.call(clipboard, text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share `payload` via the native sheet when available, otherwise copy its URL.
 * If a native share is dismissed by the user, report `"dismissed"` (no error).
 * If a native share fails for any other reason, fall back to copying the link.
 */
export async function shareOrCopy(
  nav: ShareCapableNavigator | undefined,
  payload: SharePayload,
): Promise<ShareOutcome> {
  if (canNativeShare(nav)) {
    try {
      await nav.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return "shared";
    } catch (error) {
      if (isAbort(error)) {
        return "dismissed";
      }
      // Fall through to the copy fallback below.
    }
  }
  return (await copyToClipboard(nav, payload.url)) ? "copied" : "error";
}

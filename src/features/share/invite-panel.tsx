import { cn } from "@/lib/cn";
import { buildJoinShareUrl, QR_SHARE_URL } from "@/lib/share/destination";

import { CopyLinkField } from "./copy-link-field";
import { QrImage } from "./qr-image";
import { ShareButton } from "./share-button";
import { ShareLauncher } from "./share-launcher";

interface InvitePanelProps {
  /** Heading text. Kept per-surface so the same panel does not repeat itself. */
  heading: string;
  /** ID for the section's `aria-labelledby`. */
  headingId: string;
  /** One or two sentences under the heading. */
  body: string;
  /** `mint` for the light band, `dark` for the forest band. */
  tone?: "mint" | "dark";
  /** Include the rewards line. Shown once per page at most. */
  withRewardsNote?: boolean;
  className?: string;
}

/**
 * Everything a member needs to bring someone in, in one block: the link they
 * can read and copy by hand, the share sheet their phone already has, a QR
 * code big enough to scan off a screen across a table, and the saved cards for
 * a story post.
 *
 * The QR is generated at render, not shipped as an image file, so it can never
 * drift from the destination it claims to encode.
 *
 * Server Component. The three interactive pieces inside it are the only client
 * code, and each is small.
 */
export function InvitePanel({
  heading,
  headingId,
  body,
  tone = "mint",
  withRewardsNote = false,
  className,
}: InvitePanelProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "rounded-3xl border px-5 py-8 sm:px-10 sm:py-10",
        dark ? "bg-forest border-white/15" : "border-mint/60 bg-mint-100",
        className,
      )}
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start md:gap-12">
        <div className="min-w-0">
          <h2
            id={headingId}
            className={cn(
              "text-title font-bold text-balance",
              dark ? "text-white" : "text-forest",
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "mt-3 max-w-[54ch] leading-relaxed text-pretty",
              dark ? "text-white/80" : "text-muted",
            )}
          >
            {body}
          </p>

          <CopyLinkField
            appearance={dark ? "light" : "dark"}
            className="mt-6 max-w-xl"
          />

          <div className="mt-5 flex flex-wrap items-start gap-x-4 gap-y-3">
            <ShareButton
              url={buildJoinShareUrl("web_share")}
              label="Send it to a friend"
              appearance={dark ? "light" : "dark"}
            />
            <ShareLauncher
              className="pt-0.5"
              triggers={[
                {
                  label: "Show the QR full screen",
                  target: "fullscreen",
                  variant: dark ? "quietOnDark" : "quiet",
                },
                {
                  label: "Save a card for your story",
                  target: "card",
                  variant: dark ? "quietOnDark" : "quiet",
                },
              ]}
            />
          </div>
        </div>

        {/* The QR, at scanning size. White ground because that is what phone
            cameras expect and what scans fastest in bad light. On a phone it
            sits directly under the share actions, which is the order somebody
            standing next to a friend actually needs. */}
        <figure className="mx-auto w-full max-w-[15rem] md:mx-0">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <QrImage
              value={QR_SHARE_URL}
              ecc="M"
              title="QR code that opens the Miami Roots join page"
            />
          </div>
          <figcaption
            className={cn(
              "mt-3 text-center text-sm md:text-left",
              dark ? "text-white/70" : "text-muted",
            )}
          >
            Point a camera here. Works off a screen or off paper.
          </figcaption>
        </figure>

        {/* Last, deliberately: the tools come first, and the note about what
            might come later never competes with them. */}
        {withRewardsNote ? (
          <p
            className={cn(
              "max-w-[62ch] border-t pt-5 text-sm leading-relaxed md:col-span-2",
              dark
                ? "border-white/15 text-white/70"
                : "border-forest/15 text-muted",
            )}
          >
            <span className={dark ? "text-mint" : "text-forest font-semibold"}>
              Later this year:
            </span>{" "}
            we are working out a way to credit the people who keep bringing
            others in. Nothing is counted yet and nothing is being tracked, so
            invite people because you want them here, not for points.
          </p>
        ) : null}
      </div>
    </div>
  );
}

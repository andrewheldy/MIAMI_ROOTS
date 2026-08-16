import { joinNavLink } from "@/config/navigation";
import { cn } from "@/lib/cn";

type JoinTone = "solid" | "onDark";

interface JoinActionProps {
  /** `solid` for light grounds, `onDark` for the forest hero band. */
  tone?: JoinTone;
  /** Show the "Opens WhatsApp" line under the button. */
  withNote?: boolean;
  /** Full width on mobile, auto from `sm` up. */
  block?: boolean;
  className?: string;
}

const TONES: Record<JoinTone, string> = {
  solid: "bg-forest text-background hover:bg-forest-600",
  onDark: "bg-mint text-forest hover:bg-white",
};

/**
 * The site's single call to action, in one component so it can never drift.
 *
 * Every surface renders this: the header, the hero, the close of each page, the
 * mobile sheet. Same label, same destination, no variants, because a visitor
 * who sees three different join buttons has to choose, and choosing is the
 * thing this page exists to remove.
 *
 * It is a plain anchor rather than `next/link` on purpose. `/go/community` is a
 * server-side redirect out to WhatsApp, so there is nothing worth prefetching
 * and a prefetch would only resolve a redirect nobody asked for yet.
 *
 * Server Component.
 */
export function JoinAction({
  tone = "solid",
  withNote = false,
  block = false,
  className,
}: JoinActionProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-col gap-2",
        block && "w-full sm:w-auto",
        className,
      )}
    >
      <a
        href={joinNavLink.href}
        className={cn(
          "inline-flex min-h-13 items-center justify-center rounded-xl px-7 text-base font-semibold tracking-tight transition-colors motion-safe:active:scale-[0.99]",
          TONES[tone],
          block && "w-full sm:w-auto",
        )}
      >
        {joinNavLink.label}
      </a>
      {withNote ? (
        <span
          className={cn(
            "text-sm",
            tone === "onDark" ? "text-white/70" : "text-muted",
          )}
        >
          Opens WhatsApp. Free, and you can leave any time.
        </span>
      ) : null}
    </span>
  );
}

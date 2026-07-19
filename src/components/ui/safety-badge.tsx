import { cn } from "@/lib/cn";

interface SafetyBadgeProps {
  /** Short label, e.g. "Buy & sell safely". */
  label: string;
  className?: string;
}

/**
 * A restrained shield pill used to mark a group whose activity carries
 * member-to-member risk (Ticket Exchange). Deliberately quiet — brand mint, not
 * alarm-red — so it reads as helpful guidance, not a warning. Server Component.
 */
export function SafetyBadge({ label, className }: SafetyBadgeProps) {
  return (
    <span
      className={cn(
        "bg-mint-100 text-forest border-forest/15 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        <path d="M8 1.5l5 2v4c0 3-2.2 4.6-5 5.5-2.8-.9-5-2.5-5-5.5v-4l5-2z" />
        <path d="M6 8l1.5 1.5L10.5 6.5" />
      </svg>
      {label}
    </span>
  );
}
